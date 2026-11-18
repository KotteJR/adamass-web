"use client";

import { useEffect, useId, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BookingCopy, BookingError, BriefTopicOption, ContactContent } from "@/content/contact";
import type { Lang } from "@/content/locale";
import { BOOKING_LIMITS, type BookingField } from "@/lib/booking/request";
import { cn } from "@/lib/utils";
import { closeContactDialog } from "./ContactDialog";
import { FieldError } from "./FieldError";

type Host = { name: string; initials: string; tone: "deep" | "steel" };

type BookingPanelProps = {
  lang: Lang;
  copy: BookingCopy;
  form: ContactContent["form"];
  topics: readonly BriefTopicOption[];
  hosts: readonly Host[];
  /** "all": every host joins. "any": one of them takes the call. */
  mode: "all" | "any";
  bookedPath: string;
};

/** What the confirmation page reads back. In session storage, never in the address. */
export const BOOKED_KEY = "adamass:booked";

const LOCALE = { en: "en-GB", sv: "sv-SE" } as const;

const FIELD = cn(
  "rounded-lg border-0 bg-soft px-3.5 text-md text-ink shadow-none md:text-md",
  "placeholder:text-haze focus-visible:ring-2 focus-visible:ring-lit/40",
  "aria-invalid:ring-2 aria-invalid:ring-destructive/30",
);

/** The visitor's time zone, once in the browser (the server cannot know it). */
const subscribeNever = () => () => {};
const browserZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Stockholm";

/** "2026-11-18" for an instant, in a zone. */
const dayKey = (iso: string, zone: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

const shiftMonth = (month: string, by: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

const atNoon = (key: string) => new Date(`${key}T12:00:00Z`);

/** Monday 0 to Sunday 6. */
const weekdayIndex = (key: string) => (atNoon(key).getUTCDay() + 6) % 7;

/**
 * A month's days for the grid, Monday first. In the first month the weeks before
 * the first free day are left out; weekends show only when a time falls on one
 * (a visitor far east of Sweden).
 */
function monthGrid(month: string, from: string | undefined, weekends: boolean) {
  const [y, m] = month.split("-").map(Number);
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let days = Array.from({ length: count }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
  if (from?.startsWith(month)) {
    const monday = new Date(atNoon(from).getTime() - weekdayIndex(from) * 86_400_000).toISOString().slice(0, 10);
    days = days.filter((key) => key >= monday);
  }
  if (!weekends) days = days.filter((key) => weekdayIndex(key) < 5);
  return { lead: days.length > 0 ? weekdayIndex(days[0]) : 0, days };
}
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

type Load = { state: "loading" } | { state: "failed" } | { state: "ready"; slots: string[] };
type Notice = "" | "taken" | "failed" | "busy" | "invalid";

/**
 * The booking calendar: a month of days with free times, the day's times, then
 * a short form. Times come from /api/booking/slots and show in the visitor's
 * own time zone; the call is booked by /api/booking, which checks the
 * calendars again before it writes anything.
 */
export function BookingPanel({ lang, copy, form, topics, hosts, mode, bookedPath }: BookingPanelProps) {
  const router = useRouter();
  const id = useId();
  const locale = LOCALE[lang];
  const zone = useSyncExternalStore(subscribeNever, browserZone, () => null);

  const [reload, setReload] = useState(0);
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [fields, setFields] = useState({ name: "", email: "", company: "", topic: topics[0]?.value ?? "", note: "", website: "" });
  const [errors, setErrors] = useState<Partial<Record<BookingField, BookingError>>>({});
  const [notice, setNotice] = useState<Notice>("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/booking/slots", { cache: "no-store" })
      .then((response) => (response.ok ? (response.json() as Promise<{ slots: string[] }>) : Promise.reject(new Error(String(response.status)))))
      .then(({ slots }) => live && setLoad({ state: "ready", slots }))
      .catch(() => live && setLoad({ state: "failed" }));
    return () => {
      live = false;
    };
  }, [reload]);

  // Free times grouped by the visitor's calendar day.
  const byDay = useMemo(() => {
    const groups = new Map<string, string[]>();
    if (load.state !== "ready" || !zone) return groups;
    for (const start of load.slots) {
      const key = dayKey(start, zone);
      groups.set(key, [...(groups.get(key) ?? []), start]);
    }
    return groups;
  }, [load, zone]);
  const dayKeys = [...byDay.keys()];
  const activeDay = day && byDay.has(day) ? day : (dayKeys[0] ?? null);
  const firstMonth = dayKeys[0]?.slice(0, 7);
  const lastMonth = dayKeys[dayKeys.length - 1]?.slice(0, 7);
  const activeMonth = month ?? activeDay?.slice(0, 7) ?? null;

  const time = (iso: string) =>
    new Intl.DateTimeFormat(locale, { timeZone: zone ?? undefined, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
  const shortDay = (key: string) =>
    capital(new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(atNoon(key)));
  const longDay = (key: string) =>
    capital(new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(atNoon(key)));
  const zoneLabel = (zone ?? "").split("/").pop()?.replace(/_/g, " ") ?? "";
  const footnote = copy.footnote.replace("{zone}", zoneLabel);
  const weekends = dayKeys.some((key) => weekdayIndex(key) >= 5);
  const grid = activeMonth ? monthGrid(activeMonth, dayKeys[0], weekends) : null;
  const hostNames = new Intl.ListFormat(locale, { type: mode === "all" ? "conjunction" : "disjunction" }).format(hosts.map((h) => h.name.split(" ")[0]));

  const set = (key: keyof typeof fields) => (value: string) => setFields((current) => ({ ...current, [key]: value }));
  const errorId = (field: BookingField) => `${id}-${field}-error`;
  const message = (field: BookingField) => (errors[field] ? copy.errors[errors[field]] : undefined);

  const pickAgain = () => {
    setSlot(null);
    setLoad({ state: "loading" });
    setReload((n) => n + 1);
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!slot) return;
    setPending(true);
    setNotice("");
    setErrors({});
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, start: slot, timeZone: zone, lang }),
      });
      const data = (await response.json().catch(() => ({}))) as { status?: string; start?: string; end?: string; errors?: Partial<Record<BookingField, BookingError>> };
      if (response.ok && data.status === "booked") {
        try {
          sessionStorage.setItem(BOOKED_KEY, JSON.stringify({ start: data.start, end: data.end, email: fields.email, zone }));
        } catch {
          // Private windows may refuse storage; the page then says it more generally.
        }
        closeContactDialog();
        router.push(bookedPath);
        return;
      }
      if (data.status === "taken") {
        setNotice("taken");
        pickAgain();
      } else if (data.status === "invalid") {
        setErrors(data.errors ?? {});
        setNotice("invalid");
        if (data.errors?.slot) pickAgain();
      } else {
        setNotice(response.status === 429 ? "busy" : "failed");
      }
    } catch {
      setNotice("failed");
    }
    setPending(false);
  }

  const status = pending ? copy.pending : notice === "taken" ? copy.taken : notice === "invalid" ? copy.invalid : notice === "failed" ? copy.failed : notice === "busy" ? copy.busy : load.state === "loading" ? copy.loading : "";

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className="sr-only">
        {status}
      </p>

      {notice === "taken" ? <p className="text-sm text-destructive">{copy.taken}</p> : null}

      {slot ? (
        <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-soft px-4 py-3">
            <div className="flex flex-col gap-1">
              <MonoLabel>{copy.chosen}</MonoLabel>
              <span className="text-md font-medium text-ink">
                {longDay(dayKey(slot, zone ?? "UTC"))}, {time(slot)}–{time(new Date(Date.parse(slot) + 30 * 60_000).toISOString())}
              </span>
              <span className="text-xs text-slate">
                {copy.with} {hostNames} · {footnote}
              </span>
            </div>
            <button type="button" onClick={() => setSlot(null)} className="min-h-11 shrink-0 text-sm font-medium text-ink underline-offset-4 hover:text-lit hover:underline">
              {copy.change}
            </button>
          </div>

          <fieldset aria-describedby={errors.topic ? errorId("topic") : undefined}>
            <legend className="sr-only">{form.topicLegend}</legend>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <label
                  key={topic.value}
                  className={cn(
                    "inline-flex h-11 cursor-pointer items-center rounded-sm bg-soft px-4 text-sm text-[#3b3f46] transition-colors dark:text-ink-2 select-none hover:bg-soft-2 lg:h-8 lg:px-2.5",
                    "has-checked:bg-ink has-checked:text-canvas dark:has-checked:text-canvas",
                    "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lit",
                  )}
                >
                  <input type="radio" name="topic" value={topic.value} checked={fields.topic === topic.value} onChange={() => set("topic")(topic.value)} className="sr-only" />
                  {topic.label}
                </label>
              ))}
            </div>
            {message("topic") ? <FieldError id={errorId("topic")}>{message("topic")!}</FieldError> : null}
          </fieldset>

          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["name", form.name, "name", "text", BOOKING_LIMITS.name],
                ["email", form.email, "email", "email", BOOKING_LIMITS.email],
              ] as const
            ).map(([field, label, autoComplete, type, max]) => (
              <div key={field}>
                <Label htmlFor={`${id}-${field}`} className="sr-only">
                  {label}
                </Label>
                <Input
                  id={`${id}-${field}`}
                  name={field}
                  type={type}
                  autoComplete={autoComplete}
                  required
                  maxLength={max}
                  placeholder={label}
                  value={fields[field]}
                  onChange={(event) => set(field)(event.target.value)}
                  aria-invalid={errors[field] ? true : undefined}
                  aria-describedby={errors[field] ? errorId(field) : undefined}
                  className={cn(FIELD, "h-12 sm:h-11")}
                />
                {message(field) ? <FieldError id={errorId(field)}>{message(field)!}</FieldError> : null}
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor={`${id}-company`} className="sr-only">
              {copy.company}
            </Label>
            <Input
              id={`${id}-company`}
              name="company"
              autoComplete="organization"
              maxLength={BOOKING_LIMITS.company}
              placeholder={copy.company}
              value={fields.company}
              onChange={(event) => set("company")(event.target.value)}
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={errors.company ? errorId("company") : undefined}
              className={cn(FIELD, "h-12 sm:h-11")}
            />
            {message("company") ? <FieldError id={errorId("company")}>{message("company")!}</FieldError> : null}
          </div>

          <div>
            <Label htmlFor={`${id}-note`} className="sr-only">
              {copy.note}
            </Label>
            <Textarea
              id={`${id}-note`}
              name="note"
              maxLength={BOOKING_LIMITS.note}
              placeholder={copy.note}
              value={fields.note}
              onChange={(event) => set("note")(event.target.value)}
              aria-invalid={errors.note ? true : undefined}
              aria-describedby={errors.note ? errorId("note") : undefined}
              className={cn(FIELD, "field-sizing-fixed h-24 min-h-24 resize-none py-3 leading-normal")}
            />
            {message("note") ? <FieldError id={errorId("note")}>{message("note")!}</FieldError> : null}
          </div>

          {/* Honeypot, hidden from people and assistive tech. */}
          <div aria-hidden className="hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => set("website")(event.target.value)} />
            </label>
          </div>

          {notice === "failed" || notice === "busy" || notice === "invalid" ? (
            <p className="text-xs text-destructive">{notice === "failed" ? copy.failed : notice === "busy" ? copy.busy : copy.invalid}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate">{copy.confirm}</p>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-ink px-[18px] text-md font-medium whitespace-nowrap text-canvas transition-colors hover:bg-graphite disabled:opacity-60 sm:h-11 sm:w-auto"
            >
              {pending ? copy.pending : copy.submit}
              <span aria-hidden>→</span>
            </button>
          </div>
        </form>
      ) : load.state === "loading" || !zone ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-soft text-sm text-slate">{copy.loading}</div>
      ) : load.state === "failed" || dayKeys.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-soft px-6 text-center text-sm text-slate">
          {load.state === "failed" ? copy.unavailable : copy.none}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_196px] md:gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-md font-medium text-ink">
                {activeMonth ? capital(new Intl.DateTimeFormat(locale, { timeZone: "UTC", month: "long", year: "numeric" }).format(atNoon(`${activeMonth}-01`))) : null}
              </span>
              <span className="-mr-2 flex">
                {(
                  [
                    [-1, copy.previousMonth, ChevronLeftIcon, !activeMonth || !firstMonth || activeMonth <= firstMonth],
                    [1, copy.nextMonth, ChevronRightIcon, !activeMonth || !lastMonth || activeMonth >= lastMonth],
                  ] as const
                ).map(([by, label, Icon, disabled]) => (
                  <button
                    key={by}
                    type="button"
                    aria-label={label}
                    disabled={disabled}
                    onClick={() => activeMonth && setMonth(shiftMonth(activeMonth, by))}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-slate transition-colors hover:bg-soft hover:text-ink disabled:pointer-events-none disabled:opacity-25 lg:size-9"
                  >
                    <Icon aria-hidden className="size-4" />
                  </button>
                ))}
              </span>
            </div>
            {grid ? (
              <div role="group" aria-label={copy.days} className={cn("grid gap-1", weekends ? "grid-cols-7" : "grid-cols-5")}>
                {Array.from({ length: weekends ? 7 : 5 }, (_, n) => (
                  <span key={n} aria-hidden className="pb-1 text-center font-mono text-2xs text-mute uppercase">
                    {new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "short" }).format(new Date(Date.UTC(2024, 0, n + 1, 12))).replace(".", "")}
                  </span>
                ))}
                {Array.from({ length: grid.lead }, (_, i) => (
                  <span key={`blank-${i}`} aria-hidden />
                ))}
                {grid.days.map((key) => {
                  const open = byDay.has(key);
                  const selected = key === activeDay;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!open}
                      aria-pressed={open ? selected : undefined}
                      aria-label={longDay(key)}
                      onClick={() => {
                        setDay(key);
                        setNotice("");
                      }}
                      className={cn(
                        "relative h-11 rounded-lg text-sm tabular-nums transition-colors lg:h-10",
                        open ? "font-medium text-ink hover:bg-soft" : "text-haze/70",
                        selected && "bg-ink text-canvas hover:bg-ink",
                      )}
                    >
                      {Number(key.slice(8))}
                      {open && !selected ? <span aria-hidden className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-lit" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex h-11 items-center lg:h-9">
              <span className="text-md font-medium text-ink">{activeDay ? shortDay(activeDay) : copy.times}</span>
            </div>
            <ul aria-label={copy.times} className="grid grid-cols-3 gap-1.5 md:max-h-[264px] md:grid-cols-1 md:overflow-y-auto">
              {(activeDay ? (byDay.get(activeDay) ?? []) : []).map((start) => (
                <li key={start}>
                  <button
                    type="button"
                    onClick={() => {
                      setSlot(start);
                      setNotice("");
                    }}
                    className="h-11 w-full rounded-lg text-sm font-medium text-ink tabular-nums ring-1 ring-black/10 transition-colors ring-inset dark:ring-white/12 hover:bg-ink hover:text-canvas hover:ring-ink lg:h-10"
                  >
                    {time(start)}
                  </button>
                </li>
              ))}
            </ul>
            <p className="pt-1 font-mono text-2xs text-mute uppercase">{footnote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

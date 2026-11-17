"use client";

import { useActionState, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactContent } from "@/content/contact";
import { BRIEF_LIMITS, initialBriefState, type BriefField, type BriefState } from "@/lib/brief";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

type Topic = { value: string; label: string };

type BriefFormProps = {
  topics: readonly Topic[];
  copy: ContactContent["form"];
};

const FIELD = cn(
  "rounded-lg border-0 bg-soft px-3.5 text-md text-ink shadow-none md:text-md",
  "placeholder:text-haze focus-visible:ring-2 focus-visible:ring-lit/40",
  "aria-invalid:ring-2 aria-invalid:ring-destructive/30",
);

/** Posts the form to /api/brief, which answers with the form's next state. */
async function sendBrief(_previous: BriefState, form: FormData): Promise<BriefState> {
  try {
    const response = await fetch("/api/brief", { method: "POST", body: form });
    return (await response.json()) as BriefState;
  } catch {
    const keep = (key: BriefField) => String(form.get(key) ?? "");
    return { status: "failed", values: { topic: keep("topic"), name: keep("name"), email: keep("email"), brief: keep("brief") } };
  }
}

/** "Reach out": a topic, a name, an email and a few lines. Mailed to the studio. */
export function BriefForm({ topics, copy }: BriefFormProps) {
  const [state, formAction, pending] = useActionState(sendBrief, initialBriefState);
  const id = useId();

  const values = state.status === "invalid" || state.status === "failed" ? state.values : {};
  // The server says what is wrong with each field; the words come from this page's copy.
  const codes = state.status === "invalid" ? state.errors : {};
  const errors: Partial<Record<BriefField, string>> = Object.fromEntries(
    Object.entries(codes).map(([field, code]) => [field, copy.errors[code]]),
  );
  const errorId = (field: BriefField) => `${id}-${field}-error`;
  const describe = (field: BriefField) => (errors[field] ? errorId(field) : undefined);
  const selectedTopic = values.topic || topics[0]?.value;

  const status =
    pending ? copy.pending : state.status === "sent" ? copy.success.title : state.status === "invalid" ? copy.invalid : state.status === "failed" ? copy.failed : "";

  return (
    <div>
      <p role="status" className="sr-only">
        {status}
      </p>

      {state.status === "sent" ? (
        <div className="flex min-h-[260px] flex-col justify-center gap-2 py-6">
          <p className="text-xl font-medium">{copy.success.title}</p>
          <p className="max-w-[420px] text-base text-slate">{copy.success.body}</p>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-3.5">
          <fieldset aria-describedby={describe("topic")}>
            <legend className="sr-only">{copy.topicLegend}</legend>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <label
                  key={topic.value}
                  className={cn(
                    "inline-flex h-11 cursor-pointer items-center rounded-sm bg-soft px-4 text-sm text-[#3b3f46] transition-colors select-none hover:bg-soft-2 lg:h-8 lg:px-2.5",
                    "has-checked:bg-ink has-checked:text-white",
                    "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-lit",
                  )}
                >
                  <input
                    type="radio"
                    name="topic"
                    value={topic.value}
                    defaultChecked={topic.value === selectedTopic}
                    className="sr-only"
                  />
                  {topic.label}
                </label>
              ))}
            </div>
            {errors.topic ? <FieldError id={errorId("topic")}>{errors.topic}</FieldError> : null}
          </fieldset>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${id}-name`} className="sr-only">
                {copy.name}
              </Label>
              <Input
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                required
                maxLength={BRIEF_LIMITS.name}
                placeholder={copy.name}
                defaultValue={values.name}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describe("name")}
                className={cn(FIELD, "h-12 sm:h-11")}
              />
              {errors.name ? <FieldError id={errorId("name")}>{errors.name}</FieldError> : null}
            </div>
            <div>
              <Label htmlFor={`${id}-email`} className="sr-only">
                {copy.email}
              </Label>
              <Input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={BRIEF_LIMITS.email}
                placeholder={copy.email}
                defaultValue={values.email}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describe("email")}
                className={cn(FIELD, "h-12 sm:h-11")}
              />
              {errors.email ? <FieldError id={errorId("email")}>{errors.email}</FieldError> : null}
            </div>
          </div>

          <div>
            <Label htmlFor={`${id}-brief`} className="sr-only">
              {copy.brief}
            </Label>
            <Textarea
              id={`${id}-brief`}
              name="brief"
              required
              minLength={10}
              maxLength={BRIEF_LIMITS.brief}
              placeholder={copy.briefPlaceholder}
              defaultValue={values.brief}
              aria-invalid={errors.brief ? true : undefined}
              aria-describedby={describe("brief")}
              className={cn(FIELD, "field-sizing-fixed h-28 min-h-28 resize-none py-3 leading-normal")}
            />
            {errors.brief ? <FieldError id={errorId("brief")}>{errors.brief}</FieldError> : null}
          </div>

          {/* Honeypot, hidden from people and assistive tech. */}
          <div aria-hidden className="hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {state.status === "failed" ? <p className="text-xs text-destructive">{copy.failed}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate">{copy.note}</p>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-ink px-[18px] text-md font-medium whitespace-nowrap text-white transition-colors hover:bg-graphite disabled:opacity-60 sm:h-11 sm:w-auto"
            >
              {pending ? copy.pending : copy.submit}
              <span aria-hidden>→</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

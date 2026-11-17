import "server-only";
import { createHash } from "node:crypto";
import { copies } from "@/content/languages";
import { busyTimes, createMeeting, graphCredentials, sendMail, type Mail, type Meeting } from "@/lib/microsoft/graph";
import type { BookingRequest } from "./request";
import { candidateStarts, hostsFor, openStarts, RULES, type BookingMode, type Interval } from "./slots";

// The booking calendar's server side: who hosts, where their calendars live,
// which times are open, and making the booking. Set up by environment
// variables (docs/booking-setup.md); without them the calendar stays hidden.

type Calendar = {
  busy(hosts: readonly string[], start: number, end: number): Promise<Interval[][]>;
  book(meeting: Meeting): Promise<{ teams: boolean }>;
  mail(mail: Mail): Promise<void>;
};

const MINUTE = 60_000;
const enTopics = copies.en.briefTopics;
const enFounders = copies.en.founders;

/** A stand-in calendar for trying the flow locally (BOOKING_MOCK=1). Never used on Vercel. */
function mockCalendar(): Calendar {
  const booked: Interval[] = [];
  return {
    async busy(hosts, start, end) {
      return hosts.map((_, i) => {
        const busy: Interval[] = [...booked];
        for (let day = start - (start % 86_400_000); day < end; day += 86_400_000) {
          // Host 1 is out 10:00 to 12:00 UTC, host 2 from 13:00 to 14:30 UTC, every day.
          busy.push(i === 0 ? { start: day + 10 * 60 * MINUTE, end: day + 12 * 60 * MINUTE } : { start: day + 13 * 60 * MINUTE, end: day + 14.5 * 60 * MINUTE });
        }
        return busy;
      });
    },
    async book(meeting) {
      booked.push({ start: meeting.start, end: meeting.end });
      console.info("[booking:mock] booked", new Date(meeting.start).toISOString(), "attendees", meeting.attendees.length);
      return { teams: false };
    },
    async mail(mail) {
      console.info("[booking:mock] mail", mail.subject.length, "chars to", mail.to.length);
    },
  };
}

function graphCalendar(): Calendar | null {
  const creds = graphCredentials();
  if (!creds) return null;
  return {
    busy: (hosts, start, end) => busyTimes(creds, hosts, start, end),
    book: (meeting) => createMeeting(creds, meeting),
    mail: (mail) => sendMail(creds, mail),
  };
}

let mock: Calendar | undefined;
function calendar(): Calendar | null {
  if (process.env.BOOKING_MOCK === "1" && !process.env.VERCEL) return (mock ??= mockCalendar());
  return graphCalendar();
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const list = (value: string | undefined) => (value ?? "").split(",").map((s) => s.trim()).filter(isEmail);

/** Who hosts calls and where mail goes, from the environment. */
function settings() {
  const hosts = list(process.env.BOOKING_HOSTS);
  const mode: BookingMode = process.env.BOOKING_MODE === "any" ? "any" : "all";
  const mailFrom = list(process.env.MAIL_FROM)[0] ?? "hello@adamass.se";
  const briefTo = list(process.env.BRIEF_TO);
  return { hosts, mode, mailFrom, briefTo: briefTo.length ? briefTo : [mailFrom] };
}

/** The hosts' addresses, lower case. Public anyway: they are on the site. */
export function bookingHosts(): string[] {
  return settings().hosts.map((host) => host.toLowerCase());
}

/** Whether every host joins each call, or one of them takes it. */
export function bookingMode(): BookingMode {
  return settings().mode;
}

/** Whether the calendar can be offered at all. Read at build time to show or hide the tab. */
export function bookingEnabled(): boolean {
  return calendar() !== null && settings().hosts.length > 0;
}

/** Open start times from now to the horizon, as ISO strings. */
export async function openSlots(now = Date.now()): Promise<string[] | null> {
  const cal = calendar();
  const { hosts, mode } = settings();
  if (!cal || hosts.length === 0) return null;
  const starts = candidateStarts(now);
  if (starts.length === 0) return [];
  const busy = await cal.busy(hosts, starts[0], starts[starts.length - 1] + RULES.durationMinutes * MINUTE);
  return openStarts(now, busy, mode);
}

const nameOf = (address: string) => enFounders.find((f) => f.email.toLowerCase() === address.toLowerCase())?.name ?? address;

/** One line, no control characters, capped: safe in a subject. */
const line = (text: string, max = 120) => text.replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, max);

export type BookingOutcome = { status: "booked"; start: string; end: string; teams: boolean } | { status: "taken" } | { status: "unavailable" };

/**
 * Books a call. The start must be one the rules offer, and every host it
 * needs is checked again against their calendar right before the meeting is
 * written, so two visitors cannot take the same time.
 */
export async function book(request: BookingRequest, now = Date.now()): Promise<BookingOutcome> {
  const cal = calendar();
  const { hosts, mode, mailFrom } = settings();
  if (!cal || hosts.length === 0) return { status: "unavailable" };

  const start = Date.parse(request.start);
  if (!candidateStarts(now).includes(start)) return { status: "taken" };
  const end = start + RULES.durationMinutes * MINUTE;

  const busy = await cal.busy(hosts, start - 12 * 60 * MINUTE, end + 12 * 60 * MINUTE);
  const chosen = hostsFor(start, busy, mode).map((i) => hosts[i]);
  if (chosen.length === 0) return { status: "taken" };

  const copy = copies[request.lang].contact.booking.invite;
  const topic = (request.lang === "sv" ? copies.sv.briefTopics : enTopics).find((t) => t.value === request.topic)?.label ?? request.topic;
  const details = [
    `${copy.name}: ${request.name}`,
    `${copy.email}: ${request.email}`,
    request.company ? `${copy.company}: ${request.company}` : "",
    `${copy.topic}: ${topic}`,
    `${copy.timeZone}: ${request.timeZone}`,
    request.note ? `\n${copy.note}:\n${request.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const [organizer, ...others] = chosen;
  const result = await cal.book({
    organizer,
    attendees: [...others.map((address) => ({ address, name: nameOf(address) })), { address: request.email, name: line(request.name) }],
    start,
    end,
    subject: line(`${copy.subject}: ${request.name}${request.company ? `, ${request.company}` : ""}`),
    body: `${copy.intro}\n\n${details}\n\n${copy.outro}`,
    transactionId: createHash("sha256").update(`${request.start}|${request.email.toLowerCase()}`).digest("hex").slice(0, 32),
  });

  // The hosts also get a plain note in their inbox. A failed note does not undo the booking.
  const when = new Intl.DateTimeFormat("en-GB", { timeZone: RULES.timeZone, dateStyle: "full", timeStyle: "short" }).format(start);
  await cal
    .mail({
      from: mailFrom,
      to: chosen,
      replyTo: request.email,
      subject: line(`Call booked: ${when}, ${request.name}${request.company ? `, ${request.company}` : ""}`, 200),
      text: `A call was booked on adamass.se for ${when} (Stockholm time).\n\n${details}\n\nThe meeting is in the calendar. Reply to this mail to write to the visitor.`,
    })
    .catch((error: unknown) => console.error("[booking] host note failed", error instanceof Error ? error.message : "unknown"));

  return { status: "booked", start: new Date(start).toISOString(), end: new Date(end).toISOString(), teams: result.teams };
}

/** Sends a brief from the contact form to the studio's inbox. */
export async function deliverBriefMail(brief: { topic: string; name: string; email: string; brief: string }): Promise<boolean> {
  const cal = calendar();
  if (!cal) return false;
  const { mailFrom, briefTo } = settings();
  const topic = enTopics.find((t) => t.value === brief.topic)?.label ?? brief.topic;
  await cal.mail({
    from: mailFrom,
    to: briefTo,
    replyTo: brief.email,
    subject: line(`Brief from adamass.se: ${topic}, ${brief.name}`, 200),
    text: `A brief came in through adamass.se.\n\nTopic: ${topic}\nName: ${brief.name}\nEmail: ${brief.email}\n\n${brief.brief}\n\nReply to this mail to answer them.`,
  });
  return true;
}

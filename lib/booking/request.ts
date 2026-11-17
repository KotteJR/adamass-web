// What a visitor sends to book a call, and the checks both sides agree on.
// Errors are codes; the form shows them in the page's language.

import { briefTopicValues, type BookingError, type BriefTopic } from "@/content/contact";

export type BookingField = "slot" | "name" | "email" | "company" | "topic" | "note";

export type BookingRequest = {
  start: string;
  name: string;
  email: string;
  company: string;
  topic: BriefTopic;
  note: string;
  /** The visitor's zone, for the invitation text only. */
  timeZone: string;
  lang: "en" | "sv";
};

export const BOOKING_LIMITS = { name: 120, email: 254, company: 120, note: 2000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Letters, spacing and printable text only: no control characters, no line breaks in single-line fields. */
const clean = (value: unknown, singleLine: boolean) => {
  if (typeof value !== "string") return "";
  const stripped = value.replace(singleLine ? /[\u0000-\u001f\u007f]/g : /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ");
  return stripped.trim();
};

const validZone = (zone: string) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone });
    return zone.length <= 64;
  } catch {
    return false;
  }
};

export type BookingParseResult =
  | { ok: true; data: BookingRequest }
  | { ok: false; errors: Partial<Record<BookingField, BookingError>> };

export function parseBooking(input: unknown): BookingParseResult {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const values = {
    start: clean(raw.start, true),
    name: clean(raw.name, true),
    email: clean(raw.email, true),
    company: clean(raw.company, true),
    topic: clean(raw.topic, true),
    note: clean(raw.note, false),
    timeZone: clean(raw.timeZone, true),
    lang: raw.lang === "sv" ? ("sv" as const) : ("en" as const),
  };
  const errors: Partial<Record<BookingField, BookingError>> = {};

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/.test(values.start) || Number.isNaN(Date.parse(values.start))) errors.slot = "slot";
  if (!values.name) errors.name = "name";
  else if (values.name.length > BOOKING_LIMITS.name) errors.name = "nameLong";
  if (!EMAIL.test(values.email) || values.email.length > BOOKING_LIMITS.email) errors.email = "email";
  if (values.company.length > BOOKING_LIMITS.company) errors.company = "companyLong";
  const topic = briefTopicValues.find((t) => t === values.topic);
  if (!topic) errors.topic = "topic";
  if (values.note.length > BOOKING_LIMITS.note) errors.note = "noteLong";

  if (Object.keys(errors).length > 0 || !topic) return { ok: false, errors };
  return { ok: true, data: { ...values, topic, timeZone: validZone(values.timeZone) ? values.timeZone : "Europe/Stockholm" } };
}

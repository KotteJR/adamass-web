// The short brief from the call-to-action card: its shape, the state the
// server action returns, and the validation both sides agree on.

import { briefTopics, type BriefTopic } from "@/content/contact";

export type BriefField = "topic" | "name" | "email" | "brief";

export type Brief = {
  topic: BriefTopic;
  name: string;
  email: string;
  brief: string;
};

export type BriefState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: Partial<Record<BriefField, string>>;
      /** Echoed back so the form keeps what was typed. */
      values: Partial<Record<BriefField, string>>;
    }
  | { status: "sent"; name: string }
  | { status: "failed"; values: Partial<Record<BriefField, string>> };

export const initialBriefState: BriefState = { status: "idle" };

export const BRIEF_LIMITS = { name: 120, email: 254, brief: 4000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const isTopic = (value: string): value is BriefTopic => briefTopics.some((t) => t.value === value);

export type BriefParseResult =
  | { ok: true; data: Brief }
  | { ok: false; errors: Partial<Record<BriefField, string>>; values: Partial<Record<BriefField, string>> };

/** Reads and checks the form. Messages are written for the person filling it in. */
export function parseBrief(form: FormData): BriefParseResult {
  const values = {
    topic: text(form, "topic"),
    name: text(form, "name"),
    email: text(form, "email"),
    brief: text(form, "brief"),
  };
  const errors: Partial<Record<BriefField, string>> = {};

  if (!isTopic(values.topic)) errors.topic = "Pick what the brief is about.";
  if (!values.name) errors.name = "Tell us who you are.";
  else if (values.name.length > BRIEF_LIMITS.name) errors.name = "That name is longer than we can store.";
  if (!EMAIL.test(values.email) || values.email.length > BRIEF_LIMITS.email)
    errors.email = "We need an email address we can reply to.";
  if (values.brief.length < 10) errors.brief = "A few lines is enough, but we need a few.";
  else if (values.brief.length > BRIEF_LIMITS.brief) errors.brief = "Keep it under 4,000 characters; we will ask for more.";

  if (Object.keys(errors).length > 0 || !isTopic(values.topic)) return { ok: false, errors, values };
  return { ok: true, data: { ...values, topic: values.topic } };
}

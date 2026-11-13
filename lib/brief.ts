// The short brief from the call-to-action card: its shape, the state the
// server action returns, and the validation both sides agree on.

import { briefTopicValues, type BriefError, type BriefTopic } from "@/content/contact";

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
      errors: Partial<Record<BriefField, BriefError>>;
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

const isTopic = (value: string): value is BriefTopic => briefTopicValues.some((t) => t === value);

export type BriefParseResult =
  | { ok: true; data: Brief }
  | { ok: false; errors: Partial<Record<BriefField, BriefError>>; values: Partial<Record<BriefField, string>> };

/** Reads and checks the form. Errors are codes; the form shows them in the page's language. */
export function parseBrief(form: FormData): BriefParseResult {
  const values = {
    topic: text(form, "topic"),
    name: text(form, "name"),
    email: text(form, "email"),
    brief: text(form, "brief"),
  };
  const errors: Partial<Record<BriefField, BriefError>> = {};

  if (!isTopic(values.topic)) errors.topic = "topic";
  if (!values.name) errors.name = "name";
  else if (values.name.length > BRIEF_LIMITS.name) errors.name = "nameLong";
  if (!EMAIL.test(values.email) || values.email.length > BRIEF_LIMITS.email) errors.email = "email";
  if (values.brief.length < 10) errors.brief = "briefShort";
  else if (values.brief.length > BRIEF_LIMITS.brief) errors.brief = "briefLong";

  if (Object.keys(errors).length > 0 || !isTopic(values.topic)) return { ok: false, errors, values };
  return { ok: true, data: { ...values, topic: values.topic } };
}

"use server";

import { parseBrief, type Brief, type BriefState } from "@/lib/brief";

/**
 * Hands a validated brief to the studio.
 * TODO(founders): pick the channel (mail to hello@adamass.se via SES, or the
 * CRM) and send it here. Until then the brief is accepted and logged on the
 * server only, so the form flow can be tested end to end.
 */
async function deliverBrief(brief: Brief): Promise<void> {
  console.info("[brief] received", { topic: brief.topic, length: brief.brief.length });
}

/** Server action behind the "Reach out" form. */
export async function sendBrief(_previous: BriefState, form: FormData): Promise<BriefState> {
  // Honeypot: people never see this field; bots tend to fill it.
  if (typeof form.get("website") === "string" && form.get("website") !== "") {
    return { status: "sent", name: "" };
  }

  const result = parseBrief(form);
  if (!result.ok) {
    return { status: "invalid", errors: result.errors, values: result.values };
  }

  try {
    await deliverBrief(result.data);
    return { status: "sent", name: result.data.name.split(/\s+/)[0] ?? "" };
  } catch (error) {
    console.error("[brief] delivery failed", error);
    const { topic, name, email, brief } = result.data;
    return { status: "failed", values: { topic, name, email, brief } };
  }
}

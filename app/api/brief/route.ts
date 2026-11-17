import { parseBrief, type BriefState } from "@/lib/brief";
import { deliverBriefMail } from "@/lib/booking/service";
import { bodyTooLarge, json, looksAutomated, rateLimited, reason, sameSite } from "@/lib/security/guard";

/** The "Reach out" form: checks the brief and mails it to the studio. Answers with the form's next state. */
export async function POST(request: Request) {
  if (!sameSite(request)) return json({ status: "failed", values: {} } satisfies BriefState, 403);
  if (bodyTooLarge(request, 32_768)) return json({ status: "failed", values: {} } satisfies BriefState, 413);
  if (rateLimited(request, "brief", 10, 60 * 60_000)) return json({ status: "failed", values: {} } satisfies BriefState, 429);
  if (await looksAutomated()) return json({ status: "failed", values: {} } satisfies BriefState, 403);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ status: "failed", values: {} } satisfies BriefState, 400);
  }
  // Honeypot: people never see this field; bots tend to fill it.
  if (typeof form.get("website") === "string" && form.get("website") !== "") {
    return json({ status: "sent", name: "" } satisfies BriefState);
  }

  const result = parseBrief(form);
  if (!result.ok) return json({ status: "invalid", errors: result.errors, values: result.values } satisfies BriefState, 422);

  const { topic, name, email, brief } = result.data;
  try {
    // Not set up yet means not delivered: say so, so the visitor writes by mail instead.
    if (!(await deliverBriefMail(result.data))) throw new Error("mail is not set up");
    return json({ status: "sent", name: name.split(/\s+/)[0] ?? "" } satisfies BriefState);
  } catch (error) {
    console.error("[brief] delivery failed", reason(error));
    return json({ status: "failed", values: { topic, name, email, brief } } satisfies BriefState, 502);
  }
}

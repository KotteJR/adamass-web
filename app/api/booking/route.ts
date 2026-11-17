import { book } from "@/lib/booking/service";
import { parseBooking } from "@/lib/booking/request";
import { bodyTooLarge, json, looksAutomated, rateLimited, reason, sameSite } from "@/lib/security/guard";

/** Times being booked right now on this instance: one at a time per start. */
const inFlight = new Set<string>();

/** Books a call. See lib/booking/service.ts for the checks against the calendars. */
export async function POST(request: Request) {
  if (!sameSite(request)) return json({ status: "forbidden" }, 403);
  if (bodyTooLarge(request, 16_384)) return json({ status: "invalid", errors: {} }, 413);
  if (rateLimited(request, "book", 10, 60 * 60_000)) return json({ status: "busy" }, 429);
  if (await looksAutomated()) return json({ status: "forbidden" }, 403);

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ status: "invalid", errors: {} }, 400);
  }
  // Honeypot: people never see this field; bots tend to fill it. They get a quiet yes.
  const honeypot = (input as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot !== "") return json({ status: "booked", start: "", end: "", teams: false });

  const parsed = parseBooking(input);
  if (!parsed.ok) return json({ status: "invalid", errors: parsed.errors }, 422);

  const { start } = parsed.data;
  if (inFlight.has(start)) return json({ status: "taken" }, 409);
  inFlight.add(start);
  try {
    const outcome = await book(parsed.data);
    return json(outcome, outcome.status === "booked" ? 200 : outcome.status === "taken" ? 409 : 503);
  } catch (error) {
    console.error("[booking] failed", reason(error));
    return json({ status: "failed" }, 502);
  } finally {
    inFlight.delete(start);
  }
}

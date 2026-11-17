import { connection } from "next/server";
import { openSlots } from "@/lib/booking/service";
import { RULES } from "@/lib/booking/slots";
import { json, looksAutomated, rateLimited, reason, sameSite } from "@/lib/security/guard";

/** The free start times for the booking calendar. Times only: nothing else from anyone's calendar. */
export async function GET(request: Request) {
  await connection();
  if (!sameSite(request)) return json({ error: "forbidden" }, 403);
  if (rateLimited(request, "slots", 30, 10 * 60_000)) return json({ error: "busy" }, 429);
  if (await looksAutomated()) return json({ error: "forbidden" }, 403);
  try {
    const slots = await openSlots();
    if (!slots) return json({ error: "unavailable" }, 503);
    return json({ slots, durationMinutes: RULES.durationMinutes });
  } catch (error) {
    console.error("[booking] slots failed", reason(error));
    return json({ error: "unavailable" }, 503);
  }
}

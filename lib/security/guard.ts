import "server-only";
import { checkBotId } from "botid/server";

// Shared checks for the form endpoints (/api/booking, /api/booking/slots,
// /api/brief): same site only, small bodies, a per-connection rate limit and
// Vercel BotID. Responses are never cached.

const NO_STORE = { "Cache-Control": "no-store" };

export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NO_STORE });

/** Requests must come from a page on this site. Browsers always send Origin on POST and on cross-site fetches. */
export function sameSite(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return request.method === "GET";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Refuses bodies over the limit; a missing length is refused too (browsers always send it here). */
export function bodyTooLarge(request: Request, limit: number): boolean {
  const length = Number(request.headers.get("content-length"));
  return !Number.isFinite(length) || length <= 0 || length > limit;
}

const hits = new Map<string, number[]>();

/**
 * At most `limit` requests per key in the window. Kept in memory, so it holds per
 * server instance: a brake on one noisy connection, with BotID as the real gate.
 */
export function rateLimited(request: Request, bucket: string, limit: number, windowMs: number): boolean {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.size > 5000) hits.clear();
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

/** Vercel BotID. It only runs on Vercel; local builds have no bot traffic to stop. */
export async function looksAutomated(): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  const verdict = await checkBotId();
  return verdict.isBot;
}

/** An error's message for the logs, never its payload. */
export const reason = (error: unknown) => (error instanceof Error ? error.message : "unknown");

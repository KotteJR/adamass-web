import "server-only";
import type { Interval } from "@/lib/booking/slots";

// Microsoft Graph, app-only, for the booking calendar and the brief mail.
// The app's rights are limited in Exchange (RBAC for Applications) to the
// founders' and hello@ mailboxes; see docs/booking-setup.md. Nothing here
// returns calendar details: busy times leave as bare start/end pairs.

const GRAPH = "https://graph.microsoft.com/v1.0";
const TIMEOUT_MS = 10_000;

export type GraphCredentials = { tenantId: string; clientId: string; clientSecret: string };

/** The credentials from the environment, or null when the integration is not set up. */
export function graphCredentials(): GraphCredentials | null {
  const tenantId = process.env.MS_TENANT_ID?.trim();
  const clientId = process.env.MS_CLIENT_ID?.trim();
  const clientSecret = process.env.MS_CLIENT_SECRET?.trim();
  return tenantId && clientId && clientSecret ? { tenantId, clientId, clientSecret } : null;
}

/** A failed Graph call. Carries the status and Microsoft's error code, never the response body. */
export class GraphError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(`Microsoft Graph ${status} ${code}`);
  }
}

let token: { value: string; expires: number } | undefined;

async function accessToken(creds: GraphCredentials): Promise<string> {
  if (token && token.expires > Date.now() + 60_000) return token.value;
  const response = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(creds.tenantId)}/oauth2/v2.0/token`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new GraphError(response.status, "token");
  const json = (await response.json()) as { access_token: string; expires_in: number };
  token = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  return token.value;
}

async function graph<T>(creds: GraphCredentials, path: string, body: unknown, headers: Record<string, string> = {}): Promise<T | undefined> {
  const response = await fetch(`${GRAPH}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${await accessToken(creds)}`, "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    const code = await response
      .json()
      .then((json: { error?: { code?: string } }) => json.error?.code ?? "unknown")
      .catch(() => "unknown");
    throw new GraphError(response.status, code);
  }
  return response.status === 202 || response.status === 204 ? undefined : ((await response.json()) as T);
}

const user = (address: string) => `/users/${encodeURIComponent(address)}`;

/** Graph's dateTime has no zone and up to seven decimals; with a UTC request it is UTC. */
const parseUtc = (dateTime: string) => Date.parse(`${dateTime.slice(0, 19)}Z`);
const graphUtc = (at: number) => ({ dateTime: new Date(at).toISOString().slice(0, 19), timeZone: "UTC" });

type ScheduleResponse = {
  value: {
    scheduleId: string;
    error?: { message?: string; responseCode?: string };
    scheduleItems?: { status: string; start: { dateTime: string }; end: { dateTime: string } }[];
  }[];
};

/**
 * Busy times for each host, in the order given. Tentative and away count as busy;
 * subjects, locations and attendees are dropped here and never leave this function.
 */
export async function busyTimes(creds: GraphCredentials, hosts: readonly string[], start: number, end: number): Promise<Interval[][]> {
  const result = await graph<ScheduleResponse>(
    creds,
    `${user(hosts[0])}/calendar/getSchedule`,
    { schedules: hosts, startTime: graphUtc(start), endTime: graphUtc(end), availabilityViewInterval: 15 },
    { Prefer: 'outlook.timezone="UTC"' },
  );
  return hosts.map((host) => {
    const schedule = result?.value.find((s) => s.scheduleId.toLowerCase() === host.toLowerCase());
    // A calendar we cannot read must not look free.
    if (!schedule || schedule.error || !schedule.scheduleItems) throw new GraphError(502, "schedule-unreadable");
    return schedule.scheduleItems
      .filter((item) => item.status !== "free" && item.status !== "workingElsewhere")
      .map((item) => ({ start: parseUtc(item.start.dateTime), end: parseUtc(item.end.dateTime) }));
  });
}

export type Meeting = {
  organizer: string;
  attendees: readonly { address: string; name: string }[];
  start: number;
  end: number;
  subject: string;
  /** Plain text: nothing a visitor types can become markup in an invitation. */
  body: string;
  /** Same booking, same id: Exchange then refuses to create it twice. */
  transactionId: string;
};

type EventResponse = { id: string; onlineMeeting?: { joinUrl?: string } | null };

/**
 * Creates the meeting in the organizer's calendar; Exchange sends the invitations.
 * Asks for a Teams link, and books without one if the tenant will not add it app-only.
 */
export async function createMeeting(creds: GraphCredentials, meeting: Meeting): Promise<{ teams: boolean }> {
  const event = {
    subject: meeting.subject,
    body: { contentType: "text", content: meeting.body },
    start: graphUtc(meeting.start),
    end: graphUtc(meeting.end),
    attendees: meeting.attendees.map((a) => ({ emailAddress: { address: a.address, name: a.name }, type: "required" })),
    showAs: "busy",
    allowNewTimeProposals: true,
    responseRequested: true,
    transactionId: meeting.transactionId,
  };
  try {
    const created = await graph<EventResponse>(creds, `${user(meeting.organizer)}/events`, {
      ...event,
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness",
    });
    return { teams: Boolean(created?.onlineMeeting?.joinUrl) };
  } catch (error) {
    if (!(error instanceof GraphError) || error.status !== 400) throw error;
    await graph<EventResponse>(creds, `${user(meeting.organizer)}/events`, event);
    return { teams: false };
  }
}

export type Mail = {
  /** The mailbox that sends (the app may send from it). */
  from: string;
  /** The address readers see, when the sending mailbox has Send As on it (hello@, a distribution list). */
  as?: string;
  to: readonly string[];
  replyTo?: string;
  subject: string;
  text: string;
};

/** Sends a plain-text mail from a mailbox the app may send from. Not saved to Sent Items. */
export async function sendMail(creds: GraphCredentials, mail: Mail): Promise<void> {
  await graph(creds, `${user(mail.from)}/sendMail`, {
    message: {
      subject: mail.subject,
      ...(mail.as && mail.as.toLowerCase() !== mail.from.toLowerCase() ? { from: { emailAddress: { address: mail.as, name: "Adamass" } } } : {}),
      body: { contentType: "text", content: mail.text },
      toRecipients: mail.to.map((address) => ({ emailAddress: { address } })),
      replyTo: mail.replyTo ? [{ emailAddress: { address: mail.replyTo } }] : [],
    },
    saveToSentItems: false,
  });
}

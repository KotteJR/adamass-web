// Which call times to offer: office hours in Malmö, minus the hosts' busy
// times. Pure functions, so the rules can be tested without a calendar.

/** A span of time, in epoch milliseconds, end exclusive. */
export type Interval = { start: number; end: number };

/** "all": a time is offered only when every host is free, and every host joins. "any": one free host takes it. */
export type BookingMode = "all" | "any";

export type BookingRules = {
  /** Office hours are in this zone. */
  timeZone: string;
  durationMinutes: number;
  stepMinutes: number;
  /** ISO weekdays, 1 = Monday. */
  weekdays: readonly number[];
  /** Minutes after midnight, local to timeZone. */
  dayStart: number;
  dayEnd: number;
  /** Nothing sooner than this from now. */
  minNoticeHours: number;
  /** Nothing later than this from now. */
  horizonDays: number;
};

/** Swedish office hours, half-hour calls, from a day ahead to three weeks out. */
export const RULES: BookingRules = {
  timeZone: "Europe/Stockholm",
  durationMinutes: 30,
  stepMinutes: 30,
  weekdays: [1, 2, 3, 4, 5],
  dayStart: 9 * 60,
  dayEnd: 17 * 60,
  minNoticeHours: 24,
  horizonDays: 21,
};

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

/** Minutes east of UTC that timeZone's clocks show at an instant. */
export function zoneOffsetMinutes(timeZone: string, at: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(at));
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((wall - Math.floor(at / 1000) * 1000) / MINUTE);
}

/** The instant when timeZone's wall clock shows the given date and minute of the day. */
export function zonedInstant(timeZone: string, y: number, m: number, d: number, minuteOfDay: number): number {
  const wall = Date.UTC(y, m - 1, d, 0, minuteOfDay);
  const first = wall - zoneOffsetMinutes(timeZone, wall) * MINUTE;
  // Near a clock change the offset at the guess can differ from the offset at the answer.
  const second = wall - zoneOffsetMinutes(timeZone, first) * MINUTE;
  return second;
}

/** Calendar date and ISO weekday in timeZone at an instant. */
export function zonedDate(timeZone: string, at: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(new Date(at));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")) + 1;
  return { y: Number(get("year")), m: Number(get("month")), d: Number(get("day")), weekday };
}

/** Every start time the rules allow between now and the horizon, before anyone's calendar is read. */
export function candidateStarts(now: number, rules: BookingRules = RULES): number[] {
  const earliest = now + rules.minNoticeHours * 60 * MINUTE;
  const latest = now + rules.horizonDays * DAY;
  const starts: number[] = [];
  // Walk calendar days in the office's zone; noon avoids clock-change edges.
  const today = zonedDate(rules.timeZone, now);
  for (let i = 0; i <= rules.horizonDays + 1; i++) {
    const noon = zonedInstant(rules.timeZone, today.y, today.m, today.d, 12 * 60) + i * DAY;
    const day = zonedDate(rules.timeZone, noon);
    if (!rules.weekdays.includes(day.weekday)) continue;
    for (let minute = rules.dayStart; minute + rules.durationMinutes <= rules.dayEnd; minute += rules.stepMinutes) {
      const start = zonedInstant(rules.timeZone, day.y, day.m, day.d, minute);
      if (start >= earliest && start <= latest) starts.push(start);
    }
  }
  return starts;
}

const overlaps = (a: Interval, b: Interval) => a.start < b.end && b.start < a.end;

/** True when nothing in busy touches the call. */
export function isFree(start: number, busy: readonly Interval[], rules: BookingRules = RULES): boolean {
  const call = { start, end: start + rules.durationMinutes * MINUTE };
  return !busy.some((b) => overlaps(call, b));
}

/** The hosts who would take a call at start, or none when it cannot be offered. */
export function hostsFor(start: number, busyByHost: readonly (readonly Interval[])[], mode: BookingMode, rules: BookingRules = RULES): number[] {
  const free = busyByHost.map((busy, i) => (isFree(start, busy, rules) ? i : -1)).filter((i) => i >= 0);
  if (mode === "all") return free.length === busyByHost.length ? free : [];
  if (free.length === 0) return [];
  // One host takes it: the one with the least booked time that day, so calls spread out.
  const dayStart = start - (start % DAY);
  const load = (i: number) =>
    busyByHost[i].reduce((sum, b) => sum + Math.max(0, Math.min(b.end, dayStart + DAY) - Math.max(b.start, dayStart)), 0);
  return [free.reduce((best, i) => (load(i) < load(best) ? i : best))];
}

/** The start times to offer, as ISO strings, given every host's busy times. */
export function openStarts(now: number, busyByHost: readonly (readonly Interval[])[], mode: BookingMode, rules: BookingRules = RULES): string[] {
  return candidateStarts(now, rules)
    .filter((start) => hostsFor(start, busyByHost, mode, rules).length > 0)
    .map((start) => new Date(start).toISOString());
}

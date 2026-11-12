// Small sums for the engagement timeline: where each step starts and ends, which
// step and which moment a point falls in, and how a point reads.

import type { Moment, WayIn } from "@/content/process";

const WEEKS_PER_MONTH = 52 / 12;

export const totalWeeks = (way: WayIn) => way.phases.reduce((sum, weeks) => sum + weeks, 0);

/** [start, end] of each step, in weeks. */
export function phaseBounds(way: WayIn): [number, number][] {
  let at = 0;
  return way.phases.map((weeks) => {
    const bounds: [number, number] = [at, at + weeks];
    at += weeks;
    return bounds;
  });
}

export function phaseAt(way: WayIn, week: number) {
  const index = phaseBounds(way).findIndex(([, end]) => week < end - 1e-6);
  return index === -1 ? way.phases.length - 1 : index;
}

/** The last moment at or before the point. */
export function momentAt(moments: Moment[], week: number) {
  let index = 0;
  moments.forEach((moment, i) => {
    if (moment.week <= week + 1e-6) index = i;
  });
  return index;
}

export function nearestMoment(moments: Moment[], week: number) {
  let best = 0;
  moments.forEach((moment, i) => {
    if (Math.abs(moment.week - week) < Math.abs(moments[best].week - week)) best = i;
  });
  return best;
}

/**
 * "Week 6" or "Month 4" for a point on the bar: the week (or month) it falls in,
 * so week 5.0 is the start of week 6. On a moment, the moment's own label.
 */
export function pointLabel(way: WayIn, week: number) {
  const on = way.moments.find((m) => Math.abs(m.week - week) < 1e-6);
  if (on) return on.when;
  const total = totalWeeks(way);
  if (way.unit === "month" && week >= WEEKS_PER_MONTH) {
    const months = Math.round(total / WEEKS_PER_MONTH);
    return `Month ${Math.min(months, Math.floor(week / WEEKS_PER_MONTH + 1e-6) + 1)}`;
  }
  return `Week ${Math.min(Math.ceil(total - 1e-6), Math.floor(week + 1e-6) + 1)}`;
}

/** "Weeks 3–11" or "Months 1–12" for a step. */
export function rangeLabel(way: WayIn, [start, end]: [number, number]) {
  // On the long ways in, the short steps of the first month read in weeks.
  const months = way.unit === "month" && (end - start >= WEEKS_PER_MONTH || start >= WEEKS_PER_MONTH);
  const unit = months ? WEEKS_PER_MONTH : 1;
  const name = months ? "Month" : "Week";
  const from = Math.floor(start / unit + 1e-6) + 1;
  const to = Math.max(from, Math.ceil(end / unit - 1e-6));
  return from === to ? `${name} ${from}` : `${name}s ${from}–${to}`;
}

/** Tick marks under the bar, in weeks, with their labels. */
export function ticks(way: WayIn): { week: number; label: string }[] {
  const total = totalWeeks(way);
  if (way.unit === "month") {
    const months = Math.round(total / WEEKS_PER_MONTH);
    return Array.from({ length: Math.floor(months / 3) + 1 }, (_, i) => ({ week: i * 3 * WEEKS_PER_MONTH, label: String(i * 3) }));
  }
  const step = total <= 5 ? 1 : 2;
  return Array.from({ length: Math.floor(total / step) + 1 }, (_, i) => ({ week: i * step, label: String(i * step) }));
}

/**
 * Where each step sits on the line, as [start, width] fractions of it: its
 * real share of the time, but never thinner than `min`, so every step's label
 * fits. The others give up room in proportion.
 */
export function stepLayout(way: WayIn, min = 0.16): [number, number][] {
  const total = totalWeeks(way);
  const real = way.phases.map((weeks) => weeks / total);
  let floored = real.map(() => false);
  let shares = real;
  for (let pass = 0; pass < way.phases.length; pass++) {
    const fixed = floored.filter(Boolean).length * min;
    const free = real.reduce((sum, share, i) => (floored[i] ? sum : sum + share), 0);
    shares = real.map((share, i) => (floored[i] ? min : (share / free) * (1 - fixed)));
    const next = shares.map((share, i) => floored[i] || share < min);
    if (next.every((flag, i) => flag === floored[i])) break;
    floored = next;
  }
  let at = 0;
  return shares.map((share) => {
    const slot: [number, number] = [at, share];
    at += share;
    return slot;
  });
}

/** A point in weeks to a place on the line (0 to 1), step by step. */
export function placeOf(way: WayIn, week: number, layout: [number, number][]) {
  const i = phaseAt(way, week);
  const [start, end] = phaseBounds(way)[i];
  const [x, width] = layout[i];
  return x + (Math.min(end, Math.max(start, week)) - start) / (end - start) * width;
}

/** A place on the line (0 to 1) back to a point in weeks. */
export function weekOf(way: WayIn, place: number, layout: [number, number][]) {
  const i = Math.max(0, layout.findIndex(([x, width]) => place <= x + width + 1e-9));
  const [start, end] = phaseBounds(way)[i];
  const [x, width] = layout[i];
  return start + (Math.min(1, Math.max(0, (place - x) / width))) * (end - start);
}

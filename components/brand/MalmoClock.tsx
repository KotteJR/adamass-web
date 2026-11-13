"use client";

import { useSyncExternalStore } from "react";
import type { DayPhase } from "@/content/home";
import { cn } from "@/lib/utils";

const TICK_MS = 20_000;

/** Sky tints over the painting, one per time of day (Closing board). */
const SKIES: Record<DayPhase, string> = {
  day: "bg-[linear-gradient(180deg,rgba(14,28,48,.28),rgba(14,28,48,.10)_55%,rgba(14,28,48,.22))]",
  dawn: "bg-[linear-gradient(0deg,rgba(236,176,120,.55),rgba(236,176,120,.08)_55%,rgba(14,28,48,.25))]",
  dusk: "bg-[linear-gradient(0deg,rgba(226,150,98,.6),rgba(150,110,140,.18)_55%,rgba(14,28,48,.45))]",
  night: "bg-[linear-gradient(180deg,rgba(6,12,24,.72),rgba(10,20,38,.55))]",
};

const PHASES = Object.keys(SKIES) as DayPhase[];

function phaseOf(hour: number): DayPhase {
  if (hour >= 21 || hour < 5) return "night";
  if (hour < 8) return "dawn";
  if (hour >= 17) return "dusk";
  return "day";
}

const formatters = new Map<string, Intl.DateTimeFormat>();

/** "18:42" in the given zone. */
function clockTime(timeZone: string) {
  let format = formatters.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("sv-SE", { timeZone, hour: "2-digit", minute: "2-digit" });
    formatters.set(timeZone, format);
  }
  return format.format(new Date());
}

function subscribe(onTick: () => void) {
  const timer = window.setInterval(onTick, TICK_MS);
  return () => window.clearInterval(timer);
}

type MalmoClockProps = {
  timeZone: string;
  place: string;
  greetings: Record<DayPhase, string>;
  /** "Good evening from Malmö". */
  from: string;
  className?: string;
};

/**
 * The live time in Malmö and the sky that goes with it. Renders the tint
 * layers (absolutely, behind the content) and the greeting line. The server
 * knows no time, so it renders the daytime sky and no clock; the client
 * fills both in after hydration.
 */
export function MalmoClock({ timeZone, place, greetings, from, className }: MalmoClockProps) {
  const time = useSyncExternalStore(subscribe, () => clockTime(timeZone), () => null);
  const phase = time ? phaseOf(Number.parseInt(time.slice(0, 2), 10)) : "day";

  return (
    <>
      {PHASES.map((p) => (
        <div
          key={p}
          aria-hidden
          className={cn(
            // The tint fades in from the top edge, so How we work above can dissolve into it.
            "absolute inset-0 transition-opacity duration-[2s] [mask-image:linear-gradient(180deg,transparent_0%,black_35%)] motion-reduce:transition-none",
            SKIES[p],
            p === phase ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <p
        className={cn(
          "font-mono text-[0.6875rem] tracking-[0.1em] text-white/88 uppercase",
          className,
        )}
      >
        {greetings[phase]} {from} {place}
        {time ? (
          <>
            {" · "}
            <time dateTime={time}>{time}</time>
          </>
        ) : null}
      </p>
    </>
  );
}

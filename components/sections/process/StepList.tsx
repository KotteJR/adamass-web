import type { Phase, TimeUnits, WayIn } from "@/content/process";
import { cn } from "@/lib/utils";
import { phaseAt, phaseBounds, rangeLabel } from "./engagement-math";
import styles from "./process.module.css";

type StepListProps = {
  way: WayIn;
  phases: Phase[];
  units: TimeUnits;
  className?: string;
};

/**
 * Phones: the way in, read top to bottom. The four steps sit on one thin line, each
 * with its weeks and, under it, what happens in it and when. Nothing to drag and
 * nothing moving: the page scrolls past it like text.
 */
export function StepList({ way, phases, units, className }: StepListProps) {
  const bounds = phaseBounds(way);

  return (
    <ol key={way.id} className={cn(styles.swap, className)}>
      {phases.map((phase, i) => (
        <li key={phase.title} className="relative border-l border-white/15 pb-8 pl-5 last:pb-0">
          {/* The step's mark on the line. */}
          <span aria-hidden className="absolute top-[0.5625rem] -left-[3.5px] size-1.5 rounded-full bg-white" />
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg leading-snug font-medium tracking-[-0.01em] text-white">{phase.title}</h3>
            <span className="font-mono text-[0.625rem] tracking-[0.08em] whitespace-nowrap text-white/45 uppercase">
              {rangeLabel(way, bounds[i], units)}
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-4">
            {way.moments
              .filter((moment) => phaseAt(way, moment.week) === i)
              .map((moment) => (
                <li key={moment.week} className="flex flex-col gap-1">
                  <span className="font-mono text-[0.625rem] tracking-[0.08em] text-[#9cc0e6] uppercase">{moment.when}</span>
                  <p className="text-[0.9375rem] leading-[1.5] text-white/70">{moment.text}</p>
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

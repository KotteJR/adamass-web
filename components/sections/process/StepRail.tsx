import { cn } from "@/lib/utils";
import { boxPlace } from "./StepBoxes";

type StepRailProps = {
  /** Each step's [start, width] as fractions of the rail. */
  layout: [number, number][];
  /** The step the knob is in. */
  current: number;
  className?: string;
};

/**
 * The phone's overview of the four steps: slim bars on one line, each as long
 * as its share, placed exactly as the boxes are on wider screens. They are lit
 * up to the knob (--at, set by the timeline), and the current one is brighter.
 */
export function StepRail({ layout, current, className }: StepRailProps) {
  return (
    <div aria-hidden className={cn("relative h-1", className)}>
      {layout.map((_, i) => (
        <span
          key={i}
          className={cn("absolute inset-y-0 rounded-full transition-colors", i === current ? "bg-white/25" : "bg-white/12")}
          style={boxPlace(layout, i)}
        />
      ))}
      {/* The time so far: the same bars, lit, cut at the knob. */}
      <span className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--at)) 0 0)" }}>
        {layout.map((_, i) => (
          <span key={i} className="absolute inset-y-0 rounded-full bg-white/80" style={boxPlace(layout, i)} />
        ))}
      </span>
    </div>
  );
}

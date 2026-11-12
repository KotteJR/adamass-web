import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** The gap between two steps' boxes, in px. */
const GAP_PX = 6;

/** Step i's box in px across a row `width` wide: its share, less half the gap on each side it shares with a neighbour. */
export function boxPx(layout: [number, number][], i: number, width: number) {
  const [start, share] = layout[i];
  const lead = i === 0 ? 0 : GAP_PX / 2;
  const tail = i === layout.length - 1 ? 0 : GAP_PX / 2;
  return { left: start * width + lead, width: share * width - lead - tail, lead, tail };
}

/** Where step i's box sits, in CSS, so it follows the row as it resizes. */
export function boxPlace(layout: [number, number][], i: number): CSSProperties {
  const [start, share] = layout[i];
  const { lead, tail } = boxPx(layout, i, 0);
  return { left: `calc(${start * 100}% + ${lead}px)`, width: `calc(${share * 100}% - ${lead + tail}px)` };
}

type StepBoxesProps = {
  /** Each step's [start, width] as fractions of the row. */
  layout: [number, number][];
  /** Classes for every box: its border and fill. */
  boxClassName: string;
};

/**
 * The four steps as boxes side by side, each as wide as its share of the row,
 * with a small gap between them, drawn as plain outlines. The glass that fills
 * them up to the knob is GlassFill, placed the same way.
 */
export function StepBoxes({ layout, boxClassName }: StepBoxesProps) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {layout.map((_, i) => (
        <span
          key={i}
          className={cn("absolute inset-y-0 rounded-lg border", boxClassName)}
          style={boxPlace(layout, i)}
        />
      ))}
    </span>
  );
}

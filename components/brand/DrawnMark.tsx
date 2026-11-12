import { cn } from "@/lib/utils";
import { A_GLYPH, A_TRANSFORM, BRACKETS } from "./SketchMark";

/**
 * The [a] mark as a drawing: the two bracket strokes (with their small
 * overshoots) and the outlined "a", without the construction lines. Hairline
 * strokes in currentColor, still. Decorative.
 */
export function DrawnMark({ className }: { className?: string }) {
  return (
    <svg viewBox="176 266 848 616" fill="none" aria-hidden className={cn("h-auto", className)}>
      <g stroke="currentColor" strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeLinecap="round">
        {BRACKETS.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
        <path d={A_GLYPH} transform={A_TRANSFORM} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

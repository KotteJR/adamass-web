import { cn } from "@/lib/utils";
import styles from "./sketch-mark.module.css";

/** The "a" of the mark, in font units (placed by A_TRANSFORM). */
export const A_GLYPH =
  "M283 -13Q202 -13 148.0 26.5Q94 66 67.0 137.0Q40 208 40 301Q40 395 67.5 465.5Q95 536 149.0 575.0Q203 614 283 614Q349 614 389.5 587.5Q430 561 448 522H472V600H595V0H472V78H448Q430 41 389.5 14.0Q349 -13 283 -13ZM313 89Q381 89 421.5 146.5Q462 204 462 300Q462 397 421.5 454.5Q381 512 313 512Q249 512 214.0 457.5Q179 403 179 300Q179 197 214.0 143.0Q249 89 313 89Z";

/** Construction grid, the guide circles and the arc. */
const GRID = [
  "M120 291.9H1080",
  "M120 856.2H1080",
  "M150 351.1H1050",
  "M150 796.9H1050",
  "M170 450H1030",
  "M170 760H1030",
  "M600 205V945",
];

/** Where the "a" sits inside the brackets. */
export const A_TRANSFORM = "translate(425.625 760) scale(0.51666667 -0.51666667)";

/** The two brackets, drawn as single strokes. */
export const BRACKETS = [
  "M379.6 291.9L186.8 291.9",
  "M202.8 275.9L202.8 872.2",
  "M186.8 856.2L379.6 856.2",
  "M363.6 866.9L363.6 786.2",
  "M379.6 796.9L248.9 796.9",
  "M264.9 812.9L264.9 335.1",
  "M248.9 351.1L379.6 351.1",
  "M363.6 361.8L363.6 281.2",
  "M820.4 291.9L1013.2 291.9",
  "M997.2 275.9L997.2 872.2",
  "M1013.2 856.2L820.4 856.2",
  "M836.4 866.9L836.4 786.2",
  "M820.4 796.9L951.1 796.9",
  "M935.1 812.9L935.1 335.1",
  "M951.1 351.1L820.4 351.1",
  "M836.4 361.8L836.4 281.2",
];

const NODES: [number, number][] = [
  [363.6, 321.5],
  [836.4, 321.5],
  [363.6, 826.6],
  [836.4, 826.6],
  [446.3, 604.6],
  [591.2, 604.7],
];

/**
 * The [a] mark sketched with its construction lines, in white for the end
 * screen. Draws itself once, when its RevealOnce wrapper is revealed.
 */
export function SketchMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="110 180 980 790"
      width="300"
      height="242"
      fill="none"
      aria-hidden
      className={cn(styles.mark, "h-auto max-w-full", className)}
    >
      <defs>
        <pattern id="end-mark-hatch" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V11" className="sk-hl" />
        </pattern>
      </defs>
      <g className="sk-g">
        {GRID.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="sk-c">
        <ellipse cx="591.2" cy="604.7" rx="73.1" ry="109.3" />
        <ellipse cx="571.8" cy="604.7" rx="125.6" ry="162" />
        <path d="M600 160A440 440 0 0 1 1030 520" />
      </g>
      <g className="sk-h">
        <path
          d="M363.6 291.9L202.8 291.9L202.8 856.2L363.6 856.2L363.6 796.9L264.9 796.9L264.9 351.1L363.6 351.1Z"
          fill="url(#end-mark-hatch)"
        />
        <path
          d="M836.4 291.9L997.2 291.9L997.2 856.2L836.4 856.2L836.4 796.9L935.1 796.9L935.1 351.1L836.4 351.1Z"
          fill="url(#end-mark-hatch)"
        />
      </g>
      <g className="sk-l">
        {BRACKETS.map((d) => (
          <path key={d} pathLength={1} d={d} />
        ))}
      </g>
      <g className="sk-a">
        <path pathLength={1} d={A_GLYPH} transform="translate(425.625 760) scale(0.51666667 -0.51666667)" />
      </g>
      <g className="sk-n">
        {NODES.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" />
        ))}
      </g>
      <g className="sk-d">
        <path
          pathLength={1}
          d="M202.8 236H997.2M202.8 222V250M997.2 222V250M150 291.9V856.2M136 291.9H164M136 856.2H164"
        />
      </g>
    </svg>
  );
}

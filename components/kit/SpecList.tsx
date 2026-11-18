import type { Spec } from "@/content/types";
import { cn } from "@/lib/utils";

type SpecListProps = {
  specs: Spec[];
  /** Width of the label column, from the boards: 96, 110 or 120 px. */
  labelWidth?: 96 | 110 | 120;
  /** Row rhythm: 7 px (services) or 11 px (AWS, products). */
  density?: "tight" | "loose";
  className?: string;
};

const LABEL_WIDTH = {
  96: "grid-cols-[96px_minmax(0,1fr)]",
  110: "grid-cols-[110px_minmax(0,1fr)]",
  120: "grid-cols-[120px_minmax(0,1fr)]",
} as const;

/** Key and value rows. Separated by space only: no hairlines. */
export function SpecList({ specs, labelWidth = 120, density = "tight", className }: SpecListProps) {
  return (
    <dl className={className}>
      {specs.map((spec) => (
        <div
          key={spec.label}
          className={cn(
            "grid items-baseline",
            LABEL_WIDTH[labelWidth],
            density === "tight" ? "gap-4 py-[7px] text-base" : "gap-3 py-[11px] text-[0.875rem] max-md:text-base",
          )}
        >
          <dt className="type-label text-mute">{spec.label}</dt>
          <dd>{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

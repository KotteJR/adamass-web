import type { Step } from "@/content/types";
import { cn } from "@/lib/utils";

type NumberedStepsProps = {
  steps: Step[];
  /** lg: engagement card (17 px titles). md: product steps. sm: the call-to-action card. */
  size?: "lg" | "md" | "sm";
  className?: string;
};

const SIZES = {
  lg: { row: "grid-cols-[32px_minmax(0,1fr)] gap-3 py-4 md:grid-cols-[44px_minmax(0,1fr)] md:gap-4 md:py-[18px]", title: "text-lg font-medium tracking-[-0.015em]", gap: "gap-1" },
  md: { row: "grid-cols-[40px_minmax(0,1fr)] gap-3.5 py-4", title: "text-base font-medium", gap: "gap-1" },
  sm: { row: "grid-cols-[34px_minmax(0,1fr)] gap-3 py-3", title: "text-base font-medium", gap: "gap-[3px]" },
} as const;

/** "01 Frame. Write the brief first." Numbered with the list itself, spaced without rules. */
export function NumberedSteps({ steps, size = "lg", className }: NumberedStepsProps) {
  const s = SIZES[size];
  return (
    <ol className={className}>
      {steps.map((step, i) => (
        <li key={step.title} className={cn("grid", s.row)}>
          <span aria-hidden className="pt-1 font-mono text-[0.6875rem] text-mute">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className={cn("flex flex-col", s.gap)}>
            <p className="flex flex-wrap items-baseline gap-x-2.5">
              <span className={s.title}>{step.title}</span>
              {step.kicker ? <span className="text-sm text-slate">{step.kicker}</span> : null}
            </p>
            <p className={cn("text-slate", size === "md" ? "text-[0.875rem] leading-normal max-md:text-base" : "text-sm")}>
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

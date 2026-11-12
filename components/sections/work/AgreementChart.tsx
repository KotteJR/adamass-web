import type { DotChart } from "@/content/work";
import { PanelLabel } from "./PanelLabel";

/** The held-out test: one dot per answer, filled where it matches the reviewer. */
export function AgreementChart({ chart }: { chart: DotChart & { matched: number; total: number } }) {
  return (
    <figure role="img" aria-label={chart.description} className="m-0 flex flex-col gap-2.5">
      <PanelLabel>{chart.label}</PanelLabel>
      <div className="grid grid-cols-[repeat(20,8px)] gap-[3px]">
        {Array.from({ length: chart.total }, (_, i) =>
          i < chart.matched ? (
            <span key={i} title="Matches the reviewer" className="size-2 rounded-full bg-lit" />
          ) : (
            <span key={i} title="Differs from the reviewer" className="size-2 rounded-full bg-[#c9d5e3]" />
          ),
        )}
      </div>
      <span className="text-[13px] text-slate">
        <b className="font-medium text-ink">{chart.strong}</b> {chart.rest}
      </span>
    </figure>
  );
}

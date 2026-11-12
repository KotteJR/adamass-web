import type { DotChart } from "@/content/work";
import { PanelLabel } from "./PanelLabel";

/** The model's size as one square per billion parameters. */
export function ModelSizeChart({ chart }: { chart: DotChart & { billions: number } }) {
  return (
    <figure role="img" aria-label={chart.description} className="m-0 flex flex-col gap-2.5">
      <PanelLabel>{chart.label}</PanelLabel>
      <div className="grid grid-cols-[repeat(9,14px)] gap-[3px]">
        {Array.from({ length: chart.billions }, (_, i) => (
          <span key={i} title="1 billion parameters" className="size-3.5 rounded-[3px] bg-lit" />
        ))}
      </div>
      <span className="text-[13px] text-slate">
        <b className="font-medium text-ink">{chart.strong}</b> {chart.rest}
      </span>
    </figure>
  );
}

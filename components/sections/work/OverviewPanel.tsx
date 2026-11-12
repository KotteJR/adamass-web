import type { WorkProduct } from "@/content/work";
import { AgreementChart } from "./AgreementChart";
import { ModelSizeChart } from "./ModelSizeChart";
import { PanelText } from "./PanelText";
import { StatGrid } from "./StatGrid";

/** Overview: what it is, then three figures, or the SLM's size and score. */
export function OverviewPanel({ overview }: { overview: WorkProduct["modal"]["overview"] }) {
  return (
    <div className="flex flex-col gap-6">
      <PanelText>{overview.body}</PanelText>
      {overview.stats ? <StatGrid stats={overview.stats} /> : null}
      {overview.charts ? (
        <div className="grid items-start gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-9">
          <ModelSizeChart chart={overview.charts.size} />
          <AgreementChart chart={overview.charts.agreement} />
        </div>
      ) : null}
    </div>
  );
}

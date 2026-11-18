import { ModelFigure } from "@/components/products/models/ModelFigure";
import type { WorkProduct } from "@/content/work";
import { cn } from "@/lib/utils";
import { PanelLabel } from "./PanelLabel";

type ModelHarnessProps = Pick<WorkProduct["modal"]["model"], "figure" | "stats" | "capabilities">;

/**
 * The model tab's harness: one outlined frame for every product. The figure
 * sits on a soft band, the steps run in even columns under it (two by two when
 * there are four), then the stats line up in the same columns, or the SLM's
 * "what the model does" rows follow.
 */
export function ModelHarness({ figure, stats, capabilities }: ModelHarnessProps) {
  const columns = figure.steps.length === 3 ? 3 : 2;
  return (
    <div className="overflow-hidden rounded-xl border border-[#e7e6e1] dark:border-line">
      <figure className="m-0">
        <div className="bg-paper px-4 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-6">
          <ModelFigure figureKey={figure.key} label={figure.label} />
        </div>
        <figcaption>
          <ol className={cn("grid border-t border-[#e7e6e1] dark:border-line", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
            {figure.steps.map((step, k) => (
              <li
                key={step}
                className={cn(
                  "flex flex-col gap-1.5 px-3 pt-4 pb-[18px] sm:px-[18px]",
                  k % columns !== 0 && "border-l border-[#e7e6e1] dark:border-line",
                  k >= columns && "border-t border-[#e7e6e1] dark:border-line",
                )}
              >
                <span className="text-[13.5px] leading-[1.4] text-[#2a2d33] dark:text-ink sm:text-[14px]">{step}</span>
              </li>
            ))}
          </ol>
        </figcaption>
      </figure>

      {stats ? (
        <dl className="grid grid-cols-3 border-t border-[#e7e6e1] dark:border-line">
          {stats.map((stat, k) => (
            <div key={stat.label} className={cn("flex flex-col gap-1.5 px-3 pt-5 pb-[22px] sm:px-[18px]", k > 0 && "border-l border-[#e7e6e1] dark:border-line")}>
              <dt className="order-last text-[13px] leading-[1.4] text-slate">{stat.label}</dt>
              <dd className="font-display text-[22px] leading-[1.05] font-normal tracking-[-0.02em] sm:text-[28px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {capabilities ? (
        <div className="border-t border-[#e7e6e1] dark:border-line">
          <div className="px-3 pt-4 pb-2.5 sm:px-[18px]">
            <PanelLabel>{capabilities.label}</PanelLabel>
          </div>
          <dl>
            {capabilities.items.map((item) => (
              <div
                key={item.text}
                className="flex items-center justify-between gap-4 border-t border-[#e7e6e1] dark:border-line px-3 py-[11px] sm:px-[18px]"
              >
                <dt className="text-[14px] text-[#3d424a] dark:text-ink-2">{item.text}</dt>
                <dd className="flex-none type-label text-lit">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}

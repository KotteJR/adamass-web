import type { WorkProduct } from "@/content/work";
import { ModelHarness } from "./ModelHarness";
import { PanelText } from "./PanelText";

/** The model: how it was built, then the harness (figure, steps, stats or what it does), then more about the approach. */
export function ModelPanel({ model }: { model: WorkProduct["modal"]["model"] }) {
  return (
    <div className="flex flex-col gap-7">
      <PanelText>{model.body}</PanelText>
      <ModelHarness figure={model.figure} stats={model.stats} capabilities={model.capabilities} />
      {model.more?.map((text) => <PanelText key={text}>{text}</PanelText>)}
    </div>
  );
}

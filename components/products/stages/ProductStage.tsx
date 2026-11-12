import type { StageVariant } from "@/content/product-stages";
import type { StageKey } from "@/content/work";
import { ComplianceStage } from "./ComplianceStage";
import { ExtractionStage } from "./ExtractionStage";
import { MorrowStage } from "./MorrowStage";
import { MurmurStage } from "./MurmurStage";

const STAGES = {
  murmur: MurmurStage,
  morrow: MorrowStage,
  compliance: ComplianceStage,
  extraction: ExtractionStage,
} as const;

/**
 * A stage's design size: the card (780 x 450), the modal's left half (600 x 780),
 * or on the phone sheet the card, except Morrow's, which is the modal's top half (600 x 420).
 * minWidth: the narrowest the modal shape is laid out for before it scales down.
 */
export function stageSize(stage: StageKey, variant: StageVariant) {
  if (variant === "modal") return { width: 600, height: 780, minWidth: stage === "morrow" ? 600 : 0 };
  if (variant === "sheet" && stage === "morrow") return { width: 600, height: 420, minWidth: 0 };
  return { width: 780, height: 450, minWidth: 0 };
}

/** A product's live stage, in its card or modal shape. */
export function ProductStage({ stage, variant }: { stage: StageKey; variant: StageVariant }) {
  const Stage = STAGES[stage];
  return <Stage variant={variant} />;
}

import { DrawnMark } from "@/components/brand/DrawnMark";
import { Painting } from "@/components/brand/Painting";
import type { CardFace as CardFaceContent } from "@/content/work";
import { DotsFeature } from "./DotsFeature";
import { FaceLayers } from "./FaceLayers";
import { LibraryFeature } from "./LibraryFeature";
import { LoopFeature } from "./LoopFeature";
import { NdaFeature } from "./NdaFeature";
import { TilesFeature } from "./TilesFeature";

/** The painting is drawn on the 600 x 780 stage but shows at the card's size. */
export const CARD_SIZES = "(min-width: 1280px) 20vw, 50vw";

/** The face's one feature. */
function featureFor(feature: CardFaceContent["feature"]) {
  switch (feature.kind) {
    case "loop":
      return <LoopFeature />;
    case "tiles":
      return <TilesFeature guesses={feature.guesses} answer={feature.answer} />;
    case "dots":
      return <DotsFeature filled={feature.filled} total={feature.total} />;
    case "library":
      return <LibraryFeature sentence={feature.sentence} controls={feature.controls} />;
    case "nda":
      return <NdaFeature />;
  }
}

/**
 * A work card's face, drawn on a 600 x 780 stage (FitStage scales it): the
 * painting in the card's accent and one still feature, centred. Decorative;
 * the card's caption below says the same in words.
 */
export function CardFace({ face }: { face: CardFaceContent }) {
  return (
    <div aria-hidden className="relative isolate h-full overflow-hidden text-white">
      <Painting name={face.painting} position={face.position} drift="none" sizes={CARD_SIZES} />
      <FaceLayers face={face} />
      {featureFor(face.feature)}
      {face.mark ? <DrawnMark className="absolute right-[34px] bottom-[34px] w-[84px] text-white/55" /> : null}
    </div>
  );
}

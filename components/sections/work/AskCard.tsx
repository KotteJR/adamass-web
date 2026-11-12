import { FitStage } from "@/components/products/stages/FitStage";
import type { WorkSectionContent } from "@/content/work";
import { CardFace } from "./faces/CardFace";
import { NdaBanner } from "./faces/NdaBanner";
import { WorkCardCaption } from "./WorkCardCaption";

/**
 * The fifth card: other client work is under NDA, so it asks for a call. From
 * 768 px its face is a portrait like the others; on phones a short banner
 * across both columns, with only the line and the link under it.
 */
export function AskCard({ ask }: { ask: WorkSectionContent["ask"] }) {
  return (
    <article aria-labelledby="work-ask" className="group relative flex w-full min-w-0 flex-col">
      <FitStage
        width={600}
        height={780}
        initialScale={0.42}
        className="isolate aspect-[600/780] rounded-xl max-md:hidden"
        stageClassName="transition-transform duration-800 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:[--zoom:1.02]"
      >
        <CardFace face={ask.face} />
      </FitStage>
      <div className="md:hidden">
        <NdaBanner face={ask.face} />
      </div>
      <WorkCardCaption
        kind={ask.label}
        titleId="work-ask"
        name={ask.name}
        line={ask.line}
        href={ask.action.href}
        lineOnlyOnPhone
        link={
          <>
            {ask.action.label}
            <span aria-hidden className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5">
              →
            </span>
          </>
        }
      />
    </article>
  );
}

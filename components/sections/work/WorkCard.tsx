import { ArrowUpRightIcon } from "lucide-react";
import { FitStage } from "@/components/products/stages/FitStage";
import { getCopy } from "@/content/copy";
import { workHash, type WorkProduct } from "@/content/work";
import { CardFace } from "./faces/CardFace";
import { WorkCardCaption } from "./WorkCardCaption";

type WorkCardProps = {
  product: WorkProduct;
  /** One of the two cards on top from 768 to 1279 px. */
  wide?: boolean;
};

/**
 * One piece of work in the grid: a still face (one painting in the card's
 * accent and one feature of the work, 600 x 780, scaled to the card), then the
 * caption. The live product is in the modal; the whole card opens it (#work/<product>).
 */
export async function WorkCard({ product, wide = false }: WorkCardProps) {
  const { workSection, ui } = await getCopy();
  return (
    <article aria-labelledby={`work-${product.slug}`} className="group relative flex w-full min-w-0 flex-col">
      <FitStage
        width={600}
        height={780}
        initialScale={0.42}
        className="isolate aspect-[600/780] rounded-xl"
        stageClassName="transition-transform duration-800 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:[--zoom:1.02]"
      >
        <CardFace face={product.face} />
      </FitStage>
      <WorkCardCaption
        kind={product.tags[0]}
        titleId={`work-${product.slug}`}
        name={product.name}
        line={product.cardLine}
        href={`#${workHash(product.slug)}`}
        wide={wide}
        link={
          <>
            {workSection.learnMore}
            <span className="sr-only">
              {" "}
              {ui.about} {product.name}
            </span>
            <ArrowUpRightIcon
              aria-hidden
              className="size-[15px] transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </>
        }
      />
    </article>
  );
}

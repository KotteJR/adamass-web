import { Container } from "@/components/kit/Container";
import { SectionHeading } from "@/components/kit/SectionHeading";
import { anchors } from "@/content/site";
import { getCopy } from "@/content/copy";
import { cn } from "@/lib/utils";
import { AskCard } from "./work/AskCard";
import { WorkCard } from "./work/WorkCard";
import { WorkModal } from "./work/WorkModal";
import type { ProductSlug } from "@/content/work";

/**
 * Selected work: our two products and two client systems as cards with live
 * previews, each opening its modal (#work/<product>), and a fifth card that
 * asks about other work. From 1280 px all five sit in one row; from 768 px two
 * on top and three below (a six-column grid); on phones two by two, then the
 * ask card across both columns.
 */
export async function Work({ as = "h2", cardHref }: { as?: "h1" | "h2"; cardHref?: (slug: ProductSlug) => string } = {}) {
  const { workProducts, workSection } = await getCopy();
  return (
    <section id={anchors.work} aria-labelledby="work-title" className="pt-16 pb-20 lg:pt-[88px] lg:pb-[104px]">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <SectionHeading id="work-title" as={as} headline={workSection.headline} size="lead" />
          <p className="max-w-[400px] text-base text-slate">{workSection.intro}</p>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-6 md:gap-x-4 md:gap-y-10 xl:grid-cols-5">
          {workProducts.map((product, index) => (
            <li
              key={product.slug}
              className={cn("flex min-w-0 xl:col-span-1", index < 2 ? "md:col-span-3" : "md:col-span-2")}
            >
              <WorkCard product={product} wide={index < 2} href={cardHref?.(product.slug)} />
            </li>
          ))}
          <li className="col-span-2 flex min-w-0 xl:col-span-1">
            <AskCard ask={workSection.ask} />
          </li>
        </ul>
      </Container>
      <WorkModal />
    </section>
  );
}

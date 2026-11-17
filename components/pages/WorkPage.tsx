import { ActionLink } from "@/components/kit/ActionLink";
import { ArrowLink } from "@/components/kit/ArrowLink";
import { Container } from "@/components/kit/Container";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { FitStage } from "@/components/products/stages/FitStage";
import { ProductStage, stageSize } from "@/components/products/stages/ProductStage";
import { ClosingBackdrop } from "@/components/sections/ClosingBackdrop";
import { EndScreen } from "@/components/sections/EndScreen";
import { ModelPanel } from "@/components/sections/work/ModelPanel";
import { OverviewPanel } from "@/components/sections/work/OverviewPanel";
import { StackPanel } from "@/components/sections/work/StackPanel";
import { getCopy, getLang } from "@/content/copy";
import { pathOf, workKey } from "@/content/routes";
import type { ProductSlug } from "@/content/work";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * A piece of work as its own page: what the modal shows in tabs, laid out in
 * order (overview, the model, the stack), beside the product's live stage.
 */
export async function WorkPage({ slug }: { slug: ProductSlug }) {
  const [lang, { workProducts, workSection, pages }] = await Promise.all([getLang(), getCopy()]);
  const product = workProducts.find((p) => p.slug === slug)!;
  const { modal } = product;
  const size = stageSize(product.stage, "modal");
  const others = workProducts.filter((p) => p.slug !== slug);

  return (
    <>
      <Container className="flex flex-col gap-8 pt-6 pb-16 md:pt-10 lg:pb-24">
        <Breadcrumbs
          label={pages.crumbs.label}
          items={[
            { label: pages.crumbs.home, href: pathOf("home", lang) },
            { label: pages.crumbs.work, href: pathOf("work", lang) },
            { label: product.name },
          ]}
        />
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-14">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <MonoLabel>{modal.label}</MonoLabel>
              <h1 className="text-5xl font-medium text-balance">
                <span className="block">{modal.title.lead}</span>
                <span className="block text-haze">{modal.title.rest}</span>
              </h1>
            </div>
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-medium">{workSection.modal.tabs.overview}</h2>
              <OverviewPanel overview={modal.overview} />
            </section>
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-medium">{workSection.modal.tabs.model}</h2>
              <ModelPanel model={modal.model} />
            </section>
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-medium">{workSection.modal.tabs.stack}</h2>
              <StackPanel stack={modal.stack} />
            </section>
            <div className="flex flex-wrap items-center gap-2">
              <ActionLink href={modal.cta.href}>{modal.cta.label}</ActionLink>
              <ActionLink href={workSection.modal.write.href} tone="soft">
                {workSection.modal.write.label}
              </ActionLink>
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <FitStage
              width={size.width}
              height={size.height}
              initialScale={0.8}
              className="isolate aspect-[600/780] overflow-hidden rounded-xl bg-painting"
            >
              <ProductStage stage={product.stage} variant="modal" />
            </FitStage>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-6 lg:pt-10">
          <MonoLabel size="md">{pages.workPage.all}</MonoLabel>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {others.map((other) => (
              <li key={other.slug}>
                <ArrowLink href={pathOf(workKey(other.slug), lang)}>{other.name}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <ClosingBackdrop>
        <EndScreen />
      </ClosingBackdrop>
    </>
  );
}

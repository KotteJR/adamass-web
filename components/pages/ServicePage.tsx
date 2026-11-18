import { SERVICE_FIGURES } from "@/components/brand/figures/serviceFigures";
import { ActionLink } from "@/components/kit/ActionLink";
import { ArrowLink } from "@/components/kit/ArrowLink";
import { Container } from "@/components/kit/Container";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { SpecList } from "@/components/kit/SpecList";
import { Tag } from "@/components/kit/Tag";
import { ClosingBackdrop } from "@/components/sections/ClosingBackdrop";
import { EndScreen } from "@/components/sections/EndScreen";
import { ServiceFigurePanel } from "@/components/sections/four-ways/ServiceFigurePanel";
import { Process } from "@/components/sections/Process";
import { WorkCard } from "@/components/sections/work/WorkCard";
import { getCopy, getLang } from "@/content/copy";
import { serviceRelated, serviceWay } from "@/content/pages";
import { pathOf, serviceKey, workKey } from "@/content/routes";
import type { ServiceId } from "@/content/services";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * A service's own page: the step from Five ways in at full size (title, summary,
 * specs, the figure with its three parts), then what it connects to on AWS and
 * in our work, the other ways in, and its way in on the night band before the end screen.
 */
export async function ServicePage({ id }: { id: ServiceId }) {
  const [lang, copy] = await Promise.all([getLang(), getCopy()]);
  const { services, awsOffers, workProducts, pages, hero } = copy;
  const index = services.findIndex((s) => s.id === id);
  const service = services[index];
  const Figure = SERVICE_FIGURES[id];
  const related = serviceRelated[id];
  const offers = related.aws.map((mode) => awsOffers.find((o) => o.mode === mode)).filter((o) => o !== undefined);
  const work = related.work.map((slug) => workProducts.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  const others = services.filter((s) => s.id !== id);
  const way = serviceWay[id];

  return (
    <>
      <Container className="flex flex-col gap-8 pt-6 pb-16 md:pt-10 lg:pb-24">
        <Breadcrumbs
          label={pages.crumbs.label}
          items={[
            { label: pages.crumbs.home, href: pathOf("home", lang) },
            { label: pages.crumbs.services, href: pathOf("services", lang) },
            { label: service.title },
          ]}
        />
        <div className="grid items-center gap-10 lg:split-cols">
          <div className="flex flex-col gap-5">
            <Tag className="self-start">{service.tag}</Tag>
            <h1 className="font-display text-5xl font-normal text-balance">{service.title}</h1>
            <p className="max-w-[520px] text-lg text-ink-2">{service.summary}</p>
            <SpecList specs={service.specs} className="max-w-[520px]" />
            <ActionLink href="#contact" className="self-start">
              {hero.action.label}
            </ActionLink>
          </div>
          <ServiceFigurePanel
            service={service}
            index={index}
            className="relative h-[clamp(300px,86vw,440px)] overflow-hidden rounded-xl bg-paper lg:h-[600px]"
          >
            <Figure label={service.figureLabel} />
          </ServiceFigurePanel>
        </div>

        {/* What it involves, in words (the figure's strip says it in short). */}
        <div className="flex flex-col gap-5 pt-6 lg:pt-10">
          <MonoLabel>{pages.service.involves}</MonoLabel>
          <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
            {service.entails.map((part, i) => (
              <li key={part.title} className="flex flex-col gap-2 rounded-xl bg-paper p-6">
                <span className="font-mono text-2xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl font-normal">{part.title}</span>
                <span className="text-base text-slate">{part.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {offers.length > 0 ? (
          <div className="flex flex-col gap-5 pt-6 lg:pt-10">
            <MonoLabel>{pages.service.aws}</MonoLabel>
            <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
              {offers.map((offer) => (
                <li key={offer.id} className="flex flex-col gap-3 rounded-xl bg-paper p-6">
                  <span className="flex items-center gap-2">
                    {offer.marketplaceUrl ? <Tag tone="white">Marketplace</Tag> : null}
                  </span>
                  <span className="font-display text-2xl font-normal">{offer.title}</span>
                  <span className="text-base text-slate">{offer.body}</span>
                  <ArrowLink href={offer.marketplaceUrl ?? pathOf("aws", lang)} className="mt-auto self-start pt-2">
                    {offer.marketplaceUrl ? copy.awsSection.listed.action : pages.service.more}
                  </ArrowLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {work.length > 0 ? (
          <div className="flex flex-col gap-5 pt-6 lg:pt-10">
            <MonoLabel>{pages.service.work}</MonoLabel>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4">
              {work.map((product) => (
                <li key={product.slug} className="flex min-w-0">
                  <WorkCard product={product} href={pathOf(workKey(product.slug), lang)} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col gap-5 pt-6 lg:pt-10">
          <MonoLabel>{pages.service.others}</MonoLabel>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {others.map((other) => (
              <li key={other.id}>
                <ArrowLink href={pathOf(serviceKey(other.id), lang)}>{other.title}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <ClosingBackdrop>
        {way ? <Process only={way} label={pages.service.runs} /> : null}
        <EndScreen />
      </ClosingBackdrop>
    </>
  );
}

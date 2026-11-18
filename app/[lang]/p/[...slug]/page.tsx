import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/kit/Container";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { SectionHeading } from "@/components/kit/SectionHeading";
import { BookedPage } from "@/components/pages/BookedPage";
import { Breadcrumbs } from "@/components/pages/Breadcrumbs";
import { JsonLd } from "@/components/pages/JsonLd";
import { ServicePage } from "@/components/pages/ServicePage";
import { FaqPage, LegalPage } from "@/components/pages/TextPages";
import { WorkPage } from "@/components/pages/WorkPage";
import { Aws } from "@/components/sections/Aws";
import { ClosingBackdrop } from "@/components/sections/ClosingBackdrop";
import { EndScreen } from "@/components/sections/EndScreen";
import { FourWays } from "@/components/sections/FourWays";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { copies, isLang, languages, ogLocale, type Lang } from "@/content/languages";
import { pageAt, pageKeys, pathOf, routes, workKey, type PageKey } from "@/content/routes";
import type { ServiceId } from "@/content/services";
import type { ProductSlug } from "@/content/work";
import { pageJsonLd } from "@/lib/page-json-ld";

type Params = { lang: string; slug: string[] };

/** Every page in every language, built ahead of time. */
export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const lang = isLang(params.lang) ? params.lang : "en";
  return pageKeys.map((key) => ({ slug: routes[key][lang].split("/") }));
}

function resolve(params: Params): { lang: Lang; key: PageKey } | undefined {
  if (!isLang(params.lang)) return undefined;
  const key = pageAt(params.lang, params.slug);
  return key ? { lang: params.lang, key } : undefined;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const found = resolve(await params);
  if (!found) return {};
  const { lang, key } = found;
  const { title, description } = copies[lang].pages.meta[key];
  const site = copies[lang].site;
  return {
    title,
    description,
    alternates: {
      canonical: pathOf(key, lang),
      languages: Object.fromEntries([...languages.map((l) => [l, pathOf(key, l)]), ["x-default", pathOf(key, "en")]]),
    },
    openGraph: {
      type: "website",
      url: pathOf(key, lang),
      siteName: site.shortName,
      title: `${title} · ${site.shortName}`,
      description,
      locale: ogLocale[lang],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.shortName}`, description },
    // The booking confirmation is for the person who just booked, not for search.
    ...(key === "booked" ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const found = resolve(await params);
  if (!found) notFound();
  const { lang, key } = found;
  const { pages } = copies[lang];

  let body: React.ReactNode;
  if (key.startsWith("service:")) {
    body = <ServicePage id={key.slice("service:".length) as ServiceId} />;
  } else if (key.startsWith("work:")) {
    body = <WorkPage slug={key.slice("work:".length) as ProductSlug} />;
  } else if (key === "services") {
    body = (
      <>
        <Container className="flex flex-col gap-6 pt-6 md:pt-10">
          <Breadcrumbs label={pages.crumbs.label} items={[{ label: pages.crumbs.home, href: pathOf("home", lang) }, { label: pages.crumbs.services }]} />
          <div className="flex max-w-[720px] flex-col gap-5">
            <MonoLabel>{pages.servicesIndex.label}</MonoLabel>
            <SectionHeading as="h1" headline={pages.servicesIndex.title} size="cta" />
            <p className="max-w-[560px] text-lg text-slate">{pages.servicesIndex.intro}</p>
          </div>
        </Container>
        <FourWays />
        <ClosingBackdrop>
          <Process />
          <EndScreen />
        </ClosingBackdrop>
      </>
    );
  } else if (key === "aws") {
    body = (
      <>
        <Container className="pt-6 md:pt-10">
          <Breadcrumbs label={pages.crumbs.label} items={[{ label: pages.crumbs.home, href: pathOf("home", lang) }, { label: "AWS" }]} />
        </Container>
        <Aws as="h1" />
        <ClosingBackdrop>
          <EndScreen />
        </ClosingBackdrop>
      </>
    );
  } else if (key === "work") {
    body = (
      <>
        <Container className="pt-6 md:pt-10">
          <Breadcrumbs label={pages.crumbs.label} items={[{ label: pages.crumbs.home, href: pathOf("home", lang) }, { label: pages.crumbs.work }]} />
        </Container>
        <Work as="h1" cardHref={(slug) => pathOf(workKey(slug), lang)} />
        <ClosingBackdrop>
          <EndScreen />
        </ClosingBackdrop>
      </>
    );
  } else if (key === "faq") {
    body = <FaqPage />;
  } else if (key === "booked") {
    return <BookedPage />;
  } else {
    body = <LegalPage which={key === "privacy" ? "privacy" : "terms"} />;
  }

  return (
    <>
      {body}
      <JsonLd data={pageJsonLd(key, lang)} />
    </>
  );
}

import { Container } from "@/components/kit/Container";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { SectionHeading } from "@/components/kit/SectionHeading";
import { getCopy, getLang } from "@/content/copy";
import { pathOf } from "@/content/routes";
import { Breadcrumbs } from "./Breadcrumbs";

/** Questions and answers: each question on the left, its answer on the right, spaced, no rules. */
export async function FaqPage() {
  const [lang, { pages }] = await Promise.all([getLang(), getCopy()]);
  const { faq } = pages;
  return (
    <Container className="flex flex-col gap-10 pt-6 pb-24 md:pt-10 lg:pb-32">
      <Breadcrumbs label={pages.crumbs.label} items={[{ label: pages.crumbs.home, href: pathOf("home", lang) }, { label: faq.label }]} />
      <div className="flex max-w-[720px] flex-col gap-5">
        <MonoLabel>{faq.label}</MonoLabel>
        <SectionHeading as="h1" headline={faq.title} size="cta" />
        <p className="max-w-[560px] text-lg text-slate">{faq.intro}</p>
      </div>
      <dl className="flex flex-col gap-8 lg:gap-10">
        {faq.items.map((item) => (
          <div key={item.q} className="grid gap-3 lg:split-cols">
            <dt className="font-display text-xl font-normal text-balance">{item.q}</dt>
            <dd className="max-w-[620px] text-base text-slate">{item.a}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}

/** The privacy policy or the terms: a title, the date, then headed paragraphs at a reading width. */
export async function LegalPage({ which }: { which: "privacy" | "terms" }) {
  const [lang, { pages }] = await Promise.all([getLang(), getCopy()]);
  const doc = pages.legal[which];
  return (
    <Container className="flex flex-col gap-8 pt-6 pb-24 md:pt-10 lg:pb-32">
      <Breadcrumbs label={pages.crumbs.label} items={[{ label: pages.crumbs.home, href: pathOf("home", lang) }, { label: doc.title }]} />
      <article className="flex max-w-[680px] flex-col gap-4">
        <h1 className="font-display text-5xl font-normal text-balance">{doc.title}</h1>
        <p className="type-label text-mute">
          {pages.legal.updatedLabel} {pages.legal.updated}
        </p>
        {doc.body.map((block, i) =>
          "h" in block ? (
            <h2 key={i} className="pt-6 font-display text-xl font-normal">
              {block.h}
            </h2>
          ) : (
            <p key={i} className="text-base leading-[1.65] text-slate">
              {block.p}
            </p>
          ),
        )}
      </article>
    </Container>
  );
}

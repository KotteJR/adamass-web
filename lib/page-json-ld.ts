// Structured data for the pages beyond the home page: where the page sits
// (BreadcrumbList), and what it is about (a Service, or the FAQ's questions).

import { copies, type Lang } from "@/content/languages";
import { pathOf, type PageKey } from "@/content/routes";
import type { ServiceId } from "@/content/services";

export function pageJsonLd(key: PageKey, lang: Lang) {
  const copy = copies[lang];
  const { site, pages } = copy;
  const url = (path: string) => (path === "/" ? `${site.url}/` : `${site.url}${path}`);
  const org = { "@id": `${site.url}/#organization` };
  const meta = pages.meta[key];

  const crumbs: { name: string; path: string }[] = [{ name: pages.crumbs.home, path: pathOf("home", lang) }];
  if (key.startsWith("service:")) crumbs.push({ name: pages.crumbs.services, path: pathOf("services", lang) });
  if (key.startsWith("work:")) crumbs.push({ name: pages.crumbs.work, path: pathOf("work", lang) });
  crumbs.push({ name: meta.title, path: pathOf(key, lang) });

  const graph: object[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: url(c.path) })),
    },
    { "@type": "WebPage", "@id": `${url(pathOf(key, lang))}#webpage`, url: url(pathOf(key, lang)), name: meta.title, description: meta.description, inLanguage: lang, isPartOf: { "@id": `${site.url}/#website` }, about: org },
  ];

  if (key.startsWith("service:")) {
    const service = copy.services.find((s) => s.id === (key.slice(8) as ServiceId))!;
    graph.push({
      "@type": "Service",
      name: service.title,
      serviceType: service.title,
      description: service.summary,
      provider: org,
      areaServed: [{ "@type": "Country", name: "Sweden" }],
      url: url(pathOf(key, lang)),
    });
  }
  if (key === "faq") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: pages.faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

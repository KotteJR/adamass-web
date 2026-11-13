// Structured data (schema.org) for search engines and AI assistants: who the
// company is, what it does and knows, and the two language versions of the site.

import { copies, homePath, type Lang } from "@/content/languages";
import { anchors } from "@/content/site";

/** What the company works with, as search engines and assistants match it. Every item is shown on the site. */
const KNOWS_ABOUT: Record<Lang, string[]> = {
  en: [
    "Artificial intelligence",
    "Generative AI",
    "Large language models",
    "Small language models",
    "Fine-tuning",
    "Reinforcement learning",
    "Retrieval-augmented generation (RAG)",
    "AI agents",
    "Machine learning engineering",
    "Amazon Bedrock",
    "Amazon SageMaker",
    "Amazon Web Services (AWS)",
    "Cloud architecture",
    "Cloud migration",
    "Software modernisation",
    "Technical due diligence",
    "SOC 2 readiness",
    "Software engineering",
  ],
  sv: [
    "Artificiell intelligens",
    "Generativ AI",
    "Stora språkmodeller",
    "Små språkmodeller",
    "Finjustering av modeller",
    "Förstärkningsinlärning",
    "RAG (retrieval-augmented generation)",
    "AI-agenter",
    "Maskininlärning",
    "Amazon Bedrock",
    "Amazon SageMaker",
    "Amazon Web Services (AWS)",
    "Molnarkitektur",
    "Molnmigrering",
    "Modernisering av system",
    "Teknisk due diligence",
    "SOC 2-beredskap",
    "Mjukvaruutveckling",
  ],
};

export function siteJsonLd(lang: Lang) {
  const { site, founders, services, awsOffers } = copies[lang];
  const base = site.url;
  const org = `${base}/#organization`;
  const page = `${base}${homePath[lang] === "/" ? "/" : homePath[lang]}`;

  const offers = [
    ...services.map((service) => ({ name: service.title, description: service.summary, url: `${page}#${anchors.services}` })),
    ...awsOffers.map((offer) => ({ name: offer.title, description: offer.body, url: offer.marketplaceUrl ?? `${page}#${anchors.aws}` })),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": org,
        name: site.name,
        legalName: site.name,
        alternateName: site.shortName,
        url: `${base}/`,
        logo: { "@type": "ImageObject", url: `${base}/icons/icon-512.png`, width: 512, height: 512 },
        image: `${base}/icons/icon-512.png`,
        description: site.description,
        email: site.email,
        telephone: site.phone,
        foundingDate: site.founded,
        identifier: { "@type": "PropertyValue", propertyID: "Organisationsnummer", value: site.orgNumber },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressCountry: site.address.countryCode,
        },
        knowsAbout: KNOWS_ABOUT[lang],
        knowsLanguage: ["en", "sv"],
        founder: founders.map((person) => ({ "@type": "Person", name: person.name, jobTitle: person.role, email: person.email })),
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.email, telephone: site.phone },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: lang === "sv" ? "Tjänster" : "Services",
          itemListElement: offers.map((offer) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: offer.name, description: offer.description, url: offer.url, provider: { "@id": org } },
          })),
        },
        sameAs: [site.linkedin, site.awsMarketplace, site.companyRecord],
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: site.shortName,
        alternateName: [site.name, "adamass.se"],
        inLanguage: ["en", "sv"],
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": `${page}#webpage`,
        url: page,
        name: site.title,
        description: site.description,
        inLanguage: lang,
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": org },
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped as the Next docs advise. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

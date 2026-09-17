import { faqs, faqDescription, faqPath, faqTitle } from "./faq";
import {
  SITE_ALLABOLAG,
  SITE_AWS_MARKETPLACE,
  SITE_COUNTRY,
  SITE_COUNTRY_NAME,
  SITE_EMAIL,
  SITE_FOUNDED,
  SITE_GEO,
  SITE_LANGUAGE,
  SITE_LINKEDIN,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_ORG_NUMBER,
  SITE_PHONE,
  SITE_POSTAL,
  SITE_REGION,
  SITE_SHORT_NAME,
  SITE_SLOGAN,
  SITE_STREET,
  SITE_URL,
  defaultDescription,
  defaultTitle,
  longDescription,
  organizationId,
  people,
  services,
  websiteId,
} from "./site";

export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": organizationId,
        name: SITE_NAME,
        legalName: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: SITE_URL,
        email: SITE_EMAIL,
        telephone: SITE_PHONE,
        description: longDescription,
        foundingDate: SITE_FOUNDED,
        slogan: SITE_SLOGAN,
        taxID: SITE_ORG_NUMBER,
        identifier: {
          "@type": "PropertyValue",
          name: "Organisation number",
          value: SITE_ORG_NUMBER,
        },
        image: `${SITE_URL}/opengraph-image`,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/brand/adamass-lockup-primary.svg`,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_STREET,
          postalCode: SITE_POSTAL,
          addressLocality: SITE_LOCALITY,
          addressRegion: SITE_REGION,
          addressCountry: SITE_COUNTRY,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE_GEO.latitude,
          longitude: SITE_GEO.longitude,
        },
        areaServed: [
          { "@type": "Country", name: SITE_COUNTRY_NAME },
          { "@type": "AdministrativeArea", name: "European Union" },
        ],
        sameAs: [SITE_LINKEDIN, SITE_ALLABOLAG, SITE_AWS_MARKETPLACE],
        knowsAbout: [
          "Embedded software delivery",
          "Legacy modernisation",
          "Technical due diligence",
          "Strategic IT advisory",
          "Generative AI",
          "GenAI Development",
          "AWS Marketplace professional services",
          "Machine learning engineering",
        ],
        employee: people.map((person) => ({
          "@type": "Person",
          name: person.name,
          jobTitle: person.role,
          email: person.email,
          telephone: person.phone,
          worksFor: { "@id": organizationId },
          url: SITE_URL,
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: SITE_EMAIL,
            telephone: SITE_PHONE,
            contactType: "sales",
            availableLanguage: ["English", "Swedish"],
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Adamass services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description,
              provider: { "@id": organizationId },
              areaServed: SITE_COUNTRY_NAME,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: defaultDescription,
        inLanguage: SITE_LANGUAGE,
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export function homePageGraph() {
  const webpageId = `${SITE_URL}/#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: SITE_URL,
        name: defaultTitle,
        description: defaultDescription,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryImageOfPage: `${SITE_URL}/opengraph-image`,
      },
    ],
  };
}

export function legalPageGraph({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: "/privacy" | "/terms" | "/faq";
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${title} | ${SITE_NAME}`,
        description,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: url,
          },
        ],
      },
    ],
  };
}

export function faqPageGraph() {
  const url = `${SITE_URL}${faqPath}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        name: `${faqTitle} | ${SITE_NAME}`,
        description: faqDescription,
        inLanguage: SITE_LANGUAGE,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: faqTitle,
            item: url,
          },
        ],
      },
    ],
  };
}

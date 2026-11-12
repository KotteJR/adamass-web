// Organization structured data for the home page (schema.org).

import { founders, site } from "@/content/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: `${site.url}/brand/adamass-lockup-primary.svg`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    foundingDate: site.founded,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Organisationsnummer",
      value: site.orgNumber,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    founder: founders.map((person) => ({
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
      email: person.email,
    })),
    sameAs: [site.linkedin, site.awsMarketplace],
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped as the Next docs advise. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

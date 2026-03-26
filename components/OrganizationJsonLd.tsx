import { SITE_NAME, SITE_URL, defaultDescription } from "@/lib/site";

export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    email: "hello@adamass.se",
    description: defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Malmö",
      addressCountry: "SE",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

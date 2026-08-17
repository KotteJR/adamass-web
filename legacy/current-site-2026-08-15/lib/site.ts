/**
 * Canonical origin for metadata, sitemap, and JSON-LD.
 * The site is served at both adamass.se and www.adamass.se; we standardise on apex here.
 * www → apex redirect is set in next.config.mjs (flip there if you prefer www as canonical).
 */
export const SITE_URL = "https://adamass.se";

export const SITE_URL_WWW = "https://www.adamass.se";

export const SITE_NAME = "Adamass AB";

export const defaultDescription =
  "Boutique IT and software consultancy in Malmö, Sweden. Embedded delivery with your team, legacy modernisation, technical due diligence for investors and founders, and strategic IT advisory — plus generative AI and production engineering when your product needs it.";

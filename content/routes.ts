// Every page besides the home page, with its address in each language. English
// lives at the root (/services/...), Swedish under /sv with Swedish words
// (/sv/tjanster/...). The catch-all route under app/[lang] serves them all.

import type { Lang } from "./locale";
import type { ServiceId } from "./services";
import type { ProductSlug } from "./work";

export type PageKey =
  | "services"
  | `service:${ServiceId}`
  | "aws"
  | "work"
  | `work:${ProductSlug}`
  | "faq"
  | "privacy"
  | "terms"
  | "booked";

/** Path segments under the language's home, per language. */
export const routes: Record<PageKey, Record<Lang, string>> = {
  services: { en: "services", sv: "tjanster" },
  "service:embedded": { en: "services/embedded-delivery", sv: "tjanster/inbaddad-leverans" },
  "service:modernisation": { en: "services/modernisation", sv: "tjanster/modernisering" },
  "service:diligence": { en: "services/due-diligence", sv: "tjanster/due-diligence" },
  "service:genai": { en: "services/genai-development", sv: "tjanster/generativ-ai" },
  "service:soc2": { en: "services/soc2-readiness", sv: "tjanster/soc2" },
  aws: { en: "aws", sv: "aws" },
  work: { en: "work", sv: "arbeten" },
  "work:murmur": { en: "work/murmur", sv: "arbeten/murmur" },
  "work:morrow": { en: "work/morrow", sv: "arbeten/morrow" },
  "work:paint-by-numbers": { en: "work/paint-by-numbers", sv: "arbeten/paint-by-numbers" },
  "work:compliance-slm": { en: "work/compliance-slm", sv: "arbeten/compliance-slm" },
  faq: { en: "faq", sv: "vanliga-fragor" },
  privacy: { en: "privacy", sv: "integritet" },
  terms: { en: "terms", sv: "villkor" },
  // Where the booking calendar lands after a call is booked. Not indexed, not in the sitemap.
  booked: { en: "booked", sv: "bokat" },
};

export const pageKeys = Object.keys(routes) as PageKey[];

/** Pages that search engines and assistants should know about (all but the booking confirmation). */
export const listedPageKeys = pageKeys.filter((key) => key !== "booked");

/** The site-relative path of a page: /services/genai-development, /sv/tjanster/generativ-ai. */
export function pathOf(key: PageKey | "home", lang: Lang): string {
  if (key === "home") return lang === "en" ? "/" : "/sv";
  const slug = routes[key][lang];
  return lang === "en" ? `/${slug}` : `/sv/${slug}`;
}

/** Which page a language's path segments name, if any. */
export function pageAt(lang: Lang, segments: string[]): PageKey | undefined {
  const slug = segments.join("/");
  return pageKeys.find((key) => routes[key][lang] === slug);
}

export const serviceKey = (id: ServiceId): PageKey => `service:${id}`;
export const workKey = (slug: ProductSlug): PageKey => `work:${slug}`;

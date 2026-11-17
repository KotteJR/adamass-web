import type { MetadataRoute } from "next";
import { languages } from "@/content/languages";
import { pageKeys, pathOf, type PageKey } from "@/content/routes";
import { site } from "@/content/site";

/** How much each page matters, for the sitemap. */
const PRIORITY = (key: PageKey | "home") =>
  key === "home" ? 1 : key === "services" || key === "aws" || key.startsWith("service:") ? 0.9 : key === "work" || key.startsWith("work:") ? 0.8 : key === "faq" ? 0.6 : 0.3;

// Every page in both languages, each naming its twin, so search engines index
// the Swedish pages for Swedish searches.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);
  const keys: (PageKey | "home")[] = ["home", ...pageKeys];
  return keys.flatMap((key) => {
    const alternates = { languages: Object.fromEntries(languages.map((lang) => [lang, url(pathOf(key, lang))])) };
    return languages.map((lang) => ({
      url: url(pathOf(key, lang)),
      changeFrequency: key === "privacy" || key === "terms" ? ("yearly" as const) : ("monthly" as const),
      priority: lang === "en" ? PRIORITY(key) : Math.round(PRIORITY(key) * 0.9 * 10) / 10,
      alternates,
    }));
  });
}

import type { MetadataRoute } from "next";
import { homePath, languages } from "@/content/languages";
import { site } from "@/content/site";

// Both language versions, each naming the other, so search engines index the
// Swedish page for Swedish searches.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);
  const alternates = { languages: Object.fromEntries(languages.map((lang) => [lang, url(homePath[lang])])) };
  return languages.map((lang) => ({
    url: url(homePath[lang]),
    changeFrequency: "monthly",
    priority: lang === "en" ? 1 : 0.9,
    alternates,
  }));
}

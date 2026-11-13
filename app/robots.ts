import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Search engines and AI assistants named one by one. Everything is already open
 * to every crawler; naming them states that on purpose, so a later blanket rule
 * cannot shut them out by accident.
 */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "DuckAssistBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

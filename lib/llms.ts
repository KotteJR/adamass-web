// /llms.txt and /llms-full.txt: the site as plain Markdown for AI assistants and
// agents (llmstxt.org). Built from the same content files as the page, so it
// never drifts. Figures the founders have not confirmed yet (TODO in content/)
// are left out, and so is anything the page itself does not say.

import { copies, homePath } from "@/content/languages";
import { listedPageKeys, pathOf } from "@/content/routes";
import { anchors } from "@/content/site";

const en = copies.en;
const sv = copies.sv;
const home = `${en.site.url}/`;
const swedishHome = `${en.site.url}${homePath.sv}`;

function facts() {
  const { site } = en;
  return [
    `- Legal name: ${site.name} (organisation number ${site.orgNumber})`,
    `- Based in: ${site.address.city}, ${site.address.country}. Office: ${site.address.building}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
    `- Working since: ${site.founded}`,
    `- Email: ${site.email}`,
    `- Phone: ${site.phone}`,
    `- Website: ${home} (English), ${swedishHome} (Swedish)`,
    `- LinkedIn: ${site.linkedin}`,
    `- AWS Marketplace: ${site.awsMarketplace}`,
    `- People: ${en.founders.map((person) => `${person.name}, ${person.role} (${person.email})`).join("; ")}`,
  ].join("\n");
}

function aiWork() {
  const product = (slug: string) => en.workProducts.find((p) => p.slug === slug)!;
  const slm = product("compliance-slm");
  const genai = en.services.find((s) => s.id === "genai")!;
  const bedrock = en.awsOffers.find((o) => o.id === "genai-bedrock")!;
  const perimeter = en.awsOffers.find((o) => o.id === "perimeter")!;
  return [
    `- ${genai.title}: ${genai.summary} Typically ${genai.specs.find((s) => s.label === "Typically")?.value.toLowerCase()}.`,
    `- ${bedrock.title}: ${bedrock.body}`,
    `- ${perimeter.title} (on AWS Marketplace): ${perimeter.body}`,
    `- ${slm.name} (client work): ${slm.modal.overview.body} ${slm.modal.model.body} On a held-out test, 94 of 100 answers match the human reviewer.`,
    `- ${product("murmur").name} (our product): ${product("murmur").line}`,
    `- ${product("morrow").name} (our product, ${product("morrow").modal.cta.href}): ${product("morrow").line}`,
    `- ${product("paint-by-numbers").name} (our product, ${product("paint-by-numbers").modal.cta.href}): ${product("paint-by-numbers").line}`,
  ].join("\n");
}

function swedishSummary() {
  return [
    `${sv.site.name} är ett AI- och mjukvaruföretag i Malmö sedan ${sv.site.founded}: AI-konsulter, data scientists, ML-ingenjörer, utvecklare och arkitekter. Vi tränar och finjusterar språkmodeller, bygger generativ AI, RAG och AI-agenter på AWS, och arbetar i kundens team eller levererar hela projektet.`,
    "",
    `Tjänster: ${sv.services.map((s) => s.title.toLowerCase()).join(", ")}. På AWS: ${sv.awsOffers.map((o) => o.title).join(", ")}.`,
    "",
    `Svensk webbplats: ${swedishHome}. Kontakt: ${sv.site.email}, ${sv.site.phone}.`,
  ].join("\n");
}

/** The short version: who, what, and where to read more. */
export function llmsIndex() {
  const { site, hero, statement, services, awsOffers, howWeWork } = en;
  return `# ${site.name}

> ${site.description}

${hero.intro} ${statement.columns.map((column) => column.text).join(" ")}

## Facts

${facts()}

## AI work

${aiWork()}

## Services

${services.map((s) => `- [${s.title}](${home}#${anchors.services}): ${s.summary}`).join("\n")}

## AWS

${awsOffers.map((o) => `- [${o.title}](${o.marketplaceUrl ?? `${home}#${anchors.aws}`}): ${o.body}`).join("\n")}

## How an engagement runs

${howWeWork.phases.map((phase, i) => `${i + 1}. ${phase.title}: ${phase.body}`).join("\n")}

## På svenska

${swedishSummary()}

## Pages

${listedPageKeys.map((key) => `- [${en.pages.meta[key].title}](${en.site.url}${pathOf(key, "en")}): ${en.pages.meta[key].description}`).join("\n")}

## Optional

- [Full text](${en.site.url}/llms-full.txt): every service, AWS offer and piece of work on the site, in full
- [Svenska](${swedishHome}): the site in Swedish
`;
}

/** Everything the page says, section by section. */
export function llmsFull() {
  const { site, services, awsOffers, awsSection, workProducts, workSection, howWeWork, contact } = en;
  const servicesText = services
    .map(
      (s) => `### ${s.title}

${s.summary}

${s.specs.map((spec) => `- ${spec.label}: ${spec.value}`).join("\n")}
${s.entails.map((part) => `- ${part.title}: ${part.text}`).join("\n")}`,
    )
    .join("\n\n");

  const awsText = awsOffers
    .map(
      (o) => `### ${o.title}${o.marketplaceUrl ? " (AWS Marketplace)" : ""}

${o.body}

${o.specs.map((spec) => `- ${spec.label}: ${spec.value}`).join("\n")}${o.marketplaceUrl ? `\n- Listing: ${o.marketplaceUrl}` : ""}`,
    )
    .join("\n\n");

  // Client work in full; our own products by their overview (their model figures are still being confirmed).
  const workText = workProducts
    .map((p) => {
      const parts = [`### ${p.name} (${p.tags.join(", ")})`, "", p.line, "", p.modal.overview.body];
      if (p.tags[0] === "Client work") {
        if (p.slug === "compliance-slm") parts.push("", p.modal.model.body);
        parts.push(...(p.modal.model.more ?? []).flatMap((line) => ["", line]));
        if (p.modal.model.capabilities) {
          parts.push("", ...p.modal.model.capabilities.items.map((item) => `- ${item.text}: ${item.value}`));
        }
      }
      return parts.join("\n");
    })
    .join("\n\n");

  return `${llmsIndex()}
---

# ${site.name}: full text

## Services

${servicesText}

## AWS

${awsSection.intro}

${awsText}

${awsSection.notes.map((note) => `- ${note.title}: ${note.body}`).join("\n")}

## Selected work

${workSection.intro}

${workText}

${workSection.ask.line}

## How an engagement runs

${howWeWork.intro}

${howWeWork.phases.map((phase, i) => `${i + 1}. ${phase.title}: ${phase.body}`).join("\n")}

Typical lengths: ${howWeWork.ways.map((way) => `${way.label}, ${way.length}`).join("; ")}.

## Getting in touch

${contact.steps.map((step, i) => `${i + 1}. ${step.title}: ${step.body}`).join("\n")}
`;
}

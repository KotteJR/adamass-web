import { SITE_AWS_MARKETPLACE } from "./site";

export type MarketplaceSpec = {
  k: string;
  v: string;
};

export type MarketplaceGlyph = "foundation" | "architect" | "perimeter";

export type MarketplaceListing = {
  id: string;
  title: string;
  body: string;
  href: string;
  glyph: MarketplaceGlyph;
  specs: [MarketplaceSpec, MarketplaceSpec, MarketplaceSpec];
};

export const marketplaceCatalogHref = SITE_AWS_MARKETPLACE;

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: "landing-zone-foundation",
    title: "Landing Zone Foundation",
    body: "A governed, multi-account cloud foundation, built with the platform's own governance tooling. For greenfield builds, and for teams already running in production without account separation or guardrails.",
    href: "https://aws.amazon.com/marketplace/pp/prodview-4h7t3cdxtjpr4",
    glyph: "foundation",
    specs: [
      {
        k: "Structure",
        v: "Account hierarchy, preventive guardrails, central identity",
      },
      {
        k: "Baseline",
        v: "Centralised logging, threat detection, posture monitoring",
      },
      {
        k: "Handover",
        v: "Documentation and a prioritised remediation backlog",
      },
    ],
  },
  {
    id: "architect-as-a-service",
    title: "Architect as a Service",
    body: "Senior cloud architecture judgement in blocks of 40 hours, drawn down flexibly across up to two months. Every block produces written output: decision records, review reports and a roadmap you can act on.",
    href: "https://aws.amazon.com/marketplace/pp/prodview-mijw2zrzgpxjy",
    glyph: "architect",
    specs: [
      { k: "Base unit", v: "40 hours, used over up to two months" },
      {
        k: "Scope",
        v: "Governance, AI platform design, cost, automation, enablement",
      },
      {
        k: "Stacking",
        v: "Buy multiple blocks, or attach one to an implementation",
      },
    ],
  },
  {
    id: "sovereign-ai-perimeter",
    title: "Sovereign AI Perimeter",
    body: "A private AI assistant running inside your own cloud account, on managed foundation models. Reachable only over VPN or another controlled channel, never the open internet. No new vendor holds your data.",
    href: "https://aws.amazon.com/marketplace/pp/prodview-ywcyptb7h5rgo",
    glyph: "perimeter",
    specs: [
      {
        k: "Location",
        v: "Your account, your region, your security boundary",
      },
      { k: "Access", v: "Private channel only, no public endpoint" },
      {
        k: "Control",
        v: "Model access, spend limits and audit logs stay yours",
      },
    ],
  },
];

export const marketplaceNotes = [
  {
    title: "How buying works",
    body: "These are professional services listings, so there is no checkout price. You request the service, we agree scope on a call, and we issue a private offer for you to accept. Billing arrives through the cloud account you already have.",
  },
  {
    title: "What is not included",
    body: "Cloud infrastructure and model usage are billed to you by your provider, separately from the service itself. We set up budgets and alerts so consumption is visible from the first day.",
  },
] as const;

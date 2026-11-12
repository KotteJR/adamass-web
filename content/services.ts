// Services ("Five ways in") and the AWS practice.
// Source: design/handoff/boards/Statement.dc.html and AwsExplorer.dc.html.

import { anchors, site } from "./site";
import type { Headline, LinkAction, Spec } from "./types";

// ─── Five ways in ──────────────────────────────────────────────

export type ServiceId = "embedded" | "modernisation" | "diligence" | "genai" | "soc2";

export type Service = {
  id: ServiceId;
  tag: string;
  title: string;
  /** Short name used in chips and charts. */
  shortTitle: string;
  summary: string;
  specs: Spec[];
  /** What the service involves, in three parts, shown under its figure. Each line is taken from the service's own copy. */
  entails: [Entail, Entail, Entail];
};

export type Entail = { title: string; text: string };

export const services: Service[] = [
  {
    id: "embedded",
    tag: "Delivery",
    title: "Embedded delivery",
    shortTitle: "Embedded delivery",
    summary:
      "We join your engineering team and work in its repositories, tools and ceremonies. One named lead stays accountable.",
    specs: [
      { label: "Starts with", value: "A named lead in your team" },
      { label: "Works in", value: "Your repos and rituals" },
      { label: "Typically", value: "3 months to 2 years" },
    ],
    entails: [
      { title: "Join", text: "Our people in your stand-ups, repos and on-call." },
      { title: "Ship", text: "Releases from the joint team reach your users." },
      { title: "Step out", text: "What we know moves to your own people." },
    ],
  },
  {
    id: "modernisation",
    tag: "Legacy",
    title: "Modernisation",
    shortTitle: "Modernisation",
    summary:
      "We find what is expensive to change in an ageing system and replace it in phases, while the rest keeps running.",
    specs: [
      { label: "Starts with", value: "An assessment of the estate" },
      { label: "Approach", value: "Phased, not a rewrite" },
      { label: "Meanwhile", value: "The system keeps running" },
    ],
    entails: [
      { title: "Assess", text: "What is expensive to change, and why." },
      { title: "Replace", text: "In phases, not a rewrite." },
      { title: "Keep running", text: "The rest of the system runs the whole time." },
    ],
  },
  {
    id: "diligence",
    tag: "Advisory",
    title: "Diligence and advisory",
    shortTitle: "Diligence",
    summary:
      "A verdict on a software asset, written for the people paying for it. The judgement we would act on ourselves.",
    specs: [
      { label: "Starts with", value: "A scoping call and code access" },
      { label: "Covers", value: "Architecture, data, team" },
      { label: "Typically", value: "3 to 5 weeks" },
    ],
    entails: [
      { title: "Read", text: "Code, cloud, documents and team interviews." },
      { title: "Review", text: "Architecture, data and delivery, risks priced." },
      { title: "Report", text: "Red flags, the cost to fix and a 90‑day plan." },
    ],
  },
  {
    id: "genai",
    tag: "AI",
    title: "GenAI development",
    shortTitle: "GenAI",
    summary:
      "Platforms, interfaces and the software a model lives in, or a model wired into the systems you already run.",
    specs: [
      { label: "Starts with", value: "A test on your own data" },
      { label: "Builds", value: "Platforms and integrations" },
      { label: "Typically", value: "8 to 14 weeks" },
    ],
    entails: [
      { title: "Test set", text: "Real questions from your team score each version." },
      { title: "Prototype", text: "Runs on your own documents, in your AWS account." },
      { title: "Live", text: "Guardrails on, and a trace behind every answer." },
    ],
  },
  {
    id: "soc2",
    tag: "Compliance",
    title: "SOC 2 readiness",
    shortTitle: "SOC 2",
    summary:
      "We get your AWS estate, policies and evidence ready for a SOC 2 audit, Type I and then Type II, and help you keep them ready. An independent auditor carries out the audit and issues the report.",
    specs: [
      { label: "Starts with", value: "Scope and a gap list" },
      { label: "Builds", value: "Controls, policies, evidence" },
      { label: "Typically", value: "Type I in 3 to 6 months" },
    ],
    entails: [
      { title: "Gap list", text: "Scope, criteria and the gaps in priority order." },
      { title: "Controls", text: "Policies, controls and evidence collected for you." },
      { title: "Audit", text: "An independent auditor tests and issues the report." },
    ],
  },
];

export const servicesSection = {
  label: "Five ways in",
  askLabel: "Ask about this",
  askHref: `#${anchors.contact}`,
} as const;

// ─── AWS ───────────────────────────────────────────────────────

/** Which motion story the cabinet figure plays. */
export type AwsMode = "lz" | "aas" | "sap" | "mig" | "genai";

export type AwsOffer = {
  id: string;
  mode: AwsMode;
  title: string;
  short: string;
  body: string;
  /** One line under the figure while this offer is selected. */
  readout: string;
  /** The figure's three-step story (3 s each), named above the drawing. */
  steps: [string, string, string];
  specs: Spec[];
  /** Present when the offer is listed on AWS Marketplace. */
  marketplaceUrl?: string;
};

export const awsOffers: AwsOffer[] = [
  {
    id: "landing-zone",
    mode: "lz",
    steps: ["Accounts open", "Guardrails lock", "Logs land in one place"],
    title: "Landing Zone Foundation",
    short: "A governed multi-account base",
    body: "A governed, multi-account cloud foundation, built with the platform's own governance tooling. For greenfield builds, and for teams already running in production without account separation or guardrails.",
    readout: "Six accounts · guardrail locked",
    specs: [
      { label: "Structure", value: "Account hierarchy, preventive guardrails, central identity" },
      { label: "Baseline", value: "Centralised logging, threat detection, posture monitoring" },
      { label: "Handover", value: "Documentation and a prioritised remediation backlog" },
    ],
    marketplaceUrl: "https://aws.amazon.com/marketplace/pp/prodview-4h7t3cdxtjpr4",
  },
  {
    id: "architect",
    mode: "aas",
    steps: ["The 40-hour clock starts", "Each account is reviewed", "A decision record comes out"],
    title: "Architect as a Service",
    short: "Senior judgement in 40-hour blocks",
    body: "Senior cloud architecture judgement in blocks of 40 hours, drawn down flexibly across up to two months. Every block produces written output: decision records, review reports and a roadmap you can act on.",
    readout: "40 hours in · one decision record out",
    specs: [
      { label: "Base unit", value: "40 hours, used over up to two months" },
      { label: "Scope", value: "Governance, AI platform design, cost, automation, enablement" },
      { label: "Stacking", value: "Buy multiple blocks, or attach one to an implementation" },
    ],
    marketplaceUrl: "https://aws.amazon.com/marketplace/pp/prodview-mijw2zrzgpxjy",
  },
  {
    id: "perimeter",
    mode: "sap",
    steps: ["Walls close around your account", "Questions use one private cable", "Public calls stop at the wall"],
    title: "Sovereign AI Perimeter",
    short: "A private assistant in your account",
    body: "A private AI assistant running inside your own cloud account, on managed foundation models. Reachable only over VPN or another controlled channel, never the open internet. No new vendor holds your data.",
    readout: "One private cable · zero public doors",
    specs: [
      { label: "Location", value: "Your account, your region, your security boundary" },
      { label: "Access", value: "Private channel only, no public endpoint" },
      { label: "Control", value: "Model access, spend limits and audit logs stay yours" },
    ],
    marketplaceUrl: "https://aws.amazon.com/marketplace/pp/prodview-ywcyptb7h5rgo",
  },
  {
    id: "migration",
    mode: "mig",
    steps: ["Rolled into staging", "Checks run until they agree", "Into production"],
    title: "Migration",
    short: "Move workloads in phases",
    body: "We move applications and data onto AWS step by step: staging first, production when the numbers agree.",
    readout: "Staging first · production when it holds",
    specs: [
      { label: "Approach", value: "Phased, reversible steps" },
      { label: "First", value: "An assessment you keep" },
      { label: "Targets", value: "Containers, managed data" },
    ],
  },
  {
    id: "genai-bedrock",
    mode: "genai",
    steps: ["Your product asks", "The right card is found", "The answer points to its card"],
    title: "GenAI on Bedrock",
    short: "Agents and models in your product",
    body: "AI built into your product on Amazon Bedrock and SageMaker, with any kind of model: language, vision, speech or forecasting. We build our own agent loops on Strands Agents, LangGraph and LangChain, train or tune a model when a ready one won’t do, and test it all before launch. Data stays in your account.",
    readout: "Every answer points to its card",
    specs: [
      { label: "Agents", value: "Custom loops on Strands, LangGraph and LangChain" },
      { label: "Models", value: "Any kind, from Bedrock or trained on SageMaker" },
      { label: "Proof", value: "Evaluations before launch, traces in production" },
    ],
  },
];

export type AwsNote = {
  title: string;
  body: string;
  link?: LinkAction;
};

export type AwsSectionContent = {
  headline: Headline;
  intro: string;
  tabsLabel: string;
  legend: { setUp: string; tray: string };
  listed: { where: string; action: string };
  direct: { where: string; action: LinkAction };
  notes: AwsNote[];
};

export const awsSection: AwsSectionContent = {
  headline: {
    lead: "AWS, from the first account up.",
    rest: "Pick a service to see what it sets up.",
  },
  intro:
    "Three of these are listed on AWS Marketplace. The drawing is your AWS organisation as a cabinet: each tray is an account, and blue is what the service puts in place.",
  tabsLabel: "AWS services",
  legend: { setUp: "Set up by this service", tray: "One tray, one account" },
  listed: { where: "Listed on AWS Marketplace", action: "See the listing" },
  direct: {
    where: "Delivered by our team",
    action: { label: "Ask us about it", href: `#${anchors.contact}` },
  },
  notes: [
    {
      title: "How buying works",
      body: "These are professional services listings, so there is no checkout price. You request the service, we agree scope on a call, and we issue a private offer for you to accept. Billing arrives through the cloud account you already have.",
    },
    {
      title: "What is not included",
      body: "Cloud infrastructure and model usage are billed to you by your provider, separately from the service itself. We set up budgets and alerts so consumption is visible from the first day.",
    },
    {
      title: "All listings",
      body: "Landing Zone Foundation, Architect as a Service and Sovereign AI Perimeter are listed on AWS Marketplace as private offers. Migration and GenAI on Bedrock are delivered directly.",
      link: { label: "Our AWS Marketplace profile", href: site.awsMarketplace },
    },
  ],
};

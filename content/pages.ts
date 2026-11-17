// The pages beyond the home page: their titles and descriptions for search,
// the few labels they add, the FAQ and the legal text. The pages' main copy
// comes from services.ts, work.ts and process.ts, so it is said once.

import type { PageKey } from "./routes";
import type { AwsMode, ServiceId } from "./services";
import { site } from "./site";
import type { Headline } from "./types";
import type { ProductSlug } from "./work";

export type PageMeta = { title: string; description: string };

/** A block of legal or FAQ prose: a paragraph, or a heading. */
export type Block = { h: string } | { p: string };

export type PagesContent = {
  meta: Record<PageKey, PageMeta>;
  crumbs: { label: string; home: string; services: string; work: string };
  servicesIndex: { label: string; title: Headline; intro: string };
  service: { involves: string; runs: string; aws: string; work: string; others: string; more: string };
  workPage: { all: string; label: string };
  faq: { label: string; title: Headline; intro: string; items: { q: string; a: string }[] };
  legal: { updatedLabel: string; updated: string; privacy: { title: string; body: Block[] }; terms: { title: string; body: Block[] } };
  footer: { services: string; company: string; faq: string; privacy: string; terms: string };
};

/** Which way in on the timeline belongs to a service (modernisation has none of its own). */
export const serviceWay: Partial<Record<ServiceId, string>> = {
  embedded: "embedded",
  diligence: "diligence",
  genai: "genai",
  soc2: "soc2",
};

/** What each service links to: AWS offers (by mode) and work (by slug). Editorial, not data. */
export const serviceRelated: Record<ServiceId, { aws: AwsMode[]; work: ProductSlug[] }> = {
  embedded: { aws: ["aas"], work: [] },
  modernisation: { aws: ["mig", "lz"], work: [] },
  diligence: { aws: ["aas"], work: [] },
  genai: { aws: ["genai", "sap"], work: ["compliance-slm", "library-extraction"] },
  soc2: { aws: ["lz"], work: [] },
};

export const pages: PagesContent = {
  meta: {
    services: {
      title: "IT and AI consulting services in Malmö",
      description:
        "Five ways in: embedded delivery, modernisation, technical due diligence, GenAI development and SOC 2 readiness. Senior engineers and data scientists in Malmö since 2019.",
    },
    "service:embedded": {
      title: "Embedded delivery: senior engineers inside your team",
      description:
        "Adamass engineers join your team and work in its repositories, tools and ceremonies, with one named lead. Typically 3 months to 2 years.",
    },
    "service:modernisation": {
      title: "Software modernisation in phases, not a rewrite",
      description:
        "We find what is expensive to change in an ageing system and replace it in phases while the rest keeps running. Modernisation from Adamass in Malmö.",
    },
    "service:diligence": {
      title: "Technical due diligence and advisory",
      description:
        "A written verdict on a software asset: architecture, data and team, risks priced, red flags and a 90-day plan. Typically 3 to 5 weeks. Adamass, Malmö.",
    },
    "service:genai": {
      title: "GenAI development and model fine-tuning",
      description:
        "We train and fine-tune models and build GenAI, RAG and agent systems on AWS, tested on your own data and run in your own account. Typically 8 to 14 weeks.",
    },
    "service:soc2": {
      title: "SOC 2 readiness on AWS",
      description:
        "We get your AWS estate, policies and evidence ready for a SOC 2 audit, Type I and then Type II. An independent auditor issues the report.",
    },
    aws: {
      title: "AWS consulting: landing zones, migration and Bedrock",
      description:
        "Landing Zone Foundation, Architect as a Service and Sovereign AI Perimeter on AWS Marketplace, plus migration and GenAI on Amazon Bedrock. Adamass, Malmö.",
    },
    work: {
      title: "Selected work: AI systems and products",
      description:
        "Our own products, Murmur and Morrow, and two AI systems built for clients in regulated work: a 27B compliance model and library-backed extraction.",
    },
    "work:murmur": {
      title: "Murmur: a music model for focus and sleep",
      description: "Murmur writes seamless loops for focus and sleep with an open-source music model we post-trained on lofi and noise.",
    },
    "work:morrow": {
      title: "Morrow: daily puzzles written by our own model",
      description: "Morrow gives away eleven puzzles every morning, written by a puzzle model we trained in house and checked by solvers for one answer.",
    },
    "work:compliance-slm": {
      title: "Compliance SLM: a 27B model in the client's cloud",
      description:
        "A 27B specialist model, fine-tuned and reinforced, that reads a regulatory article and returns the risks and controls that bind. 94 in 100 match the reviewer.",
    },
    "work:library-extraction": {
      title: "Library-backed extraction for compliance review",
      description: "Two retrieval paths, one over the document and one over a library of controls, so every answer is a control reviewers already recognise.",
    },
    faq: {
      title: "Questions about Adamass",
      description: "Who Adamass is, what we work on, how an engagement runs, how long work takes, how buying through AWS Marketplace works and how to start.",
    },
    privacy: { title: "Privacy policy", description: "How Adamass AB handles personal data on adamass.se, in briefs sent through the site and in email." },
    terms: { title: "Terms of use", description: "The terms for using adamass.se, the website of Adamass AB in Malmö, Sweden." },
  },
  crumbs: { label: "Breadcrumb", home: "Home", services: "Services", work: "Work" },
  servicesIndex: {
    label: "Services",
    title: { lead: "Five ways in.", rest: "One way of working." },
    intro:
      "A software and AI company in Malmö since 2019. Data scientists, engineers and architects who join your team or deliver the whole project. Pick the way in that fits the work.",
  },
  service: {
    involves: "What it involves",
    runs: "How it runs",
    aws: "On AWS",
    work: "Work like this",
    others: "Other ways in",
    more: "Read more",
  },
  workPage: { all: "All work", label: "Selected work" },
  faq: {
    label: "Questions",
    title: { lead: "Questions,", rest: "answered plainly." },
    intro: `The things people ask before they write to us. Anything else: ${site.email}.`,
    items: [
      {
        q: "What is Adamass?",
        a: "Adamass AB is a software and AI company in Malmö, Sweden, working since 2019. Data scientists, ML engineers, software and cloud engineers and architects join a client's team or deliver the whole project, and we build our own products, Murmur and Morrow, on the same stack.",
      },
      {
        q: "What do you work on?",
        a: "Five ways in: embedded delivery inside an existing team, modernisation of ageing systems, technical due diligence and advisory, GenAI development, and SOC 2 readiness. On AWS we also set up landing zones, migrate workloads and build on Amazon Bedrock.",
      },
      {
        q: "Do you build AI, or advise on it?",
        a: "We build it. We train and fine-tune models when a ready one will not do, build GenAI, RAG and agent systems on Amazon Bedrock and SageMaker, and test every version against real questions before launch. One example: a 27B compliance model, fine-tuned and reinforced, where 94 in 100 answers on a held-out test match the human reviewer. The data stays in the client's own AWS account.",
      },
      {
        q: "Are you a staffing company?",
        a: "No. People join your repositories, tools and ceremonies, but one named lead stays accountable for the work. When we leave, source, configuration and notes are with your team.",
      },
      {
        q: "How does an engagement run?",
        a: "Frame, join, deliver, handover. We agree the goal and how we will know it worked, start inside your team and tools, deliver in small pieces you can see and use, and hand over code, setup and know-how so it all runs without us.",
      },
      {
        q: "How long does the work take?",
        a: "Due diligence typically takes 3 to 5 weeks, GenAI development 8 to 14 weeks, and embedded delivery runs from 3 months to 2 years. SOC 2 readiness reaches Type I in 3 to 6 months. Architect as a Service comes in 40-hour blocks used over up to two months.",
      },
      {
        q: "What is on AWS Marketplace, and how does buying work?",
        a: "Three professional services: Landing Zone Foundation, Architect as a Service and Sovereign AI Perimeter. There is no checkout price: you request the service, we agree scope on a call and issue a private offer, and the bill arrives through the AWS account you already have.",
      },
      {
        q: "Where are you based?",
        a: `In Malmö, Sweden. Adamass AB has organisation number ${site.orgNumber}. We work with teams in Sweden and abroad.`,
      },
      {
        q: "How do we start?",
        a: `Send a short brief through the site or write to ${site.email}: a few lines on what feels heavy and by when. The people who would do the work read it, and we reply with availability and a short intro call.`,
      },
    ],
  },
  legal: {
    updatedLabel: "Last updated",
    updated: "17 November 2026",
    privacy: {
      title: "Privacy policy",
      body: [
        { p: `This policy explains how Adamass AB ("Adamass", "we") handles personal data when you use adamass.se, send us a brief through the site, or write to us. We are a software and AI company in Malmö, Sweden. We do not run advertising, and this website does not use marketing or analytics cookies.` },
        { h: "Who is responsible" },
        { p: `Adamass AB, organisation number ${site.orgNumber}, is the controller for the personal data described here. Write to ${site.email} with any question about this policy or your data.` },
        { h: "What we collect" },
        { p: "When you send a brief through the site, we receive what you enter: the topic, your name, your work email and your message. When you email us, we receive your address, the message and any attachments. We use these only to reply, to assess whether we are the right team, and to keep a record of the conversation." },
        { p: "Our hosting provider keeps ordinary technical logs for a short time (IP address, browser, the page requested and when) to run and secure the site, not to profile you. The site's fonts are served from our own domain, so no font requests go to third parties." },
        { p: "We do not place tracking cookies, do not use third-party analytics and do not sell personal data." },
        { h: "Why we process it" },
        { p: "We process briefs and email to respond and to take steps at your request before a possible engagement (GDPR article 6(1)(b)), and hosting logs in our legitimate interest of keeping the site available and secure (article 6(1)(f))." },
        { h: "How long we keep it" },
        { p: "Briefs and email are kept while the conversation is active and for a reasonable time afterwards, or longer when accounting rules, a contract or a legal claim requires it. Technical logs are kept only as long as the host needs them for operations and security." },
        { h: "Who we share it with" },
        { p: "We use a website host and email infrastructure to run adamass.se and receive messages; they process data on our instructions. We do not share your data with anyone else unless you ask us to, a contract requires it, or the law does." },
        { h: "Your rights" },
        { p: `You may ask for access to the personal data we hold about you, ask us to correct or delete it, restrict or object to certain processing, and request portability where that right applies. Write to ${site.email}. You may also complain to Integritetsskyddsmyndigheten (IMY), the Swedish supervisory authority.` },
        { h: "Changes" },
        { p: "If we change how the site collects data, we update this page and the date above." },
      ],
    },
    terms: {
      title: "Terms of use",
      body: [
        { p: "These terms apply to adamass.se, the website of Adamass AB in Malmö, Sweden. By using the site you accept them. They cover the website only: an engagement with Adamass starts only when both sides have agreed it in writing." },
        { h: "What this site is" },
        { p: "The site describes our work and how to reach us. Nothing on it is an offer, a quote or professional advice to rely on for a decision. Availability, scope and fees are confirmed in a written engagement if we take the work." },
        { h: "Briefs and messages" },
        { p: `You can send a brief through the site or write to ${site.email} or a named person. Sending a brief does not create a contract or an obligation for us to reply with a proposal. Do not send confidential client files, passwords or personal data you may not share until we have agreed how that material will be handled.` },
        { h: "Intellectual property" },
        { p: "Text, images, figures, paintings and marks on this site belong to Adamass AB or its licensors. You may not copy the site or its assets for a commercial purpose without our written consent. Client names and marks remain the clients' property and appear only as references." },
        { h: "Acceptable use" },
        { p: "Do not misuse the site: no scraping that burdens the service, no attempts to break its security, and no use of the content to suggest an association with Adamass that does not exist." },
        { h: "Liability" },
        { p: "The site is provided as it is. We take care to keep it accurate, but we do not promise that it is complete, current or always available. As far as Swedish law allows, Adamass AB is not liable for loss that comes only from using or being unable to use this website." },
        { h: "Privacy" },
        { p: "How we handle personal data is set out in the privacy policy." },
        { h: "Law" },
        { p: "These terms are governed by Swedish law, and Swedish courts have jurisdiction, with Malmö as the first venue where that choice is allowed. If part of these terms cannot be enforced, the rest still applies." },
        { h: "Changes" },
        { p: "We may update these terms when the site or our work changes. The date above is the version that applies." },
      ],
    },
  },
  footer: { services: "Services", company: "Company", faq: "Questions", privacy: "Privacy", terms: "Terms" },
};

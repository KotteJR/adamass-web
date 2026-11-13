// Company facts, people and navigation. Facts are from adamass.se.

import type { LinkAction } from "./types";

export const site = {
  name: "Adamass AB",
  shortName: "Adamass",
  // The address that answers: adamass.se redirects here, so links, the sitemap and the canonical all use it.
  url: "https://www.adamass.se",
  email: "hello@adamass.se",
  phone: "+46 70 917 94 98",
  // The office, in the Fridhemsborg building. TODO founders: Bolagsverket may still list Nordmannagatan 35 B.
  address: {
    building: "Fridhemsborg",
    street: "Fridhemsvägen 2",
    postalCode: "217 74",
    city: "Malmö",
    country: "Sweden",
    countryCode: "SE",
  },
  orgNumber: "559151-2388",
  founded: "2019",
  timeZone: "Europe/Stockholm",
  linkedin: "https://www.linkedin.com/company/adamass-ab",
  /** The public company record (allabolag.se), for search engines to tie the site to the company. */
  companyRecord: "https://www.allabolag.se/foretag/adamass-ab/malm%C3%B6/f%C3%B6retagsutveckling/2KH1IKKI5YEHU",
  awsMarketplace: "https://aws.amazon.com/marketplace/seller-profile?id=seller-rikosy4e7tpne",
  // What search results and assistants show. AI first: it is what people search for.
  title: "Adamass AB: AI and software engineering in Malmö, Sweden",
  description:
    "AI and software company in Malmö since 2019. We train and fine-tune models and build GenAI, RAG and agent systems on AWS, inside your team or as the whole project.",
};

export type Person = {
  name: string;
  role: string;
  email: string;
  initials: string;
  /** Avatar fill: the two founders use the two steel blues. */
  tone: "deep" | "steel";
};

export const founders: readonly Person[] = [
  {
    name: "Vlatko Kotevski",
    role: "CEO",
    email: "vlatko.kotevski@adamass.se",
    initials: "VK",
    tone: "deep",
  },
  {
    name: "Aleksandar Kotevski",
    role: "Partner, GenAI and ML",
    email: "aleksandar.kotevski@adamass.se",
    initials: "AK",
    tone: "steel",
  },
];

export type NavItem = {
  label: string;
  href: string;
  /** Shows the small ink dot from Hero A. */
  marked?: boolean;
  external?: boolean;
};

/** Section anchors used across the page. */
export const anchors = {
  top: "top",
  main: "main",
  studio: "studio",
  services: "services",
  work: "work",
  aws: "aws",
  process: "process",
  contact: "contact",
} as const;

/** The header's button, next to the links: it opens the brief. */
export const contactNav: LinkAction = { label: "Contact", href: `#${anchors.contact}` };

export const mainNav: readonly NavItem[] = [
  { label: "Work", href: `#${anchors.work}`, marked: true },
  { label: "Services", href: `#${anchors.services}` },
  { label: "AWS", href: `#${anchors.aws}` },
  { label: "Studio", href: `#${anchors.studio}` },
];

export const footerNav: readonly NavItem[] = [
  { label: "Work", href: `#${anchors.work}` },
  { label: "Services", href: `#${anchors.services}` },
  { label: "LinkedIn", href: site.linkedin, external: true },
  { label: "AWS Marketplace", href: site.awsMarketplace, external: true },
];

export const footer = {
  blurb: "Software and AI engineering, since 2019.",
};

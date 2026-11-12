// Company facts, people and navigation. Facts are from adamass.se.

export const site = {
  name: "Adamass AB",
  shortName: "Adamass",
  url: "https://adamass.se",
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
  awsMarketplace: "https://aws.amazon.com/marketplace/seller-profile?id=seller-rikosy4e7tpne",
  title: "Adamass: software and AI engineering in Malmö",
  description:
    "A software and AI company in Malmö since 2019. Data scientists, engineers and architects for embedded delivery, modernisation, diligence and GenAI development.",
} as const;

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
export const contactNav = { label: "Contact", href: `#${anchors.contact}` } as const;

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
} as const;

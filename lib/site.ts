export const SITE_URL = "https://adamass.se";
export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;
export const SITE_NAME = "Adamass AB";
export const SITE_SHORT_NAME = "Adamass";
export const SITE_EMAIL = "hello@adamass.se";
export const SITE_PHONE = "+46 70 917 94 98";
export const SITE_LOCALITY = "Malmö";
export const SITE_REGION = "Skåne";
export const SITE_COUNTRY = "SE";
export const SITE_COUNTRY_NAME = "Sweden";
export const SITE_STREET = "Nordmannagatan 35B";
export const SITE_POSTAL = "217 74";
export const SITE_ORG_NUMBER = "559151-2388";
export const SITE_FOUNDED = "2019";
export const SITE_REGISTERED = "2018-03-05";
export const SITE_LINKEDIN = "https://www.linkedin.com/company/adamass-ab";
export const SITE_ALLABOLAG =
  "https://www.allabolag.se/foretag/adamass-ab/malm%C3%B6/f%C3%B6retagsutveckling/2KH1IKKI5YEHU";
export const SITE_AWS_MARKETPLACE =
  "https://aws.amazon.com/marketplace/seller-profile?id=seller-rikosy4e7tpne";
export const SITE_LOCALE = "en_GB";
export const SITE_LANGUAGE = "en";
export const SITE_GEO = {
  latitude: 55.60587,
  longitude: 13.00073,
};

export const SITE_SLOGAN = "Senior delivery. Fixed accountability.";
export const SITE_PRACTICE_LINE =
  "Senior people. Clear ownership. Work that holds up.";

export const defaultTitle = `${SITE_NAME} | Senior IT consultancy in Malmö, Sweden`;

export const defaultDescription =
  "Boutique IT consultancy in Malmö since 2019. Named-lead delivery, modernisation, technical due diligence, GenAI, and AWS Marketplace services. Write to hello@adamass.se.";

export const longDescription =
  "Adamass AB is a boutique IT and software consultancy in Malmö, Sweden, founded in 2019. Senior people take named ownership of embedded software delivery, modernisation, technical due diligence, and generative AI for founders, investors, and engineering leaders.";

export const keywords = [
  "Adamass AB",
  "IT consultancy Malmö",
  "software consultancy Sweden",
  "embedded software delivery",
  "legacy modernisation",
  "technical due diligence",
  "strategic IT advisory",
  "generative AI consultancy",
  "GenAI Development",
  "synthetic data engineering",
  "AWS Marketplace professional services",
  "machine learning engineering",
  "IT-konsult Malmö",
] as const;

export const people = [
  {
    name: "Vlatko Kotevski",
    role: "CEO",
    email: "vlatko.kotevski@adamass.se",
    phone: "+46 70 917 94 98",
    tel: "+46709179498",
  },
  {
    name: "Aleksandar Kotevski",
    role: "Partner, GenAI and ML",
    email: "aleksandar.kotevski@adamass.se",
    phone: "+46 70 626 40 85",
    tel: "+46706264085",
  },
] as const;

export const services = [
  {
    name: "Embedded software delivery",
    description:
      "Adamass joins an existing engineering team and works in its repositories, tools, and ceremonies. One named technical lead stays accountable for applications, platforms, data, or production AI.",
  },
  {
    name: "Modernisation",
    description:
      "Adamass assesses ageing applications and data platforms, finds the expensive constraints, and replaces them in phases. The current system stays operable while the work is in progress.",
  },
  {
    name: "Diligence and strategic advisory",
    description:
      "Adamass examines software assets for acquisitions, investment, or internal decisions. The written report is the judgement the practice would act on, covering architecture, operations, security, team capability, and delivery risk.",
  },
  {
    name: "GenAI Development",
    description:
      "Adamass builds custom platforms, interfaces, and the software generative AI lives in, and wires models into the applications the client already runs.",
  },
  {
    name: "Landing Zone Foundation",
    description:
      "A governed, multi-account AWS foundation: account hierarchy, preventive guardrails, central identity, centralised logging, and a written handover with a prioritised remediation backlog.",
  },
  {
    name: "Architect as a Service",
    description:
      "Senior AWS architecture judgement in blocks of 40 hours. Written decision records, review reports, and a roadmap covering governance, AI platform design, cost, automation, and enablement.",
  },
  {
    name: "Sovereign AI Perimeter",
    description:
      "A private AI assistant inside the client's own AWS account, on managed foundation models. Reachable only over a controlled channel. Model access, spend limits, and audit logs stay with the client.",
  },
] as const;

export const coreServices = services.slice(0, 4);
export const marketplaceServices = services.slice(4);

export const selectedWork = [
  {
    title: "A first-pass regulatory auditor, private to the client's cloud",
    summary:
      "Reads one regulatory article and returns the risks and controls that bind, or nothing when the text does not. Built with supervised fine-tuning and reinforcement learning. A reviewer still signs. Deployed inside the client's AWS account.",
  },
] as const;

export const engagementSteps = [
  {
    name: "Frame",
    body: "Write objectives, constraints, assumptions, and success criteria first.",
  },
  {
    name: "Join",
    body: "Work in the client's systems with one named owner.",
  },
  {
    name: "Deliver",
    body: "Keep progress and decisions visible. Adjust against evidence.",
  },
  {
    name: "Handover",
    body: "Transfer source, configuration, and operating notes so ownership does not depend on Adamass staying.",
  },
] as const;

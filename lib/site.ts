export const SITE_URL = "https://adamass.se";
export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;
export const SITE_NAME = "Adamass AB";
export const SITE_SHORT_NAME = "Adamass";
export const SITE_EMAIL = "hello@adamass.se";
export const SITE_LOCALITY = "Malmö";
export const SITE_REGION = "Skåne";
export const SITE_COUNTRY = "SE";
export const SITE_COUNTRY_NAME = "Sweden";
export const SITE_FOUNDED = "2019";
export const SITE_LINKEDIN = "https://www.linkedin.com/company/adamass-ab";
export const SITE_LOCALE = "en_GB";
export const SITE_LANGUAGE = "en";
export const SITE_GEO = {
  latitude: 55.60587,
  longitude: 13.00073,
};

export const defaultTitle = `${SITE_NAME} | IT consultancy in Malmö, Sweden`;

export const defaultDescription =
  "Boutique IT consultancy in Malmö since 2019. Embedded software delivery, modernisation, technical due diligence, and generative AI. Write to hello@adamass.se.";

export const longDescription =
  "Adamass AB is a boutique IT and software consultancy in Malmö, Sweden, founded in 2019. Senior people take named ownership of embedded software delivery, generative AI and machine learning, legacy modernisation, and technical due diligence for founders, investors, and engineering leaders.";

export const keywords = [
  "Adamass AB",
  "IT consultancy Malmö",
  "software consultancy Sweden",
  "embedded software delivery",
  "legacy modernisation",
  "technical due diligence",
  "strategic IT advisory",
  "generative AI consultancy",
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
    name: "Modernisation and AI integration",
    description:
      "Adamass assesses ageing applications and data platforms, finds the expensive constraints, and replaces them in phases. AI is added only where it meets acceptance criteria and the people who will operate it.",
  },
  {
    name: "Diligence and strategic advisory",
    description:
      "Adamass examines software assets for acquisitions, investment, or internal decisions. The written report is the judgement the practice would act on, covering architecture, operations, security, team capability, and delivery risk.",
  },
] as const;

// Svenska: företagsuppgifter, personer och navigering. Fakta och länkar delas med den engelska sidan.

import * as en from "../site";
import type { NavItem, Person } from "../site";
import type { LinkAction } from "../types";

export * from "../site";

export const site: typeof en.site = {
  ...en.site,
  title: "Adamass AB: AI-konsulter och mjukvaruutveckling i Malmö",
  description:
    "AI- och mjukvaruföretag i Malmö sedan 2019. Vi tränar och finjusterar modeller och bygger generativ AI, RAG och AI-agenter på AWS, i ert team eller som ett helt projekt.",
};

export const founders: readonly Person[] = en.founders.map((person) => ({
  ...person,
  role: person.role === "CEO" ? "Vd" : "Partner, generativ AI och ML",
}));

export const contactNav: LinkAction = { ...en.contactNav, label: "Kontakt" };

const labels: Record<string, string> = {
  Work: "Arbeten",
  Services: "Tjänster",
  AWS: "AWS",
  Studio: "Om oss",
  LinkedIn: "LinkedIn",
  "AWS Marketplace": "AWS Marketplace",
};

export const mainNav: readonly NavItem[] = en.mainNav.map((item) => ({ ...item, label: labels[item.label] ?? item.label }));

export const footerNav: readonly NavItem[] = en.footerNav.map((item) => ({ ...item, label: labels[item.label] ?? item.label }));

export const footer: typeof en.footer = {
  blurb: "Mjukvaru- och AI-utveckling sedan 2019.",
};

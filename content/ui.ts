// Small labels the page needs outside the sections' own copy: navigation,
// screen-reader text and the language switch.

export type UiContent = {
  skipToContent: string;
  /** The logo link's name. */
  home: string;
  mainNav: string;
  footerNav: string;
  openMenu: string;
  closeMenu: string;
  siteNavigation: string;
  orgNumber: string;
  /** "Learn more about Murmur", read after the card's link. */
  about: string;
  /** "Good evening from Malmö". */
  greetingFrom: string;
  /** The language switch: its name, and each language in its own words. */
  language: { label: string; en: string; sv: string };
};

export const ui: UiContent = {
  skipToContent: "Skip to content",
  home: "Adamass AB, home",
  mainNav: "Main",
  footerNav: "Footer",
  openMenu: "Open menu",
  closeMenu: "Close",
  siteNavigation: "Site navigation",
  orgNumber: "Org. nr",
  about: "about",
  greetingFrom: "from",
  language: { label: "Language", en: "English", sv: "Svenska" },
};

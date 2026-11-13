// The site's two languages and all of their copy. English lives at /, Swedish
// at /sv. Each content file has a Swedish twin in content/sv with the same
// exports; anything it does not translate (ids, links, figures) it re-exports.

import * as enContact from "./contact";
import * as enHome from "./home";
import * as enProcess from "./process";
import * as enServices from "./services";
import * as enSite from "./site";
import * as enUi from "./ui";
import * as enWork from "./work";
import * as svContact from "./sv/contact";
import * as svHome from "./sv/home";
import * as svProcess from "./sv/process";
import * as svServices from "./sv/services";
import * as svSite from "./sv/site";
import * as svUi from "./sv/ui";
import * as svWork from "./sv/work";

export const languages = ["en", "sv"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "en";

export const isLang = (value: string | undefined): value is Lang => languages.some((lang) => lang === value);

/** Each language's home page. */
export const homePath: Record<Lang, string> = { en: "/", sv: "/sv" };

/** Open Graph locales. */
export const ogLocale: Record<Lang, string> = { en: "en_GB", sv: "sv_SE" };

const en = { ...enSite, ...enHome, ...enServices, ...enWork, ...enProcess, ...enContact, ...enUi };
export type Copy = typeof en;

// Typed against the English, so a missing or misshapen Swedish string fails the build.
const sv: Copy = { ...svSite, ...svHome, ...svServices, ...svWork, ...svProcess, ...svContact, ...svUi };

export const copies: Record<Lang, Copy> = { en, sv };

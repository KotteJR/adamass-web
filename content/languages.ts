// The site's two languages and all of their copy. English lives at /, Swedish
// at /sv. Each content file has a Swedish twin in content/sv with the same
// exports; anything it does not translate (ids, links, figures) it re-exports.

import * as enContact from "./contact";
import * as enHome from "./home";
import * as enPages from "./pages";
import * as enProcess from "./process";
import * as enServices from "./services";
import * as enSite from "./site";
import * as enUi from "./ui";
import * as enWork from "./work";
import * as svContact from "./sv/contact";
import * as svHome from "./sv/home";
import * as svPages from "./sv/pages";
import * as svProcess from "./sv/process";
import * as svServices from "./sv/services";
import * as svSite from "./sv/site";
import * as svUi from "./sv/ui";
import * as svWork from "./sv/work";

import type { Lang } from "./locale";

export * from "./locale";

const en = { ...enSite, ...enHome, ...enServices, ...enWork, ...enProcess, ...enContact, ...enUi, ...enPages };
export type Copy = typeof en;

// Typed against the English, so a missing or misshapen Swedish string fails the build.
const sv: Copy = { ...svSite, ...svHome, ...svServices, ...svWork, ...svProcess, ...svContact, ...svUi, ...svPages };

export const copies: Record<Lang, Copy> = { en, sv };

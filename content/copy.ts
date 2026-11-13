// The language and copy of the page being rendered, read from the [lang]
// segment. Server Components only: client components get their copy as props.

import { lang as rootLang } from "next/root-params";
import { copies, defaultLang, isLang, type Copy, type Lang } from "./languages";

export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  return isLang(value) ? value : defaultLang;
}

export async function getCopy(): Promise<Copy> {
  return copies[await getLang()];
}

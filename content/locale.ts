// The site's two languages and where each one's home page lives. Kept apart
// from the copy (languages.ts) so client components can use it cheaply.

export const languages = ["en", "sv"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "en";

export const isLang = (value: string | undefined): value is Lang => languages.some((lang) => lang === value);

/** Each language's home page. */
export const homePath: Record<Lang, string> = { en: "/", sv: "/sv" };

/** Open Graph locales. */
export const ogLocale: Record<Lang, string> = { en: "en_GB", sv: "sv_SE" };

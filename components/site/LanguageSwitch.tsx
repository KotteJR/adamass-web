"use client";

import { usePathname } from "next/navigation";
import { Flag } from "@/components/brand/Flag";
import { homePath, languages, type Lang } from "@/content/locale";
import { pageAt, pathOf } from "@/content/routes";
import type { UiContent } from "@/content/ui";
import { cn } from "@/lib/utils";

type LanguageSwitchProps = {
  current: Lang;
  labels: UiContent["language"];
  /** compact: flag and code, for the header bar. full: flag and the language's name, for the phone menu. */
  size?: "compact" | "full";
  className?: string;
};

/** The same page in another language: the page's twin if it has one, else that language's home page. */
export function twin(pathname: string, target: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  // "/en/p/..." is how a prerendered page sees itself; "/..." and "/sv/..." are how the browser does.
  const from: Lang = parts[0] === "sv" ? "sv" : "en";
  let rest = parts[0] === "sv" || parts[0] === "en" ? parts.slice(1) : parts;
  if (rest[0] === "p") rest = rest.slice(1);
  if (rest.length === 0) return homePath[target];
  const key = pageAt(from, rest);
  return key ? pathOf(key, target) : homePath[target];
}

/**
 * English and Swedish as two segments on a soft track, each a round one-colour
 * flag and its code, both in the text colour; the page's own language is the
 * white one, in ink. Each links to the same page in that language.
 */
export function LanguageSwitch({ current, labels, size = "compact", className }: LanguageSwitchProps) {
  const pathname = usePathname() ?? "/";
  const full = size === "full";
  return (
    <div
      role="group"
      aria-label={labels.label}
      className={cn("inline-flex items-center gap-0.5 rounded-sm bg-soft p-[3px]", full ? "h-12 w-full" : "h-9", className)}
    >
      {languages.map((lang) => {
        const active = lang === current;
        return (
          <a
            key={lang}
            href={twin(pathname, lang)}
            hrefLang={lang}
            lang={lang}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-full items-center justify-center gap-2 rounded-[5px] transition-colors",
              full ? "flex-1 text-base font-medium" : "px-2.5 font-mono text-[0.6875rem] tracking-[0.06em] uppercase",
              active ? "bg-canvas text-ink shadow-[0_1px_2px_rgb(13_23_38/0.08)]" : "text-slate hover:text-ink",
            )}
          >
            <Flag lang={lang} className={full ? "size-5" : undefined} />
            {full ? labels[lang] : <span aria-hidden>{lang}</span>}
            {full ? null : <span className="sr-only">{labels[lang]}</span>}
          </a>
        );
      })}
    </div>
  );
}

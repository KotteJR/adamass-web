import { Flag } from "@/components/brand/Flag";
import { homePath, languages, type Lang } from "@/content/languages";
import type { UiContent } from "@/content/ui";
import { cn } from "@/lib/utils";

type LanguageSwitchProps = {
  current: Lang;
  labels: UiContent["language"];
  /** compact: flag and code, for the header bar. full: flag and the language's name, for the phone menu. */
  size?: "compact" | "full";
  className?: string;
};

/**
 * English and Swedish as two segments on a soft track, each a round one-colour
 * flag and its code, both in the text colour; the page's own language is the
 * white one, in ink. Each is a plain link to that language's home page.
 */
export function LanguageSwitch({ current, labels, size = "compact", className }: LanguageSwitchProps) {
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
            href={homePath[lang]}
            hrefLang={lang}
            lang={lang}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-full items-center justify-center gap-2 rounded-[5px] transition-colors",
              full ? "flex-1 text-base font-medium" : "px-2.5 font-mono text-[0.6875rem] tracking-[0.06em] uppercase",
              active ? "bg-white text-ink shadow-[0_1px_2px_rgb(13_23_38/0.08)]" : "text-slate hover:text-ink",
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

import type { Lang } from "@/content/locale";
import { cn } from "@/lib/utils";

/**
 * The language switch's flags: round, in one colour (the text colour, so ink
 * when active and grey when not). From Emoji One's monotone set, by Emoji One
 * (https://github.com/EmojiTwo/emojitwo), CC BY 4.0
 * (https://creativecommons.org/licenses/by/4.0/); used unchanged. Credited in
 * THIRD_PARTY_NOTICES.md.
 */
const PATHS: Record<Lang, string> = {
  // flag-for-united-kingdom
  en: "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2M13.265 52.788a28 28 0 0 1-1.384-1.344l10.286-7.575v-2.036h-3.89l-8.938 6.585a28 28 0 0 1-2.751-4.682l2.584-1.903H5.787a28 28 0 0 1-1.156-3.934H26.1v21.47a28 28 0 0 1-3.933-1.156V46.227zM37.9 23.039V4.631q2.026.438 3.933 1.156v11.985l8.901-6.561q.715.648 1.384 1.344L41.833 20.13v2.036h3.888l8.939-6.584a28 28 0 0 1 2.751 4.68l-2.585 1.904h3.387a28 28 0 0 1 1.156 3.934H37.9zM13.239 11.234l8.926 6.559l.002-12.006A28 28 0 0 1 26.1 4.631V26.1H4.631q.438-2.026 1.156-3.934h3.387l-2.585-1.904c.249-.538.509-1.07.791-1.589l4.738 3.493l6.644-.001l-9.256-6.818a28 28 0 0 1 3.733-4.113m37.522 41.532l-8.926-6.56l-.002 12.007q-1.907.719-3.933 1.156v-21.47h21.469a28 28 0 0 1-1.156 3.934h-3.389l2.587 1.905a28 28 0 0 1-.791 1.588l-4.738-3.493l-6.646.001l9.258 6.818a28 28 0 0 1-3.733 4.114",
  // flag-for-sweden
  sv: "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m28 30c0 2.375-.3 4.681-.858 6.884H31.017v21.091a27.8 27.8 0 0 1-13.767-4.189V38.884H4.858a28 28 0 0 1 0-13.767H17.25V8.215a27.8 27.8 0 0 1 13.767-4.189v21.092h28.125C59.7 27.32 60 29.626 60 32",
};

export function Flag({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("block size-4 shrink-0", className)}>
      <path fill="currentColor" d={PATHS[lang]} />
    </svg>
  );
}

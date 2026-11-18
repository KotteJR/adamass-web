"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { CheckIcon, SlidersHorizontalIcon } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Flag } from "@/components/brand/Flag";
import { languages, type Lang } from "@/content/locale";
import type { UiContent } from "@/content/ui";
import { twin } from "./LanguageSwitch";
import { themeChoices } from "./themes";

type SettingsMenuProps = {
  current: Lang;
  /** The button's name. */
  label: string;
  language: UiContent["language"];
  theme: UiContent["theme"];
};

const ITEM =
  "flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm text-ink-2 outline-none select-none data-[highlighted]:bg-soft data-[highlighted]:text-ink data-[state=checked]:font-medium data-[state=checked]:text-ink";
const LABEL = "px-2.5 pt-1.5 pb-1.5 type-label text-mute";

/**
 * The header's settings: a quiet sliders button that opens a small menu with
 * the language (each option links to the same page in that language) and the
 * theme (Light, Dark, or Auto to follow the device).
 */
export function SettingsMenu({ current, label, language, theme: themeLabels }: SettingsMenuProps) {
  const pathname = usePathname() ?? "/";
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex size-9 items-center justify-center rounded-sm text-slate transition-colors hover:bg-soft hover:text-ink data-[state=open]:bg-soft data-[state=open]:text-ink"
        >
          <SlidersHorizontalIcon aria-hidden className="size-4" strokeWidth={1.75} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[208px] rounded-lg bg-canvas p-1.5 text-ink shadow-[0_24px_60px_-24px_rgba(10,24,44,0.4)] ring-1 ring-black/5 dark:bg-paper dark:ring-white/10 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <DropdownMenu.Label className={LABEL}>{language.label}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={current}>
            {languages.map((lang) => (
              <DropdownMenu.RadioItem key={lang} value={lang} asChild>
                <a
                  href={twin(pathname, lang)}
                  hrefLang={lang}
                  lang={lang}
                  className={ITEM}
                >
                  <Flag lang={lang} className="size-4" />
                  <span className="flex-1">{language[lang]}</span>
                  <DropdownMenu.ItemIndicator>
                    <CheckIcon aria-hidden className="size-4 text-lit" />
                  </DropdownMenu.ItemIndicator>
                </a>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator className="mx-1 my-1.5 h-px bg-line" />
          <DropdownMenu.Label className={LABEL}>{themeLabels.label}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
            {themeChoices.map(({ value, Icon }) => (
              <DropdownMenu.RadioItem key={value} value={value} className={ITEM}>
                <Icon aria-hidden className="size-4 text-slate" strokeWidth={1.75} />
                <span className="flex-1">{themeLabels[value]}</span>
                <DropdownMenu.ItemIndicator>
                  <CheckIcon aria-hidden className="size-4 text-lit" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

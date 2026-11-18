"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import type { UiContent } from "@/content/ui";
import { cn } from "@/lib/utils";
import { themeChoices } from "./themes";

const subscribeNever = () => () => {};

/** Light, Dark and Auto as three segments on a soft track, for the phone menu (the desktop has the settings menu). */
export function ThemeSwitch({ labels }: { labels: UiContent["theme"] }) {
  const { theme, setTheme } = useTheme();
  // The stored choice is only known in the browser; the server renders no segment as chosen.
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  return (
    <div role="radiogroup" aria-label={labels.label} className="inline-flex h-12 w-full items-center gap-0.5 rounded-sm bg-soft p-[3px]">
      {themeChoices.map(({ value, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-full flex-1 items-center justify-center gap-2 rounded-[5px] text-base font-medium transition-colors",
              active ? "bg-canvas text-ink shadow-[0_1px_2px_rgb(13_23_38/0.08)]" : "text-slate hover:text-ink",
            )}
          >
            <Icon aria-hidden className="size-4" strokeWidth={1.75} />
            {labels[value]}
          </button>
        );
      })}
    </div>
  );
}

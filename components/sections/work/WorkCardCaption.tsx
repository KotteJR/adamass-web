import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WorkCardCaptionProps = {
  /** The card's place in the grid, from 1. */
  kind: string;
  titleId: string;
  name: string;
  line: string;
  href: string;
  /** The link's words and icon. Its ::after covers the whole card, so the card is one link. */
  link: ReactNode;
  /** The first two cards run wider from 768 to 1279 px, so their type steps up there. */
  wide?: boolean;
  /** Phones show only the line and the link (the ask card's banner already says the rest). */
  lineOnlyOnPhone?: boolean;
};

/** Under a card in Selected work: its kind, the name, a short line and the card's link. */
export function WorkCardCaption({
  kind,
  titleId,
  name,
  line,
  href,
  link,
  wide = false,
  lineOnlyOnPhone = false,
}: WorkCardCaptionProps) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 px-0.5 pt-3 md:pt-4">
      <span
        className={cn(
          "font-mono text-[9.5px] tracking-[0.08em] text-mute uppercase md:text-[10.5px]",
          lineOnlyOnPhone && "max-md:hidden",
        )}
      >
        {kind}
      </span>
      <h3
        id={titleId}
        className={cn(
          "font-display text-[17px] leading-[1.12] font-medium text-balance transition-colors duration-300 group-hover:text-lit md:text-[22px]",
          wide && "md:max-xl:text-[26px]",
          lineOnlyOnPhone && "max-md:sr-only",
        )}
      >
        {name}
      </h3>
      <p className={cn("mt-0.5 text-[13px] leading-normal text-slate md:text-[14px]", wide && "md:max-xl:text-[15px]")}>
        {line}
      </p>
      <a
        href={href}
        className={cn(
          "mt-auto inline-flex min-h-11 items-center gap-1 self-start pt-1 text-[13px] font-medium text-ink transition-colors duration-250 hover:text-lit md:text-[14px]",
          wide && "md:max-xl:text-[15px]",
          "after:absolute after:inset-0 after:rounded-xl",
          "focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-lit",
        )}
      >
        {link}
      </a>
    </div>
  );
}

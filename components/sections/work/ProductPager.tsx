"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** The modal's square icon buttons: 36 px on desktop, 44 px on touch sizes. */
export const modalIconButton =
  "inline-flex size-11 items-center justify-center rounded-lg bg-soft text-ink transition-colors hover:bg-soft-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lit lg:size-9";

type ProductPagerProps = {
  index: number;
  count: number;
  previous: { label: string; onClick: () => void };
  next: { label: string; onClick: () => void };
  /** The "n / 4" between the arrows; dropped where the row is tight. */
  showCount?: boolean;
  className?: string;
};

/** ← n / 3 →: the previous and next product. */
export function ProductPager({ index, count, previous, next, showCount = true, className }: ProductPagerProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button type="button" aria-label={previous.label} onClick={previous.onClick} className={modalIconButton}>
        <ArrowLeftIcon className="size-4" aria-hidden />
      </button>
      {showCount ? (
        // Drops out when the pager is squeezed below its full 122 px (a long CTA beside it).
        <span className="w-[38px] text-center font-mono text-[11px] text-mute tabular-nums @max-[121px]:hidden">
          {index + 1} / {count}
        </span>
      ) : null}
      <button type="button" aria-label={next.label} onClick={next.onClick} className={modalIconButton}>
        <ArrowRightIcon className="size-4" aria-hidden />
      </button>
    </div>
  );
}

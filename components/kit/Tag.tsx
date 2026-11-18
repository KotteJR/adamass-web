import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex h-[22px] shrink-0 items-center rounded-xs px-2 type-meta whitespace-nowrap",
  {
    variants: {
      tone: {
        soft: "bg-soft text-slate",
        white: "bg-canvas text-slate",
        ink: "bg-ink text-canvas",
        lit: "bg-lit text-canvas",
        sky: "bg-[#e7ecf3] text-lit",
      },
    },
    defaultVariants: { tone: "soft" },
  },
);

type TagProps = ComponentProps<"span"> & VariantProps<typeof tagVariants>;

/** A small mono chip: categories, verdicts, "Marketplace". */
export function Tag({ tone, className, ...props }: TagProps) {
  return <span className={cn(tagVariants({ tone }), className)} {...props} />;
}

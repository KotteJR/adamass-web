import type { Headline } from "@/content/types";
import { cn } from "@/lib/utils";

const SIZES = {
  /** 28 px: a heading inside a section. */
  sub: "text-[clamp(1.5rem,1.2rem+1vw,1.75rem)] leading-[1.16] tracking-[-0.02em]",
  /** 40 px: most sections. */
  section: "text-4xl",
  /** 44 px: the Work section. */
  lead: "text-[clamp(2rem,1.3rem+2.4vw,2.75rem)] leading-[1.02] tracking-[-0.01em]",
  /** 52 px: the call to action. */
  cta: "text-5xl",
} as const;

type SectionHeadingProps = {
  headline: Headline;
  id?: string;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  className?: string;
};

/** Two-line headline: ink, then haze. No blue words. */
export function SectionHeading({ headline, id, as: Tag = "h2", size = "section", className }: SectionHeadingProps) {
  return (
    <Tag id={id} className={cn("font-display font-normal text-balance", SIZES[size], className)}>
      <span className="block">{headline.lead}</span>
      <span className="block text-haze">{headline.rest}</span>
    </Tag>
  );
}

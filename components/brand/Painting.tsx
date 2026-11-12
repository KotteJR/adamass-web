import Image from "next/image";
import { cn } from "@/lib/utils";
import paintDiag from "@/assets/paintings/paint-diag.webp";
import paintTall from "@/assets/paintings/paint-tall.webp";
import paintWide from "@/assets/paintings/paint-wide.webp";

const PAINTINGS = {
  wide: paintWide,
  tall: paintTall,
  diag: paintDiag,
} as const;

type PaintingProps = {
  name?: keyof typeof PAINTINGS;
  /** Only the hero painting, the likely LCP element, preloads. */
  preload?: boolean;
  sizes?: string;
  /** Drift speed: 26 s, or 30 s on the end screen. "none" keeps it still (the work cards). */
  drift?: "normal" | "slow" | "none";
  /** Which part of the painting shows, as CSS object-position. */
  position?: string;
  className?: string;
};

/**
 * A steel-blue motion-blurred painting that fills its positioned parent and
 * drifts very slowly (or stays still). The files are 2-3x their display size
 * (generators/round2/paintings-hires.py) and served at quality 90, so the
 * gradients stay clean on retina screens and in tall areas. Decorative: no alt text, hidden from assistive tech.
 */
export function Painting({
  name = "wide",
  preload = false,
  sizes = "100vw",
  drift = "normal",
  position,
  className,
}: PaintingProps) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-painting", className)}>
      <Image
        src={PAINTINGS[name]}
        alt=""
        fill
        sizes={sizes}
        preload={preload}
        placeholder="blur"
        quality={90}
        style={position ? { objectPosition: position } : undefined}
        className={cn(
          "object-cover",
          drift === "slow" && "motion-safe:animate-drift-slow",
          drift === "normal" && "motion-safe:animate-drift",
          drift !== "none" && "motion-reduce:scale-[1.06]",
        )}
      />
    </div>
  );
}

import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { cn } from "@/lib/utils";
import { EmbeddedDeliveryArt } from "./art/EmbeddedDeliveryArt";
import styles from "./figures.module.css";

/** Embedded delivery: a line of workstations; our station stamps each piece. Animates only near the viewport. */
export function EmbeddedDeliveryFigure({ className }: { className?: string }) {
  return (
    <PlayWhenVisible className={cn(styles.figure, styles.embedded, className)}>
      <EmbeddedDeliveryArt />
    </PlayWhenVisible>
  );
}

import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { cn } from "@/lib/utils";
import { ModernisationArt } from "./art/ModernisationArt";
import styles from "./figures.module.css";

/** Modernisation: pipe sections swapped one at a time while the flow keeps moving. Animates only near the viewport. */
export function ModernisationFigure({ className }: { className?: string }) {
  return (
    <PlayWhenVisible className={cn(styles.figure, styles.modernisation, className)}>
      <ModernisationArt />
    </PlayWhenVisible>
  );
}

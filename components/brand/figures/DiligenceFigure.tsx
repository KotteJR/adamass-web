import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { cn } from "@/lib/utils";
import { DiligenceArt } from "./art/DiligenceArt";
import styles from "./figures.module.css";

/** Diligence: a closed box turns see-through in a scanner and a report comes out. Animates only near the viewport. */
export function DiligenceFigure({ className, label }: { className?: string; label?: string }) {
  return (
    <PlayWhenVisible className={cn(styles.figure, styles.diligence, className)}>
      <DiligenceArt label={label} />
    </PlayWhenVisible>
  );
}

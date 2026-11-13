import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { cn } from "@/lib/utils";
import { GenAiArt } from "./art/GenAiArt";
import styles from "./figures.module.css";

/** GenAI: a model module is lowered into a socket and signals run out. Animates only near the viewport. */
export function GenAiFigure({ className, label }: { className?: string; label?: string }) {
  return (
    <PlayWhenVisible className={cn(styles.figure, styles.genai, className)}>
      <GenAiArt label={label} />
    </PlayWhenVisible>
  );
}

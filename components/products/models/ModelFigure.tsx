import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import type { ModelFigureKey } from "@/content/work";
import { cn } from "@/lib/utils";
import { ModelExtractArt } from "./art/ModelExtractArt";
import { ModelMorrowArt } from "./art/ModelMorrowArt";
import { ModelMurmurArt } from "./art/ModelMurmurArt";
import { ModelSlmArt } from "./art/ModelSlmArt";
import styles from "./models.module.css";

const FIGURES = {
  // The SLM's training: expert labels and synthetic data in, layers lit, a held-out gold set.
  slm: { Art: ModelSlmArt, motion: styles.slt },
  // Library-backed extraction: two retrieval paths into one bound extraction, then a reviewer.
  extract: { Art: ModelExtractArt, motion: styles.slm },
  murmur: { Art: ModelMurmurArt, motion: styles.mur },
  morrow: { Art: ModelMorrowArt, motion: styles.mor },
} as const;

/** "The model" tab's isometric figure and its motion. The harness around it names the steps. */
export function ModelFigure({ figureKey }: { figureKey: ModelFigureKey }) {
  const { Art, motion } = FIGURES[figureKey];
  return (
    <PlayWhenVisible className={cn(styles.mf, motion)}>
      <Art />
    </PlayWhenVisible>
  );
}

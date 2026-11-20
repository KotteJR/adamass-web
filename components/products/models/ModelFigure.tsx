import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import type { ModelFigureKey } from "@/content/work";
import { cn } from "@/lib/utils";
import { ModelMorrowArt } from "./art/ModelMorrowArt";
import { ModelMurmurArt } from "./art/ModelMurmurArt";
import { ModelPnbArt } from "./art/ModelPnbArt";
import { ModelSlmArt } from "./art/ModelSlmArt";
import styles from "./models.module.css";

const FIGURES = {
  // The SLM's training: expert labels and synthetic data in, layers lit, a held-out gold set.
  slm: { Art: ModelSlmArt, motion: styles.slt },
  murmur: { Art: ModelMurmurArt, motion: styles.mur },
  morrow: { Art: ModelMorrowArt, motion: styles.mor },
  // Adamass Studio: a picture in, our diffusion model paints it flat, each colour found and numbered.
  pnb: { Art: ModelPnbArt, motion: styles.pnb },
} as const;

/** "The model" tab's isometric figure and its motion. The harness around it names the steps. */
export function ModelFigure({ figureKey, label }: { figureKey: ModelFigureKey; label?: string }) {
  const { Art, motion } = FIGURES[figureKey];
  return (
    <PlayWhenVisible className={cn(styles.mf, motion)}>
      <Art label={label} />
    </PlayWhenVisible>
  );
}

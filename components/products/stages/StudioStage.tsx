"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import highPreview from "@/assets/studio/shell-high-preview.webp";
import highTemplate from "@/assets/studio/shell-high-template.webp";
import lowPreview from "@/assets/studio/shell-low-preview.webp";
import lowTemplate from "@/assets/studio/shell-low-template.webp";
import mediumPreview from "@/assets/studio/shell-medium-preview.webp";
import mediumTemplate from "@/assets/studio/shell-medium-template.webp";
import { studioStage, type StageVariant } from "@/content/product-stages";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import styles from "./studio-stage.module.css";

const PICTURES: { template: StaticImageData; preview: StaticImageData }[] = [
  { template: lowTemplate, preview: lowPreview },
  { template: mediumTemplate, preview: mediumPreview },
  { template: highTemplate, preview: highPreview },
];

/** One level per sweep of the wipe (studio-stage.module.css, .wipe). */
const LEVEL_MS = 7000;

function Wordmark() {
  return (
    <span className="inline-flex items-start">
      {/* eslint-disable-next-line @next/next/no-img-element -- Adamass Studio's handwritten wordmark, from its templates */}
      <img src="/studio/wordmark.svg" alt="" className="h-[25px] w-auto" />
      {/* eslint-disable-next-line @next/next/no-img-element -- the [a] it carries */}
      <img src="/studio/amark.svg" alt="" className="-mt-0.5 ml-1 h-[9px] w-auto" />
    </span>
  );
}

/**
 * Adamass Studio's stage, in its own dark look: one work's page, the detail
 * switching Low, Medium, High, and a wipe between the numbered template and
 * the painted preview, with the colour key and the clean-up's count for the
 * level shown. Every picture is the generator's real output for that level.
 * Modal: 600 x 780. Card (phone sheet): 780 x 450.
 */
export function StudioStage({ variant }: { variant: StageVariant }) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "0px" });
  const [level, setLevel] = useState(1);
  const card = variant !== "modal";
  const current = studioStage.levels[level];

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setLevel((l) => (l + 1) % studioStage.levels.length), LEVEL_MS);
    return () => window.clearInterval(timer);
  }, [inView]);

  const picture = (
    <div className={styles.picture}>
      {PICTURES.map((p, i) => (
        <div key={i} className={cn(styles.level, i === level && styles.shown)}>
          <Image src={p.template} alt="" fill sizes="(min-width: 768px) 540px, 100vw" className={styles.img} />
          <div className={cn(styles.paint, i === level && inView && styles.wipe)}>
            <Image src={p.preview} alt="" fill sizes="(min-width: 768px) 540px, 100vw" className={styles.img} />
          </div>
        </div>
      ))}
    </div>
  );

  const switcher = (
    <div className={styles.switch}>
      {studioStage.levels.map((l, i) => (
        <span key={l.name} className={cn(styles.option, i === level && styles.on)}>
          <b>{l.name}</b>
          <small>
            {l.colours} {studioStage.colours}
          </small>
        </span>
      ))}
    </div>
  );

  const key = (
    <div className="flex flex-col gap-2.5">
      <div className={styles.key}>
        {current.key.slice(0, card ? 8 : 12).map((hex, i) => (
          <span key={`${level}-${hex}`} className={styles.paintChip}>
            <i style={{ background: hex }} />
            {i + 1}
          </span>
        ))}
      </div>
      <span className={styles.fact}>{studioStage.areas(current.areas, current.patches)}</span>
    </div>
  );

  return (
    <div ref={ref} aria-hidden className={cn(styles.root, card && styles.card)}>
      <div className={styles.top}>
        <Wordmark />
        <span className={styles.nav}>
          {studioStage.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
      </div>
      {card ? (
        <div className={styles.row}>
          {picture}
          <div className="flex min-w-0 flex-col gap-4">
            <h3 className={styles.title}>{studioStage.title}</h3>
            {switcher}
            {key}
          </div>
        </div>
      ) : (
        <>
          <h3 className={styles.title}>{studioStage.title}</h3>
          {switcher}
          {picture}
          {key}
        </>
      )}
    </div>
  );
}

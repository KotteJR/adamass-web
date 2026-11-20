"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { Painting } from "@/components/brand/Painting";
import { morrowStage, type StageVariant } from "@/content/product-stages";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { MidnightCountdown } from "./MidnightCountdown";
import { MorrowFilm } from "./MorrowFilm";
import { MorrowMark } from "./MorrowMark";
import styles from "./morrow-stage.module.css";

const { games } = morrowStage;

/** A film runs about 4.5 s; if one stalls, the showcase still moves on. */
const FALLBACK_MS = 9000;

function Logo() {
  return (
    <span className="inline-flex items-center gap-[9px]">
      <MorrowMark className="size-[26px] flex-none" />
      <span className="text-[22px] font-semibold tracking-[-0.03em] text-white">{morrowStage.wordmark}</span>
    </span>
  );
}

function Countdown() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-white/66">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {morrowStage.newSet}{" "}
      <b className="font-semibold text-white tabular-nums">
        <MidnightCountdown />
      </b>
    </span>
  );
}

/**
 * Morrow's stage, in the look of its Today band: a night wash over an Adamass
 * painting, one game card playing the games' 3D films in turn (each once, ending
 * where it began), and today's games under it with the playing one ringed.
 * Modal: 600 x 780. Sheet (phones): 600 x 420, the card alone.
 */
export function MorrowStage({ variant }: { variant: StageVariant }) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "0px" });
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((i) => (i + 1) % games.length), []);
  const game = games[index];
  const sheet = variant === "sheet";

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(next, FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [inView, index, next]);

  const accent = { "--acc": game.accent, "--acc-tint": game.tint, "--acc-deep": game.deep } as CSSProperties;

  return (
    <div ref={ref} aria-hidden className={cn(styles.root, sheet && styles.sheet)}>
      <Painting name="tall" position="50% 65%" drift="none" sizes="600px" />
      <div className={styles.night} />
      <div className={styles.body}>
        <div className="flex items-center justify-between">
          <Logo />
          <Countdown />
        </div>

        <div className={styles.card} style={accent}>
          <span className={styles.art}>
            <MorrowFilm key={game.id} id={game.id} playing={inView} onEnd={next} className={styles.film} />
          </span>
          <span className={styles.words}>
            <span className={styles.head}>
              <span className={styles.name}>{game.name}</span>
              <span className={styles.chip}>{morrowStage.free}</span>
            </span>
            {sheet ? null : <span className={styles.line}>{game.line}</span>}
          </span>
        </div>

        {sheet ? null : (
          <div className="flex flex-col gap-2.5">
            <span className="text-[13px] text-white/60">{morrowStage.eleven}</span>
            <div className={styles.row}>
              {games.map((g, i) => (
                <span
                  key={g.id}
                  className={cn(styles.thumb, i === index && styles.on)}
                  style={{ "--acc": g.accent } as CSSProperties}
                >
                  <MorrowFilm id={g.id} playing={false} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

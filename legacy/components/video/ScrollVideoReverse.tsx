"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useVideoFrames } from "./VideoFramesProvider";
import ScrollRevealText from "./ScrollRevealText";
import {
  drawCover,
  getSectionOpacity,
  linearSegment,
  REVERSE_PIN_VH,
  segmentEase,
  segmentSlideFromV,
  TOTAL_FRAMES,
} from "./videoShared";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_SCRUB = 2.85;

const REVERSE_FADE = 0.042;
const REVERSE_FOG_END = 0.34;
const REVERSE_MORE_END = 0.68;

const moreItems = [
  {
    title: "How we engage",
    body: "Short, senior-led phases — discovery, build, handoff. You always know who owns the outcome.",
    stream: "Discovery, build, handoff — with one owner end to end.",
  },
  {
    title: "What we ship",
    body: "Working systems: APIs, pipelines, eval harnesses, and clear docs — not slide decks pretending to be software.",
    stream: "APIs, pipelines, eval harnesses — software, not slide theatre.",
  },
  {
    title: "Who we work with",
    body: "Product teams shipping AI features, platforms modernising ML, and investors who need technical truth, not hype.",
    stream: "Teams who ship, platforms who scale, investors who read the code path.",
  },
] as const;

export default function ScrollVideoReverse() {
  const { loadedReverse: loaded, imagesReverse: images } = useVideoFrames();
  const [scrollProgress, setScrollProgress] = useState(0);

  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const canvasCssRef = useRef({ w: 0, h: 0 });
  const rafScrollRef = useRef<number | null>(null);
  const rafDrawRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (images?.length) imagesRef.current = images;
  }, [images]);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w: cssW, h: cssH } = canvasCssRef.current;
    if (cssW <= 0 || cssH <= 0) return;

    const i = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    const img = imagesRef.current[i];
    if (!img?.complete || !img.naturalWidth) return;

    drawCover(ctx, img, cssW, cssH);
  }, []);

  const scheduleDraw = useCallback(
    (frameIndex: number) => {
      pendingFrameRef.current = frameIndex;
      if (rafDrawRef.current != null) return;
      rafDrawRef.current = requestAnimationFrame(() => {
        rafDrawRef.current = null;
        const f = pendingFrameRef.current;
        pendingFrameRef.current = null;
        if (f !== null) drawFrame(f);
      });
    },
    [drawFrame]
  );

  useEffect(() => {
    if (!loaded) return;

    const el = pinRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasCssRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const scrollDriver = { t: 0 };

    const onUpdate = (self: ScrollTrigger) => {
      const prog = self.progress;
      const fi = Math.round((1 - prog) * (TOTAL_FRAMES - 1));
      scheduleDraw(fi);

      if (rafScrollRef.current != null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        setScrollProgress(prog);
      });
    };

    resizeCanvas();

    tweenRef.current = gsap.to(scrollDriver, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: `+=${REVERSE_PIN_VH}vh`,
        pin: true,
        anticipatePin: 1,
        scrub: SCROLL_SCRUB,
        onUpdate,
      },
    });

    ScrollTrigger.refresh();
    scheduleDraw(TOTAL_FRAMES - 1);

    const onResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
      const st = tweenRef.current?.scrollTrigger;
      const prog = st?.progress ?? 0;
      scheduleDraw(Math.round((1 - prog) * (TOTAL_FRAMES - 1)));
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tweenRef.current?.kill();
      tweenRef.current = null;
      if (rafScrollRef.current != null) {
        cancelAnimationFrame(rafScrollRef.current);
        rafScrollRef.current = null;
      }
      if (rafDrawRef.current != null) {
        cancelAnimationFrame(rafDrawRef.current);
        rafDrawRef.current = null;
      }
    };
  }, [loaded, scheduleDraw]);

  const p = scrollProgress;

  const opFog = getSectionOpacity(0, REVERSE_FOG_END, p, REVERSE_FADE);
  const opMore = getSectionOpacity(
    REVERSE_FOG_END,
    REVERSE_MORE_END,
    p,
    REVERSE_FADE
  );
  const opCta = getSectionOpacity(REVERSE_MORE_END, 1, p, REVERSE_FADE);

  const reverseLabelOpacity =
    opFog > 0 ? Math.min(1, Math.max(0, (p - 0.02) / 0.07)) * opFog : 0;
  const reverseHeadOpacity =
    opFog > 0 ? Math.min(1, Math.max(0, (p - 0.08) / 0.1)) * opFog : 0;

  const moreSpan = REVERSE_MORE_END - REVERSE_FOG_END;
  const pInMore =
    moreSpan > 0
      ? Math.max(0, Math.min(1, (p - REVERSE_FOG_END) / moreSpan))
      : 0;

  const { index: moreI, localT: moreT } = segmentSlideFromV(pInMore, 3);
  const moreItem = moreItems[moreI];
  const moreBigReveal = linearSegment(moreT, 0.05, 0.62);
  const moreTitleReveal = linearSegment(moreT, 0.12, 0.48);
  const moreBodyReveal = linearSegment(moreT, 0.22, 0.84);
  const moreBarLabel = `Chapter ${String(moreI + 1).padStart(2, "0")}`;

  const moreHeadOpacity =
    opMore * Math.min(1, segmentEase(pInMore, 0, 0.1) * 1.2);

  const showBar = loaded && p > 0.002 && p < 0.998;
  const year = new Date().getFullYear();

  return (
    <>
      <div
        ref={pinRef}
        className="relative h-screen w-screen max-w-[100vw] overflow-hidden bg-neutral-100"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 block h-full w-full bg-neutral-200"
          aria-hidden
        />

        {/* Fog — lower half of viewport as solid white (video stays visible above) */}
        <section
          className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-end"
          style={{ opacity: opFog }}
          aria-hidden={opFog < 0.05}
        >
          <div className="min-h-0 flex-1" aria-hidden />
          <div className="bottom-info-dock flex min-h-[min(50dvh,50%)] w-full flex-col justify-center bg-[var(--white)] px-6 py-10 text-[var(--ink)] shadow-[0_-32px_80px_rgba(0,0,0,0.12)] md:px-14 md:py-14">
            <h2
              className="font-sans mt-6 text-[clamp(1.85rem,4.8vw,2.85rem)] font-medium leading-tight tracking-[-0.035em] text-[var(--black)]"
              style={{ opacity: reverseHeadOpacity }}
            >
              We turn complexity into clarity.
            </h2>
            <h2
              className="font-sans mt-1 text-[clamp(1.85rem,4.8vw,2.85rem)] font-medium leading-tight tracking-[-0.035em] text-[var(--electric)]"
              style={{ opacity: reverseHeadOpacity }}
            >
              Then we do it again.
            </h2>
            <p
              className="font-sans mt-6 max-w-[460px] text-[15px] font-normal leading-[1.85] text-[var(--gray-dark)]"
              style={{ opacity: reverseHeadOpacity }}
            >
              Every engagement begins in the fog. We find the signal, build the
              system, ship it. Then we&apos;re ready for the next one.
            </p>
          </div>
        </section>

        {/* More — video + scrim on top, bottom white dock (same pattern as forward) */}
        <section
          className="pointer-events-none absolute inset-0 z-[11] flex flex-col justify-end"
          style={{ opacity: opMore }}
          aria-hidden={opMore < 0.05}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15"
            style={{ opacity: opMore * 0.92 }}
            aria-hidden
          />
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col justify-end px-5 pb-5 md:px-12 md:pb-7">
            <div className="mx-auto w-full max-w-[min(100%,920px)] text-center md:text-left">
              <p
                className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric-soft)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                style={{ opacity: moreHeadOpacity }}
              >
                More about Adamass
              </p>
              <h2
                className="font-sans mt-3 text-[clamp(1.35rem,3.4vw,2rem)] font-medium tracking-[-0.03em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style={{ opacity: moreHeadOpacity }}
              >
                Same team. Deeper context.
              </h2>
              <p className="font-sans mt-5 text-[clamp(1.05rem,2.8vw,1.55rem)] font-medium leading-snug tracking-[-0.025em] text-white/95 drop-shadow-[0_3px_20px_rgba(0,0,0,0.55)]">
                <ScrollRevealText
                  text={moreItem.stream}
                  progress={moreBigReveal}
                />
              </p>
            </div>
          </div>

          <div
            className="relative z-[2] w-full bg-[var(--white)] text-[var(--ink)] shadow-[0_-24px_80px_rgba(0,0,0,0.14)] bottom-info-dock"
            style={{
              transform: `translateY(${(1 - segmentEase(moreT, 0, 0.12)) * 16}px)`,
            }}
          >
            <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start md:gap-14 md:px-12 md:py-10">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--gray-mid)]">
                  {moreBarLabel}
                </p>
                <h3 className="font-sans mt-3 text-[clamp(1.2rem,2.4vw,1.65rem)] font-semibold leading-snug tracking-[-0.03em] text-[var(--black)]">
                  <ScrollRevealText
                    text={moreItem.title}
                    progress={moreTitleReveal}
                  />
                </h3>
              </div>
              <p className="max-w-md font-sans text-[14px] leading-[1.75] text-[var(--gray-dark)] md:text-[15px] md:justify-self-end">
                <ScrollRevealText
                  text={moreItem.body}
                  progress={moreBodyReveal}
                />
              </p>
            </div>
          </div>
        </section>

        {/* Full-viewport white — contact (replaces footer; covers video completely) */}
        <section
          className="absolute inset-0 z-[15] flex min-h-screen flex-col items-center justify-center bg-[var(--white)] px-6 text-center"
          style={{
            opacity: opCta,
            pointerEvents: opCta > 0.06 ? "auto" : "none",
          }}
          aria-hidden={opCta < 0.06}
        >
          <p className="text-label text-[var(--electric)]">Contact</p>
          <a
            href="mailto:hello@adamass.se"
            className="focus-ring font-sans mt-10 block max-w-[min(100%,18ch)] break-all text-[clamp(1.75rem,6.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--black)] no-underline transition-opacity hover:opacity-75"
          >
            hello@adamass.se
          </a>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-[var(--gray-dark)]">
            We take a small number of engagements at a time. One thread, senior
            ownership, shipped outcomes.
          </p>
          <a
            href="#work"
            className="focus-ring mt-12 text-sm font-semibold text-[var(--electric)] no-underline underline-offset-4 hover:underline"
          >
            View proof in the static section ↓
          </a>
          <p className="pointer-events-none absolute bottom-8 left-1/2 max-w-[90vw] -translate-x-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--gray-mid)]">
            © {year} Adamass · Stockholm · Skopje
          </p>
        </section>
      </div>

      {showBar && (
        <div
          className="pointer-events-none fixed right-0 top-0 z-[60] h-screen w-[2px] bg-neutral-200/90"
          aria-hidden
        >
          <div
            className="absolute left-0 top-0 w-full bg-[var(--electric)]"
            style={{ height: `${p * 100}%` }}
          />
        </div>
      )}
    </>
  );
}

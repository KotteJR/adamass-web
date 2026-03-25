"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useVideoFrames } from "./VideoFramesProvider";
import ScrollRevealText from "./ScrollRevealText";
import {
  drawCover,
  FORWARD_OVERLAY_SCALE,
  FORWARD_PIN_VH,
  getSectionOpacity,
  INTRO_SCROLL_VH,
  linearSegment,
  segmentEase,
  segmentSlideFromV,
  TOTAL_FRAMES,
} from "./videoShared";

gsap.registerPlugin(ScrollTrigger);

const INTRO_END_PROGRESS = INTRO_SCROLL_VH / FORWARD_PIN_VH;
const SCROLL_SCRUB = 2.85;

const FWD_FADE = 0.03;
const FWD_WHO_END = 0.16;
const FWD_WHAT_END = 0.43;
const FWD_WORK_END = 0.625;
const FWD_BRIDGE_END = FORWARD_OVERLAY_SCALE;

function normSegment(v: number, start: number, end: number): number {
  const d = end - start;
  if (d <= 0) return 0;
  return Math.max(0, Math.min(1, (v - start) / d));
}

type Props = {
  onScrollProgress?: (progress: number) => void;
};

const capabilities3 = [
  {
    tag: "01",
    title: "LLM systems",
    desc: "Agents, RAG, eval harnesses, APIs your team actually ships.",
    stream: "Agents, RAG, eval harnesses — shipped, not slid.",
  },
  {
    tag: "02",
    title: "Due diligence",
    desc: "Technical depth for investors — architecture, risk, moat, reality.",
    stream: "Architecture and moat — for investors who read the footnotes.",
  },
  {
    tag: "03",
    title: "ML platform",
    desc: "Training, MLOps, and deployment without the theatre.",
    stream: "Training to production — without the MLOps theatre.",
  },
] as const;

const workItems = [
  {
    client: "CogniVeil",
    type: "AI Platform",
    desc: "Pre-sales requirements flow. Next.js, Claude API.",
    stream:
      "From intake to shipped UI — requirements that behave like product.",
  },
  {
    client: "EyeRadar",
    type: "EdTech · Dyslexia",
    desc: "Webcam eye-tracking reading assessment. Python, GazeFollower.",
    stream: "Signal from gaze — reading assessment without the theatre.",
  },
  {
    client: "Undisclosed",
    type: "Due diligence",
    desc: "Series B AI technical assessment for an enterprise investor.",
    stream: "Architecture, risk, and moat — for the term sheet, not the deck.",
  },
] as const;

export default function ScrollVideoForward({ onScrollProgress }: Props) {
  const { loaded, images } = useVideoFrames();
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
      const fi = Math.round(prog * (TOTAL_FRAMES - 1));
      scheduleDraw(fi);

      if (rafScrollRef.current != null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        setScrollProgress(prog);
        onScrollProgress?.(prog);
      });
    };

    resizeCanvas();

    tweenRef.current = gsap.to(scrollDriver, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: `+=${FORWARD_PIN_VH}vh`,
        pin: true,
        anticipatePin: 1,
        scrub: SCROLL_SCRUB,
        onUpdate,
      },
    });

    ScrollTrigger.refresh();
    scheduleDraw(0);
    setScrollProgress(0);
    onScrollProgress?.(0);

    const onResize = () => {
      resizeCanvas();
      ScrollTrigger.refresh();
      const st = tweenRef.current?.scrollTrigger;
      const prog = st?.progress ?? 0;
      scheduleDraw(Math.round(prog * (TOTAL_FRAMES - 1)));
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
  }, [loaded, scheduleDraw, onScrollProgress]);

  const p = scrollProgress;
  const v = p * FORWARD_OVERLAY_SCALE;

  const opWho = getSectionOpacity(0, FWD_WHO_END, v, FWD_FADE);
  const opWhat = getSectionOpacity(FWD_WHO_END, FWD_WHAT_END, v, FWD_FADE);
  const opWork = getSectionOpacity(FWD_WHAT_END, FWD_WORK_END, v, FWD_FADE);
  const opBridge = getSectionOpacity(FWD_WORK_END, FWD_BRIDGE_END, v, FWD_FADE);

  const vInWho = normSegment(v, 0, FWD_WHO_END);
  const vInWhat = normSegment(v, FWD_WHO_END, FWD_WHAT_END);
  const vInWork = normSegment(v, FWD_WHAT_END, FWD_WORK_END);

  const whoBodyOpacity =
    opWho > 0
      ? Math.min(1, Math.max(0, (vInWho - 0.12) / 0.42)) * opWho
      : 0;

  const { index: capI, localT: capT } = segmentSlideFromV(vInWhat, 3);
  const capItem = capabilities3[capI];
  const capBigReveal = linearSegment(capT, 0.05, 0.64);
  const capTitleReveal = linearSegment(capT, 0.12, 0.5);
  const capBodyReveal = linearSegment(capT, 0.24, 0.86);
  const capBarLabel = `Capability ${capItem.tag}`;

  const { index: workI, localT: workT } = segmentSlideFromV(vInWork, 3);
  const workItem = workItems[workI];
  const bigReveal = linearSegment(workT, 0.05, 0.64);
  const titleReveal = linearSegment(workT, 0.12, 0.5);
  const bodyReveal = linearSegment(workT, 0.24, 0.86);
  const workBarLabel = `Engagement ${String(workI + 1).padStart(2, "0")}`;

  const showBar = loaded && p > 0.002 && p < 0.998;

  return (
    <>
      <div
        ref={pinRef}
        className="relative h-screen w-screen max-w-[100vw] overflow-hidden bg-neutral-100"
      >
        {!loaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-100">
            <p className="font-sans text-sm font-medium tracking-wide text-[var(--ink)]">
              Loading...
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full bg-neutral-200"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[min(78vh,720px)] bg-gradient-to-t from-black via-black/65 to-transparent"
          style={{
            opacity: Math.min(
              1,
              opWho * 1.05 +
                opBridge * 0.45 +
                opWork * 0.62 +
                opWhat * 0.58
            ),
          }}
          aria-hidden
        />

        {p < INTRO_END_PROGRESS && loaded && (
          <>
            <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-[var(--gray-mid)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
              Scroll
            </div>
            <div className="pointer-events-none absolute bottom-10 right-6 z-20 hidden font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-white/75 drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)] md:right-10 md:block">
              Scroll to explore
            </div>
          </>
        )}

        <section
          className="pointer-events-none absolute inset-0 z-[10] flex flex-col justify-end px-6 pb-[min(11vh,5.5rem)] md:px-[9vw] md:pb-[min(14vh,7rem)]"
          style={{ opacity: opWho }}
          aria-hidden={opWho < 0.05}
        >
          <div className="max-w-[min(100%,36rem)] md:max-w-xl">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.38em] text-[var(--gray-light)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Stockholm · Skopje · 2019—
            </p>
            <h2 className="font-display mt-5 text-[clamp(2.1rem,6.8vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              AI &amp; ML, embedded.
            </h2>
            <p className="font-display mt-3 text-[clamp(1.15rem,2.8vw,1.65rem)] font-normal leading-snug tracking-[-0.02em] text-[var(--electric)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
              Senior. Hands-on. Accountable.
            </p>
            <p
              className="font-sans mt-6 max-w-md text-[15px] font-normal leading-[1.75] text-[var(--gray-light)] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
              style={{ opacity: whoBodyOpacity }}
            >
              Small team, no layers — we join yours, ship systems, and hand
              them off clean.
            </p>
          </div>
        </section>

        {/* Capabilities — stream + bottom white dock only */}
        <section
          id="capabilities"
          className="pointer-events-none absolute inset-0 z-[11] flex flex-col justify-end"
          style={{ opacity: opWhat }}
          aria-hidden={opWhat < 0.05}
        >
          <div className="flex min-h-0 flex-1 flex-col justify-end px-5 pb-5 md:px-12 md:pb-8">
            <div className="mx-auto w-full max-w-[min(100%,920px)] text-center md:text-left">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric-soft)] drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
                Capabilities
              </p>
              <h2 className="font-sans mt-3 text-[clamp(1.5rem,4vw,2.35rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.88)]">
                We build the hard parts.
              </h2>
              <p className="font-sans mt-5 text-[clamp(1.1rem,3.2vw,1.85rem)] font-medium leading-snug tracking-[-0.03em] text-white/95 drop-shadow-[0_3px_22px_rgba(0,0,0,0.85)]">
                <ScrollRevealText
                  text={capItem.stream}
                  progress={capBigReveal}
                />
              </p>
            </div>
          </div>

          <div
            className="bottom-info-dock relative w-full bg-[var(--white)] text-[var(--ink)] shadow-[0_-24px_80px_rgba(0,0,0,0.12)]"
            style={{
              transform: `translateY(${(1 - segmentEase(capT, 0, 0.14)) * 18}px)`,
            }}
          >
            <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start md:gap-14 md:px-12 md:py-10">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--gray-mid)]">
                  {capBarLabel}
                </p>
                <h3 className="font-sans mt-3 text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold leading-snug tracking-[-0.03em] text-[var(--black)]">
                  <ScrollRevealText
                    text={capItem.title}
                    progress={capTitleReveal}
                  />
                </h3>
              </div>
              <p className="max-w-md font-sans text-[14px] leading-[1.75] text-[var(--gray-dark)] md:text-[15px] md:justify-self-end">
                <ScrollRevealText
                  text={capItem.desc}
                  progress={capBodyReveal}
                />
              </p>
            </div>
          </div>
        </section>

        <section
          className="pointer-events-none absolute inset-0 z-[12] flex flex-col justify-end"
          style={{ opacity: opWork }}
          aria-hidden={opWork < 0.05}
        >
          <div className="flex min-h-0 flex-1 flex-col justify-end px-5 pb-5 md:px-12 md:pb-8">
            <div className="mx-auto w-full max-w-[min(100%,920px)] text-center md:text-left">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric-soft)] drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
                Selected work
              </p>
              <h2 className="font-sans mt-4 text-[clamp(1.35rem,4.2vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.88)]">
                <ScrollRevealText
                  text={workItem.stream}
                  progress={bigReveal}
                />
              </h2>
              <p className="font-mono mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                {workItem.client}
              </p>
            </div>
          </div>

          <div
            className="bottom-info-dock relative w-full bg-[var(--white)] text-[var(--ink)] shadow-[0_-24px_80px_rgba(0,0,0,0.12)]"
            style={{
              transform: `translateY(${(1 - segmentEase(workT, 0, 0.14)) * 18}px)`,
            }}
          >
            <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start md:gap-14 md:px-12 md:py-10">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--gray-mid)]">
                  {workBarLabel}
                </p>
                <h3 className="font-sans mt-3 text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold leading-snug tracking-[-0.03em] text-[var(--black)]">
                  <ScrollRevealText
                    text={workItem.type}
                    progress={titleReveal}
                  />
                </h3>
              </div>
              <p className="max-w-md font-sans text-[14px] leading-[1.75] text-[var(--gray-dark)] md:text-[15px] md:justify-self-end">
                <ScrollRevealText
                  text={workItem.desc}
                  progress={bodyReveal}
                />
              </p>
            </div>
          </div>
        </section>

        <section
          className="pointer-events-none absolute inset-0 z-[13] flex items-center justify-center px-8"
          style={{ opacity: opBridge }}
          aria-hidden={opBridge < 0.05}
        >
          <div className="max-w-[820px] text-center">
            <p className="font-display text-[clamp(1.85rem,5.2vw,3.1rem)] font-normal italic leading-[1.12] tracking-[-0.025em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
              We don&apos;t consult.
            </p>
            <p className="font-display mt-2 text-[clamp(1.85rem,5.2vw,3.1rem)] font-normal leading-[1.12] tracking-[-0.03em] text-[var(--electric)] drop-shadow-[0_2px_20px_rgba(0,0,0,0.75)]">
              We deliver.
            </p>
            <p className="font-sans mx-auto mt-8 max-w-md text-[14px] font-normal leading-relaxed text-[var(--gray-light)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Working software, clear ownership, zero theatre.
            </p>
          </div>
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

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoCanvas, { type VideoCanvasHandle } from "./VideoCanvas";
import BottomDock from "./BottomDock";
import ScrollRevealText from "./ScrollRevealText";
import { useFrames } from "./useFrames";

gsap.registerPlugin(ScrollTrigger);

const PIN_PX = 2400;
const SCRUB = 1.5;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function fadeIn(p: number, start: number, dur: number) {
  return clamp01((p - start) / dur);
}

function fadeOut(p: number, start: number, dur: number) {
  return 1 - clamp01((p - start) / dur);
}

const CAPS = [
  {
    tag: "Capability 01",
    title: "Generative AI & LLMs",
    desc: "Agents, retrieval-augmented pipelines, fine-tuning, and production prompt systems. We integrate with your stack, define acceptance criteria, and document interfaces for your team to operate.",
    hero: "Generative AI and LLMs — designed for production, not demos.",
  },
  {
    tag: "Capability 02",
    title: "ML engineering",
    desc: "Model development, training and batch pipelines, deployment, and monitoring. Clear ownership, versioned artefacts, and handover materials aligned with how your organisation releases software.",
    hero: "Machine learning engineering — from training to monitored inference.",
  },
  {
    tag: "Capability 03",
    title: "Legacy modernisation",
    desc: "Assessment and phased replacement of outdated data and application stacks. We prioritise risk, cost, and interoperability so new capabilities can be adopted without a big-bang rewrite.",
    hero: "Modern, maintainable architecture — so AI initiatives can land safely.",
  },
] as const;

const WORK = [
  {
    tag: "Capability 04",
    title: "Technical due diligence",
    desc: "We take a structured look at software assets when you need to decide with confidence: acquisitions, investment, or internal strategy. We examine architecture, operations, data & security, team capability, and delivery risk. Our written reports are the judgements we would act on ourselves.",
    hero: "What the system really is, and what that means for your decision.",
  },
] as const;

export default function ForwardScroll() {
  const { loaded, images, total } = useFrames("frames");
  const canvasHandle = useRef<VideoCanvasHandle>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!loaded) return;
    const el = pinRef.current;
    if (!el) return;

    const driver = { t: 0 };
    const overlapPx = window.innerHeight;
    const totalPx = PIN_PX + overlapPx;

    const tween = gsap.to(driver, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${PIN_PX + window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
        scrub: SCRUB,
        onUpdate(self) {
          const raw = self.progress;
          const prog = Math.min(raw * (totalPx / PIN_PX), 1);
          const fi = Math.round(prog * (total - 1));
          canvasHandle.current?.drawFrame(fi);
          setP(prog);
        },
      },
    });

    ScrollTrigger.refresh();
    canvasHandle.current?.drawFrame(0);

    return () => {
      tween.kill();
    };
  }, [loaded, total]);

  // --- Hero (slow word-by-word, 0.03→0.28 = 25% of timeline = 600vh) ---
  const heroIn = fadeIn(p, 0.03, 0.03);
  const heroOut = fadeOut(p, 0.30, 0.04);
  const heroOp = heroIn * heroOut;
  const heroReveal = clamp01((p - 0.04) / 0.24);

  // --- Capabilities (3 items) ---
  const capLabelIn = fadeIn(p, 0.34, 0.03);
  const capOut = fadeOut(p, 0.72, 0.04);
  const capOp = capLabelIn * capOut;

  const capIdx = p < 0.50 ? 0 : p < 0.62 ? 1 : 2;
  const capStarts = [0.37, 0.50, 0.62];
  const capEnds = [0.50, 0.62, 0.72];
  const capLocal = clamp01(
    (p - capStarts[capIdx]) / (capEnds[capIdx] - capStarts[capIdx])
  );
  const cap = CAPS[capIdx];
  const capHeroReveal = clamp01(capLocal / 0.55);
  const capDockUp = fadeIn(p, capStarts[capIdx], 0.04);
  const capDockDown = fadeOut(p, capEnds[capIdx] - 0.04, 0.04);

  // --- Work (1 item — fades out before static section) ---
  const workLabelIn = fadeIn(p, 0.76, 0.03);
  const workOut = fadeOut(p, 0.92, 0.06);
  const workOp = workLabelIn * workOut;

  const workLocal = clamp01((p - 0.79) / 0.13);
  const work = WORK[0];
  const workHeroReveal = clamp01(workLocal / 0.45);
  const workDockUp = fadeIn(p, 0.79, 0.04);
  const workDockDown = fadeOut(p, 0.90, 0.05);

  // --- Scrim ---
  const scrimOp = Math.min(1, heroOp * 0.65 + capOp * 0.5 + workOp * 0.6);

  return (
    <div
      ref={pinRef}
      className="relative h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-neutral-950"
      style={{ zIndex: 1 }}
    >
      {!loaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950">
          <p className="font-sans text-sm font-medium text-white/60">
            Loading...
          </p>
        </div>
      )}

      <VideoCanvas
        ref={canvasHandle}
        images={images}
        total={total}
        className="z-0"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[70vh] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        style={{ opacity: scrimOp }}
        aria-hidden
      />

      {p < 0.04 && loaded && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
          <div className="rounded-full border border-white/[0.12] bg-[rgba(8,8,10,0.52)] px-4 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl backdrop-saturate-150 sm:px-5 sm:py-2.5">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-white/70 md:text-[11px]">
              Scroll down
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        className="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-center px-6 md:justify-center md:px-[6vw]"
        style={{ opacity: heroOp }}
        aria-hidden={heroOp < 0.01}
      >
        <h1 className="font-sans text-[clamp(2.6rem,9.5vw,7.5rem)] font-medium leading-[1.0] tracking-[-0.045em] text-white">
          <ScrollRevealText
            text="Boutique IT consultancy - Senior delivery, fixed accountability."
            progress={heroReveal}
          />
        </h1>
      </section>

      {/* Capabilities */}
      <section
        className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-end"
        style={{ opacity: capOp }}
        aria-hidden={capOp < 0.01}
      >
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-start justify-end px-6 pb-[min(46vh,15rem)] pt-4 md:px-[8vw] md:pb-52 md:pt-0">
          <h2 className="max-w-[min(100%,52rem)] font-sans text-[clamp(1.6rem,5.5vw,3.8rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
            <ScrollRevealText text={cap.hero} progress={capHeroReveal} />
          </h2>
        </div>

        <BottomDock
          label={cap.tag}
          title={cap.title}
          body={cap.desc}
          contentReveal={capLocal}
          slideUp={capDockUp * capDockDown}
        />
      </section>

      {/* Work */}
      <section
        className="pointer-events-none absolute inset-0 z-[4] flex flex-col justify-end"
        style={{ opacity: workOp }}
        aria-hidden={workOp < 0.01}
      >
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-start justify-end px-6 pb-[min(46vh,15rem)] pt-4 md:px-[8vw] md:pb-52 md:pt-0">
          <h2 className="max-w-[min(100%,52rem)] font-sans text-[clamp(1.6rem,5.5vw,3.8rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
            <ScrollRevealText text={work.hero} progress={workHeroReveal} />
          </h2>
        </div>

        <BottomDock
          label={work.tag}
          title={work.title}
          body={work.desc}
          contentReveal={workLocal}
          slideUp={workDockUp * workDockDown}
        />
      </section>
    </div>
  );
}

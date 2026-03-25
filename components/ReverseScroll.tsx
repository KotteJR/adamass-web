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

const CHAPTERS = [
  {
    tag: "Chapter 01",
    title: "Discovery and scope",
    body: "We align on objectives, constraints, and success criteria before engineering work begins. Written assumptions, agreed milestones, and a single accountable lead.",
    hero: "Fixed scope, named owner, documented assumptions.",
  },
  {
    tag: "Chapter 02",
    title: "Build and integration",
    body: "Implementation follows the agreed design: APIs, pipelines, models, and observability where required. Regular checkpoints; changes are tracked and signed off.",
    hero: "Delivery against specification — with traceable change control.",
  },
  {
    tag: "Chapter 03",
    title: "Handover",
    body: "Code, configuration, runbooks, and knowledge transfer to your team. We close the engagement when ownership is demonstrably yours.",
    hero: "Handover you can audit — not a slide deck handoff.",
  },
] as const;

export default function ReverseScroll() {
  const { loaded, images, total } = useFrames("framesv2");
  const canvasHandle = useRef<VideoCanvasHandle>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!loaded) return;
    const el = pinRef.current;
    if (!el) return;

    const driver = { t: 0 };

    const tween = gsap.to(driver, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${PIN_PX}`,
        pin: true,
        anticipatePin: 1,
        scrub: SCRUB,
        onUpdate(self) {
          const prog = self.progress;
          const fi = Math.round((1 - prog) * (total - 1));
          canvasHandle.current?.drawFrame(fi);
          setP(prog);
        },
      },
    });

    ScrollTrigger.refresh();
    canvasHandle.current?.drawFrame(total - 1);

    return () => {
      tween.kill();
    };
  }, [loaded, total]);

  /*
   * Timeline (p = 0…1 over PIN_PX scroll distance):
   *
   * 0.00–0.05  just video
   * 0.05–0.28  half-white slab with text
   * 0.28–0.32  slab fades out
   *
   * 0.32–0.36  chapter label fades in
   * 0.36–0.52  chapter 1 (hero writes, dock slides)
   * 0.52–0.66  chapter 2
   * 0.66–0.78  chapter 3
   * 0.78–0.82  chapters fade out
   *
   * 0.82–0.88  full white contact fades in
   * 0.88–1.00  contact stays
   */

  const fogIn = fadeIn(p, 0.05, 0.04);
  const fogOut = fadeOut(p, 0.28, 0.04);
  const fogOp = fogIn * fogOut;
  const fogTextIn = fadeIn(p, 0.09, 0.06);

  const chapLabelIn = fadeIn(p, 0.32, 0.04);
  const chapOut = fadeOut(p, 0.78, 0.04);
  const chapOp = chapLabelIn * chapOut;

  const chapIdx = p < 0.52 ? 0 : p < 0.66 ? 1 : 2;
  const chapStarts = [0.36, 0.52, 0.66];
  const chapEnds = [0.52, 0.66, 0.78];
  const chapLocal = clamp01(
    (p - chapStarts[chapIdx]) / (chapEnds[chapIdx] - chapStarts[chapIdx])
  );
  const chap = CHAPTERS[chapIdx];
  const chapHeroReveal = clamp01(chapLocal / 0.6);
  const chapDockUp = fadeIn(p, chapStarts[chapIdx], 0.05);

  const chapScrim = chapOp * 0.7;

  const contactIn = fadeIn(p, 0.82, 0.06);

  const year = new Date().getFullYear();

  return (
    <div
      ref={pinRef}
      className="relative h-[100dvh] min-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-neutral-950"
    >
      <VideoCanvas
        ref={canvasHandle}
        images={images}
        total={total}
        className="z-0"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/35 to-black/15"
        style={{ opacity: chapScrim }}
        aria-hidden
      />

      {/* Fog — right-side white panel (half screen on md+, bottom on mobile) */}
      <section
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ opacity: fogOp }}
        aria-hidden={fogOp < 0.01}
      >
        {/* Mobile: bottom panel */}
        <div
          className="side-panel absolute inset-x-0 bottom-0 flex min-h-[55dvh] w-full flex-col justify-center bg-white px-6 py-10 text-[var(--ink)] shadow-[0_-32px_80px_rgba(0,0,0,0.12)] md:inset-y-0 md:left-auto md:right-0 md:min-h-0 md:w-[50vw] md:rounded-none md:rounded-l-[24px] md:px-10 md:py-16 md:shadow-[-32px_0_80px_rgba(0,0,0,0.12)] lg:px-14"
          style={{
            transform: `translateX(${(1 - Math.min(1, fadeIn(p, 0.05, 0.06))) * 100}%)`,
          }}
        >
          <p
            className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]"
            style={{ opacity: fogTextIn }}
          >
            The fog returns
          </p>
          <h2
            className="mt-6 font-sans text-[clamp(1.85rem,4.2vw,2.65rem)] font-medium leading-tight tracking-[-0.035em] text-[var(--black)]"
            style={{ opacity: fogTextIn }}
          >
            Most briefs arrive incomplete.
          </h2>
          <h2
            className="mt-1 font-sans text-[clamp(1.85rem,4.2vw,2.65rem)] font-medium leading-tight tracking-[-0.035em] text-[var(--electric)]"
            style={{ opacity: fogTextIn }}
          >
            We love to structure the work.
          </h2>
          <p
            className="mt-6 max-w-none font-sans text-[15px] leading-[1.85] text-[var(--gray-dark)] md:pr-2"
            style={{ opacity: fogTextIn }}
          >
            Unclear requirements, legacy systems, and conflicting stakeholders
            are standard inputs. We narrow the problem, define deliverables, and
            execute against them — then document what we built and how to run
            it.
          </p>
        </div>
      </section>

      {/* Chapters — huge hero text writes, dock slides + fades */}
      <section
        className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-end"
        style={{ opacity: chapOp }}
        aria-hidden={chapOp < 0.01}
      >
        <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-start justify-end px-6 pb-[min(46vh,15rem)] pt-4 md:px-[8vw] md:pb-52 md:pt-0">
          <h2 className="max-w-[min(100%,52rem)] font-sans text-[clamp(1.5rem,5vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
            <ScrollRevealText text={chap.hero} progress={chapHeroReveal} />
          </h2>
        </div>

        <BottomDock
          label={chap.tag}
          title={chap.title}
          body={chap.body}
          contentReveal={chapLocal}
          slideUp={chapDockUp}
        />
      </section>

      {/* Full-white contact */}
      <section
        className="absolute inset-0 z-[10] flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center"
        style={{
          opacity: contactIn,
          pointerEvents: contactIn > 0.05 ? "auto" : "none",
        }}
        aria-hidden={contactIn < 0.05}
      >
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]">
          Contact
        </p>
        <a
          href="mailto:hello@adamass.se"
          className="mt-10 block max-w-[min(100%,18ch)] break-all font-sans text-[clamp(1.75rem,6.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--black)] no-underline transition-opacity hover:opacity-75"
        >
          hello@adamass.se
        </a>
        <p className="mt-8 max-w-md font-sans text-[15px] leading-relaxed text-[var(--gray-dark)]">
          For embedded work or technical due diligence: email a short brief.
          We reply with availability; an intro call confirms fit, scope, and
          timeline.
        </p>
        <p className="pointer-events-none absolute bottom-8 left-1/2 max-w-[90vw] -translate-x-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--gray-mid)]">
          © {year} Adamass AB · Malmö, Sweden
        </p>
      </section>
    </div>
  );
}

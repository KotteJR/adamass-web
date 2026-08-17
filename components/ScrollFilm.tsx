"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FilmChapterDeck, { type FilmChapterDeckHandle } from "./FilmChapterDeck";
import FilmIntroKicker from "./FilmIntroKicker";
import FilmIntroLabels from "./FilmIntroLabels";
import type { FilmFactIconName } from "./FilmFactIcon";

gsap.registerPlugin(ScrollTrigger);

export type FilmFact = {
  icon: FilmFactIconName;
  value: string;
  detail: string;
};

export type FilmChapter = {
  label: string;
  title: string;
  heading: string;
  body: string;
  facts: readonly FilmFact[];
};

type ScrollFilmProps = {
  id: string;
  desktopClip: string;
  mobileClip: string;
  desktopPoster: string;
  mobilePoster: string;
  chapters: readonly FilmChapter[];
  firstHeading?: boolean;
  washOutLines?: readonly string[];
  intro?: boolean;
  introLines?: readonly string[];
  reverse?: boolean;
  blendTop?: boolean;
  coverNext?: boolean;
};

function IntroSentence({
  lines,
  wordAttr,
}: {
  lines: readonly string[];
  wordAttr: "data-intro-fill" | "data-intro-ghost";
}) {
  return (
    <text
      data-intro-lines
      x="800"
      y="418"
      textAnchor="middle"
      dominantBaseline="middle"
      xmlSpace="preserve"
      fill={wordAttr === "data-intro-fill" ? "black" : undefined}
      stroke={wordAttr === "data-intro-fill" ? "black" : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {lines.map((line, lineIndex) => (
        <tspan key={line} x="800" dy={lineIndex === 0 ? 0 : "1.08em"}>
          {line.split(" ").map((word, wordIndex) => (
            <tspan
              key={`${line}-${wordIndex}`}
              {...{ [wordAttr]: "" }}
            >
              {wordIndex > 0 ? ` ${word}` : word}
            </tspan>
          ))}
        </tspan>
      ))}
    </text>
  );
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const INTRO_END = 0.13;
const CARD_REVEAL = 0.1;
const WASH_START = 0.8;
const WASH_PLATE = 0.08;
const WRITE_START = 0.84;
const WRITE_SPAN = 0.12;
const AFTER_SIZE = "50vh";

const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export default function ScrollFilm({
  id,
  desktopClip,
  mobileClip,
  desktopPoster,
  mobilePoster,
  chapters,
  firstHeading = false,
  washOutLines,
  intro = false,
  introLines,
  reverse = false,
  blendTop = false,
  coverNext = false,
}: ScrollFilmProps) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chapterStackRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<FilmChapterDeckHandle>(null);
  const deckIndexRef = useRef(0);
  const washRef = useRef<HTMLDivElement>(null);
  const blendRef = useRef<HTMLDivElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const hasWash = Boolean(washOutLines?.length);
  const hasLineIntro = Boolean(introLines?.length);
  const hasIntro = intro || hasLineIntro;
  const introEnd = hasLineIntro ? 0.2 : intro ? INTRO_END : 0;
  const introMaskId = useId().replace(/:/g, "");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionEnabled(!reducedMotion.matches);
    sync();
    reducedMotion.addEventListener("change", sync);
    return () => reducedMotion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!motionEnabled) return;

    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const clip = window.matchMedia("(max-width: 767px)").matches
      ? mobileClip
      : desktopClip;
    if (video.getAttribute("src") !== clip) {
      video.setAttribute("src", clip);
    }

    const washWords = Array.from(
      root.querySelectorAll<HTMLElement>("[data-wash-word]"),
    );
    const introEl = root.querySelector<HTMLElement>(".film-intro");
    const introChrome = Array.from(
      root.querySelectorAll<HTMLElement>("[data-intro-chrome]"),
    );
    const letters = Array.from(
      root.querySelectorAll<SVGTSpanElement>("[data-intro-letter]"),
    );
    const delays = [0.02, 0.09, 0, 0.06, 0.13, 0.04, 0.1];
    const blurStrengths = [3, 5, 2, 4, 3, 5, 2];
    const fillWords = Array.from(
      root.querySelectorAll<SVGTSpanElement>("[data-intro-fill]"),
    );
    const ghostWords = Array.from(
      root.querySelectorAll<SVGTSpanElement>("[data-intro-ghost]"),
    );
    let dock = chapterStackRef.current?.querySelector<HTMLElement>(".film-dock");
    let introClosed = false;
    let lastChapter = -1;
    let lastDock = "";
    let lastWash = "";
    let lastPlate = "";
    let washPhase = -1;

    const setPlate = (value: string) => {
      if (lastPlate === value) return;
      lastPlate = value;
      root.dataset.washPlate = value;
    };

    const closeIntro = () => {
      if (introClosed) return;
      introClosed = true;
      if (introEl) {
        introEl.style.visibility = "hidden";
        introEl.style.display = "none";
      }
      setPlate("false");
    };

    const openIntro = () => {
      if (!introClosed) return;
      introClosed = false;
      if (introEl) {
        introEl.style.display = "";
        introEl.style.visibility = "visible";
      }
    };

    const paintWash = (write: number) => {
      const phase = write <= 0 ? 0 : write >= 1 ? 2 : 1;
      if (phase !== 1 && washPhase === phase) return;
      washPhase = phase;
      const cursor = write * washWords.length;
      washWords.forEach((word, index) => {
        const local = clamp(cursor - index);
        word.style.color = `color-mix(in srgb, var(--ink) ${(local * 100).toFixed(1)}%, var(--muted))`;
      });
    };

    const update = (progress: number) => {
      const p = clamp(progress);
      const introProgress = hasIntro ? clamp(p / introEnd) : 1;
      const chapterStart = hasIntro ? introEnd : 0;
      const chapterEnd = hasWash ? WASH_START : 1;
      const chapterProgress = clamp(
        (p - chapterStart) / Math.max(chapterEnd - chapterStart, 0.001),
      );
      const count = chapters.length;

      if (hasIntro) {
        if (introProgress < 0.999) {
          openIntro();
          setPlate("true");

          if (intro) {
            const spread = smoothstep((introProgress - 0.16) / 0.82);
            const copyOut = smoothstep((introProgress - 0.28) / 0.52);
            letters.forEach((letter, index) => {
              const local = clamp((spread - delays[index]) / (1 - delays[index]));
              letter.style.strokeWidth = `${(local ** 1.35 * 1800).toFixed(2)}px`;
              letter.style.filter = `blur(${(local * blurStrengths[index]).toFixed(2)}px)`;
            });
            introChrome.forEach((line) => {
              line.style.opacity = (1 - copyOut).toFixed(3);
            });
          }

          if (hasLineIntro) {
            const write = clamp((introProgress - 0.04) / 0.44);
            const spread = smoothstep((introProgress - 0.52) / 0.46);
            const cursor = write * fillWords.length;
            fillWords.forEach((word, index) => {
              const local = clamp(cursor - index);
              const dissolve = clamp((spread - index * 0.07) / 0.78);
              word.style.opacity = local.toFixed(3);
              word.style.strokeWidth = `${(dissolve ** 1.35 * 1400).toFixed(2)}px`;
              word.style.filter =
                dissolve > 0.01
                  ? `blur(${(dissolve * (2 + (index % 3))).toFixed(2)}px)`
                  : "none";
            });
            ghostWords.forEach((word, index) => {
              const local = clamp(cursor - index);
              word.style.opacity = (1 - local).toFixed(3);
            });
          }
        } else {
          closeIntro();
        }
      }

      if (Math.abs(chapterProgress - lastChapter) > 0.0008) {
        lastChapter = chapterProgress;
        deckRef.current?.setProgress(chapterProgress);
      }

      const nextIndex = Math.min(
        count - 1,
        Math.floor(chapterProgress * count * 0.999),
      );
      if (nextIndex !== deckIndexRef.current) {
        deckIndexRef.current = nextIndex;
        deckRef.current?.goTo(nextIndex);
      }

      const revealStart = hasIntro ? introEnd * 0.58 : 0;
      const revealT = hasIntro
        ? clamp((p - revealStart) / CARD_REVEAL)
        : 1;
      const reveal = hasIntro ? 1 - (1 - revealT) ** 2 : 1;
      const hideForWash = hasWash
        ? 1 - smoothstep((p - WASH_START) / WASH_PLATE)
        : 1;
      const shown = reveal * hideForWash;
      if (!dock) {
        dock = chapterStackRef.current?.querySelector<HTMLElement>(".film-dock");
      }
      const dockTransform = `translate3d(0, ${((1 - shown) * 100).toFixed(2)}%, 0)`;
      if (dock && lastDock !== dockTransform) {
        lastDock = dockTransform;
        dock.style.transform = dockTransform;
      }

      if (hasWash) {
        const plate = smoothstep((p - WASH_START) / WASH_PLATE);
        const washOpacity = plate.toFixed(3);
        if (washRef.current && lastWash !== washOpacity) {
          lastWash = washOpacity;
          washRef.current.style.opacity = washOpacity;
        }
        if (!hasIntro || p > introEnd) {
          setPlate(plate > 0.45 ? "true" : "false");
        }
        paintWash(clamp((p - WRITE_START) / WRITE_SPAN));
      }
    };

    let trigger: ScrollTrigger | null = null;
    let playheadTween: gsap.core.Tween | null = null;

    const createScrub = () => {
      if (trigger || !Number.isFinite(video.duration)) return;

      video.pause();
      const playhead = { time: 0 };
      const duration = Math.max(video.duration - 0.05, 0);

      const seek = (raw: number) => {
        const videoTime = reverse ? duration - raw * duration : raw * duration;
        if (Math.abs(video.currentTime - videoTime) <= 0.03) return;
        try {
          video.currentTime = videoTime;
        } catch {
          // Safari can reject a seek while the media element is warming up.
        }
      };

      playheadTween = gsap.to(playhead, {
        time: duration,
        paused: true,
        ease: "none",
        onUpdate: () => {
          const raw = duration > 0 ? playhead.time / duration : 0;

          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            seek(raw);
          }

          update(raw);
        },
      });

      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: coverNext ? `bottom-=${AFTER_SIZE} bottom` : "bottom bottom",
        animation: playheadTween,
        scrub: 0.55,
        invalidateOnRefresh: true,
        onRefresh: (self) => update(self.progress),
      });

      update(trigger.progress);
      seek(trigger.progress);
      video.addEventListener(
        "loadeddata",
        () => seek(trigger?.progress ?? 0),
        { once: true },
      );
    };

    video.pause();
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      createScrub();
    } else {
      video.addEventListener("loadedmetadata", createScrub, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", createScrub);
      trigger?.kill();
      playheadTween?.kill();
      video.pause();
    };
  }, [
    chapters.length,
    coverNext,
    desktopClip,
    hasWash,
    hasIntro,
    hasLineIntro,
    intro,
    introEnd,
    introLines,
    mobileClip,
    motionEnabled,
    reverse,
    washOutLines,
  ]);

  useEffect(() => {
    if (!blendTop) return;

    const root = rootRef.current;
    const blend = blendRef.current;
    if (!root || !blend) return;

    const tween = gsap.fromTo(
      blend,
      { opacity: 1 },
      {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 28%",
          end: "top top",
          scrub: 0.4,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [blendTop]);

  const journeyClass = [
    "film-journey",
    hasWash ? "film-journey--wash" : "",
    hasIntro ? "film-journey--intro" : "",
    coverNext ? "film-journey--cover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      ref={rootRef}
      className={journeyClass}
      data-motion={motionEnabled ? "on" : "off"}
      data-wash-plate={hasIntro ? "true" : undefined}
    >
      <div className="film-stage">
        <div className="film-media">
          <picture>
            <source media="(max-width: 767px)" srcSet={mobilePoster} />
            <img src={desktopPoster} alt="" aria-hidden />
          </picture>

          {motionEnabled ? (
            <video
              ref={videoRef}
              className="film-video"
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              aria-hidden
            />
          ) : null}

          {blendTop ? (
            <div ref={blendRef} className="film-blend-top" aria-hidden />
          ) : null}
        </div>

        {intro ? (
          <div className="film-intro">
            <svg
              className="film-intro-knockout"
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <defs>
                <mask
                  id={introMaskId}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="1600"
                  height="900"
                >
                  <rect
                    x="-1600"
                    y="-900"
                    width="4800"
                    height="2700"
                    fill="white"
                  />
                  <text
                    data-intro-name
                    x="800"
                    y="450"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="black"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {["A", "D", "A", "M", "A", "S", "S"].map(
                      (letter, index) => (
                        <tspan
                          data-intro-letter
                          key={`${letter}-${index}`}
                        >
                          {letter}
                        </tspan>
                      ),
                    )}
                  </text>
                </mask>
              </defs>
              <rect
                x="-1600"
                y="-900"
                width="4800"
                height="2700"
                fill="#fff"
                mask={`url(#${introMaskId})`}
              />
            </svg>
            <div className="film-intro-lockup" data-intro-chrome>
              <FilmIntroKicker />
              <span className="film-intro-name-slot" aria-hidden />
              <FilmIntroLabels />
            </div>
          </div>
        ) : null}

        {introLines ? (
          <div className="film-intro">
            <svg
              className="film-intro-knockout"
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <defs>
                <mask
                  id={introMaskId}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="1600"
                  height="900"
                >
                  <rect
                    x="-1600"
                    y="-900"
                    width="4800"
                    height="2700"
                    fill="white"
                  />
                  <IntroSentence
                    lines={introLines}
                    wordAttr="data-intro-fill"
                  />
                </mask>
              </defs>
              <rect
                x="-1600"
                y="-900"
                width="4800"
                height="2700"
                fill="#fff"
                mask={`url(#${introMaskId})`}
              />
            </svg>
            <svg
              className="film-intro-ghost"
              viewBox="0 0 1600 900"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <IntroSentence
                lines={introLines}
                wordAttr="data-intro-ghost"
              />
            </svg>
          </div>
        ) : null}

        <div ref={chapterStackRef} className="film-chapter-stack">
          <FilmChapterDeck
            ref={deckRef}
            chapters={chapters}
            firstHeading={firstHeading}
          />
        </div>

        {washOutLines ? (
          <div ref={washRef} className="film-wash" aria-hidden={motionEnabled}>
            <p>
              {washOutLines
                .join(" ")
                .split(" ")
                .map((word, index) => (
                  <span data-wash-word key={`${word}-${index}`}>
                    {word}
                  </span>
                ))}
            </p>
          </div>
        ) : null}
      </div>
      {coverNext ? <div className="film-cover-slot" aria-hidden /> : null}
    </section>
  );
}

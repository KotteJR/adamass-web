"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FilmChapter } from "@/lib/film";
import FilmChapterDeck, { type FilmChapterDeckHandle } from "./FilmChapterDeck";
import FilmIntroDissolve, {
  type FilmIntroDissolveHandle,
} from "./FilmIntroDissolve";
import FilmIntroLabels from "./FilmIntroLabels";
import FilmIntroScroll from "./FilmIntroScroll";

gsap.registerPlugin(ScrollTrigger);

type ScrollFilmProps = {
  id: string;
  ariaLabel: string;
  desktopClip: string;
  mobileClip: string;
  desktopPoster: string;
  mobilePoster: string;
  chapters: readonly FilmChapter[];
  firstHeading?: boolean;
  washOutLines?: readonly string[];
  intro?: boolean;
  introLines?: readonly string[];
  blendTop?: boolean;
};

function IntroTagline({
  lines,
  live = false,
}: {
  lines: readonly string[];
  live?: boolean;
}) {
  return (
    <p
      className={
        live ? "film-intro-tagline" : "film-intro-tagline film-intro-tagline--slot"
      }
    >
      {lines.map((line) => (
        <span className="film-intro-tagline-line" key={line}>
          {line}
        </span>
      ))}
    </p>
  );
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const INTRO_END = 0.13;
const LINE_INTRO_END = 0.16;
const CARD_REVEAL = 0.1;
const WASH_START = 0.8;
const WASH_PLATE = 0.08;
const WRITE_START = 0.84;
const WRITE_SPAN = 0.12;

const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export default function ScrollFilm({
  id,
  ariaLabel,
  desktopClip,
  mobileClip,
  desktopPoster,
  mobilePoster,
  chapters,
  firstHeading = false,
  washOutLines,
  intro = false,
  introLines,
  blendTop = false,
}: ScrollFilmProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chapterStackRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<FilmChapterDeckHandle>(null);
  const dissolveRef = useRef<FilmIntroDissolveHandle>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const blendRef = useRef<HTMLDivElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [loadClip, setLoadClip] = useState(firstHeading);
  const hasWash = Boolean(washOutLines?.length);
  const hasLineIntro = Boolean(introLines?.length);
  const dissolveOnly = hasLineIntro;
  const hasIntro = intro || hasLineIntro;
  const introEnd = hasLineIntro ? LINE_INTRO_END : intro ? INTRO_END : 0;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionEnabled(!reducedMotion.matches);
    sync();
    reducedMotion.addEventListener("change", sync);
    return () => reducedMotion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (loadClip) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoadClip(true);
        observer.disconnect();
      },
      { rootMargin: "160% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [loadClip]);

  useEffect(() => {
    if (!motionEnabled) return;

    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const isPhone = window.matchMedia("(max-width: 767px)").matches;
    const video = videoRef.current;

    if (video) {
      const clip = isPhone ? mobileClip : desktopClip;
      if (video.getAttribute("src") !== clip) {
        video.setAttribute("src", clip);
      }
    }

    const washWords = Array.from(
      root.querySelectorAll<HTMLElement>("[data-wash-word]"),
    );
    const introLayers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-intro-layer]"),
    );
    const introChrome = Array.from(
      root.querySelectorAll<HTMLElement>("[data-intro-chrome]"),
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
      introLayers.forEach((layer) => {
        layer.style.visibility = "hidden";
        layer.style.display = "none";
        layer.style.opacity = "";
      });
      setPlate("false");
    };

    const openIntro = () => {
      if (!introClosed) return;
      introClosed = false;
      introLayers.forEach((layer) => {
        layer.style.display = "";
        layer.style.visibility = "visible";
        layer.style.opacity = "";
      });
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
      const stackStart = hasIntro ? chapterStart + CARD_REVEAL : chapterStart;
      const chapterProgress = clamp(
        (p - stackStart) / Math.max(chapterEnd - stackStart, 0.001),
      );

      if (hasIntro) {
        if (introProgress < 0.999) {
          openIntro();
          setPlate("true");

          if (dissolveOnly) {
            const videoIn = smoothstep((introProgress - 0.08) / 0.8);
            const copyOut = smoothstep((introProgress - 0.08) / 0.28);
            dissolveRef.current?.setProgress(videoIn);
            introChrome.forEach((line) => {
              line.style.opacity = (1 - copyOut).toFixed(3);
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

      const revealStart = hasIntro ? introEnd : 0;
      const revealT = hasIntro ? clamp((p - revealStart) / CARD_REVEAL) : 1;
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

    const playhead = { p: 0 };
    let duration = 0;

    const seek = (raw: number) => {
      if (!video || duration <= 0) return;
      const videoTime = raw * duration;
      if (Math.abs(video.currentTime - videoTime) <= 0.03) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      try {
        video.currentTime = videoTime;
      } catch {
        // Safari can reject a seek while the media element is warming up.
      }
    };

    const playheadTween = gsap.to(playhead, {
      p: 1,
      paused: true,
      ease: "none",
      onUpdate: () => {
        update(playhead.p);
        seek(playhead.p);
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      pin: isPhone ? stage : false,
      pinSpacing: false,
      anticipatePin: isPhone ? 1 : 0,
      animation: playheadTween,
      scrub: 0.55,
      invalidateOnRefresh: true,
      onRefresh: (self) => update(self.progress),
    });

    const bindVideo = () => {
      if (!video || !Number.isFinite(video.duration)) return;
      video.pause();
      duration = Math.max(video.duration - 0.05, 0);
      seek(trigger.progress);
    };

    if (video) {
      video.pause();
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        bindVideo();
      } else {
        video.addEventListener("loadedmetadata", bindVideo, { once: true });
      }
      video.addEventListener(
        "loadeddata",
        () => seek(trigger.progress),
        { once: true },
      );
    }

    update(trigger.progress);

    return () => {
      video?.removeEventListener("loadedmetadata", bindVideo);
      trigger.kill();
      playheadTween.kill();
      video?.pause();
    };
  }, [
    chapters.length,
    desktopClip,
    dissolveOnly,
    hasIntro,
    hasLineIntro,
    hasWash,
    introEnd,
    introLines,
    loadClip,
    mobileClip,
    motionEnabled,
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
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id={id}
      ref={rootRef}
      className={journeyClass}
      aria-label={ariaLabel}
      data-motion={motionEnabled ? "on" : "off"}
      data-wash-plate={hasIntro ? "true" : undefined}
    >
      <div ref={stageRef} className="film-stage">
        <div className="film-media">
          <picture>
            <source media="(max-width: 767px)" srcSet={mobilePoster} />
            <img
              src={desktopPoster}
              alt=""
              aria-hidden
              decoding="async"
              fetchPriority={firstHeading ? "high" : "low"}
            />
          </picture>

          {motionEnabled && loadClip ? (
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

        {dissolveOnly && introLines ? (
          <>
            <div className="film-intro-plate" data-intro-layer aria-hidden>
              <FilmIntroDissolve ref={dissolveRef} />
              <div className="film-intro-hero">
                <IntroTagline lines={introLines} live />
                {intro ? (
                  <div className="film-intro-labels-wrap">
                    <FilmIntroLabels />
                  </div>
                ) : null}
              </div>
            </div>
            <div
              className={`film-intro film-intro--dissolve${introLines.length <= 2 ? " film-intro--couple" : ""}`}
              data-intro-layer
            >
              <div className="film-intro-hero">
                <IntroTagline lines={introLines} />
                {intro ? (
                  <div className="film-intro-labels-wrap" data-intro-chrome>
                    <FilmIntroLabels />
                  </div>
                ) : null}
              </div>
              {intro ? <FilmIntroScroll /> : null}
            </div>
          </>
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
    </section>
  );
}

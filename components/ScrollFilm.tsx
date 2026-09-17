"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FilmChapter } from "@/lib/film";
import AdamassLogo from "./AdamassLogo";
import FilmChapterDeck, { type FilmChapterDeckHandle } from "./FilmChapterDeck";
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

function IntroTagline({ lines }: { lines: readonly string[] }) {
  return (
    <p className="film-intro-tagline">
      {lines.map((line, index) => (
        <span
          className="film-intro-tagline-line"
          data-intro-dissolve
          data-intro-order={1 + index}
          key={line}
        >
          {line}
        </span>
      ))}
    </p>
  );
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const INTRO_END = 0.26;
const LINE_INTRO_END = 0.36;
const PLATE_OUT_START = 0.22;
const PLATE_OUT_SPAN = 0.78;
const CARD_REVEAL = 0.1;
const WASH_START = 0.8;
const WASH_PLATE = 0.08;
const WRITE_START = 0.84;
const WRITE_SPAN = 0.12;

const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

const smootherstep = (value: number) => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
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
  const platePaintRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
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
    if (!root) return;

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
    const dissolveEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-intro-dissolve]"),
    );
    const heroIn = root.querySelector<HTMLElement>(".film-intro-hero-in");
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
      // A refresh can leave the plate opaque behind the hidden layer, which
      // would flash white if the intro is ever reopened.
      if (heroRef.current) heroRef.current.style.opacity = "0";
      if (platePaintRef.current) platePaintRef.current.style.opacity = "0";
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
            if (heroIn && introProgress > 0.012) {
              heroIn.style.animation = "none";
            }

            const plateOut = smootherstep(
              (introProgress - PLATE_OUT_START) / PLATE_OUT_SPAN,
            );

            if (heroRef.current) {
              heroRef.current.style.opacity = "1";
            }
            if (platePaintRef.current) {
              platePaintRef.current.style.opacity = (1 - plateOut).toFixed(3);
            }

            dissolveEls.forEach((el) => {
              const order = Number(el.dataset.introOrder || 0);
              const start = 0.2 + order * 0.04;
              const out = smootherstep((introProgress - start) / 0.7);
              el.style.opacity = (1 - out).toFixed(3);
              el.style.transform = `translate3d(0, ${(out * -18).toFixed(2)}px, 0) scale(${(1 - out * 0.035).toFixed(3)})`;
              el.style.filter =
                out > 0.02 && out < 0.97
                  ? `blur(${(out * 7).toFixed(2)}px)`
                  : "none";
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

    // Intro and wash eat the pin. Map the clip onto the visible chapter
    // window so the last beat (the spark) lands on the last card, not
    // under the white plate.
    const videoProgress = (p: number) => {
      const videoStart = hasIntro ? introEnd : 0;
      const videoEnd = hasWash ? WASH_START : 1;
      return clamp((p - videoStart) / Math.max(videoEnd - videoStart, 0.001));
    };

    const playheadTween = gsap.to(playhead, {
      p: 1,
      paused: true,
      ease: "none",
      onUpdate: () => {
        update(playhead.p);
        seek(videoProgress(playhead.p));
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      animation: playheadTween,
      scrub: 1.05,
      invalidateOnRefresh: true,
      onRefresh: (self) => update(self.progress),
    });

    const bindVideo = () => {
      if (!video || !Number.isFinite(video.duration)) return;
      video.pause();
      duration = Math.max(video.duration - 0.05, 0);
      seek(videoProgress(trigger.progress));
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
        () => seek(videoProgress(trigger.progress)),
        { once: true },
      );
    }

    update(trigger.progress);
    root.dataset.filmReady = "on";

    return () => {
      video?.removeEventListener("loadedmetadata", bindVideo);
      trigger.kill();
      playheadTween.kill();
      video?.pause();
      dissolveEls.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.filter = "";
      });
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
      data-film-ready="off"
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
          <div className="film-intro" data-intro-layer>
            <div
              ref={platePaintRef}
              className="film-intro-plate"
              aria-hidden
            />
            <div ref={heroRef} className="film-intro-hero">
              <div className="film-intro-hero-in">
                {intro ? (
                  <span data-intro-dissolve data-intro-order="0">
                    <AdamassLogo className="film-intro-logo" decorative />
                  </span>
                ) : null}
                <IntroTagline lines={introLines} />
                {intro ? (
                  <div className="film-intro-labels-wrap">
                    <FilmIntroLabels />
                  </div>
                ) : null}
              </div>
            </div>
            {intro ? <FilmIntroScroll /> : null}
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
    </section>
  );
}

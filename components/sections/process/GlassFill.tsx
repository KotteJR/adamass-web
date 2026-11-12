"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { boxPlace, boxPx } from "./StepBoxes";

/**
 * How far the surface bows, in px: per px/s of speed, per px/s² of acceleration (the g-force: a hard stop throws
 * the liquid forward, a sudden start pulls it back), and at most. Moving right it bows in; stopping, it surges out.
 */
const BOW_PER_SPEED = 0.04;
const BOW_PER_ACCEL = 0.0022;
/** The physics reads a smoothed copy of the edge (this time constant, in s), so uneven pointer events do not make the surface jitter. */
const FEEL_S = 0.06;
const BOW_MAX = 46;
/** The surface's spring: the low damping lets it wobble a couple of times after a stop before it settles. */
const BOW_STIFFNESS = 150;
const BOW_DAMPING = 8.5;
/** How long the edge glides to a new place when set by a key or a button, in ms: the knob's 0.5 s, on its curve. */
const GLIDE_MS = 500;
/** How soft the edge is (the blur on the surface), in px. */
const SOFT_PX = 7;

/** The site's ease-out-soft, cubic-bezier(0.2, 0.7, 0.2, 1), so the edge glides exactly as the knob does. */
function easeOutSoft(t: number) {
  const bez = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  let s = t;
  for (let i = 0; i < 6; i++) {
    const dx = 3 * 0.2 * (1 - s) ** 2 + 6 * (0.2 - 0.2) * s * (1 - s) + 3 * (1 - 0.2) * s * s;
    s = Math.min(1, Math.max(0, s - (bez(0.2, 0.2, s) - t) / (dx || 1)));
  }
  return bez(0.7, 1, s);
}

type GlassFillProps = {
  /** Each step's [start, width] as fractions of the row. */
  layout: [number, number][];
  /** The row's width and the boxes' height, in px. */
  width: number;
  height: number;
  /** Where the knob is, in px from the row's left. */
  x: number;
  /** While dragging the edge sits on the pointer; otherwise it glides as the knob does. */
  dragging: boolean;
  /** Classes for each box's wrapper, such as the glide of its place when the way in changes. */
  boxClassName?: string;
};

/**
 * The glass that fills the step boxes up to the knob, drawn as liquid. Its
 * surface (the edge) stays on the knob, and its shape answers the motion like
 * liquid under g-force: dragging right, the middle lags and the surface bows
 * in; stopping, it surges out, wobbles and settles flat; dragging left, the
 * other way round. It ripples a little while it is on screen. Filled glass
 * stays still. Each box is an SVG: the glass is clipped to the box's rounded
 * corners and masked by the surface, softened by a blur. The surface is
 * redrawn every frame outside React. Reduced motion keeps it flat and still.
 */
export function GlassFill({ layout, width, height, x, dragging, boxClassName }: GlassFillProps) {
  const id = useId().replace(/[^\w-]/g, "");
  const root = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const view = useRef({ layout, width, height });
  const sim = useRef({ e: x, felt: x, from: x, to: x, placed: x, start: 0, speed: 0, accel: 0, bow: 0, bowSpeed: 0, time: 0, last: 0, frame: 0, ready: false, visible: true, still: false, drawn: [] as string[] });

  // The surface of one box: solid from the left up to the edge, which bows by `bow` at its middle and ripples.
  const surface = (local: number, boxWidth: number, bow: number, time: number, still: boolean) => {
    const h = view.current.height;
    if (local >= boxWidth + BOW_MAX + 20) return `M-40 -20H${boxWidth + 40}V${h + 20}H-40Z`;
    if (local <= -BOW_MAX - 20) return "";
    let d = "M-40 -20";
    for (let y = -20; y <= h + 20; y += 6) {
      const u = Math.max(-1, Math.min(1, (2 * y) / h - 1));
      const ripple = still ? 0 : 2 * Math.sin((y / 52) * 2 * Math.PI + time * 2.4) + 1.1 * Math.sin((y / 31) * 2 * Math.PI - time * 1.7);
      d += `L${(local + bow * (1 - u * u) + ripple).toFixed(1)} ${y}`;
    }
    return `${d}L-40 ${h + 20}Z`;
  };

  const draw = () => {
    const s = sim.current;
    const { layout, width } = view.current;
    layout.forEach((_, i) => {
      const box = boxPx(layout, i, width);
      const d = surface(s.e - box.left, box.width, s.bow, s.time, s.still);
      if (s.drawn[i] === d) return;
      s.drawn[i] = d;
      paths.current[i]?.setAttribute("d", d);
    });
  };

  const tick = (now: number) => {
    const s = sim.current;
    const dt = s.last ? Math.min(0.032, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    s.e = s.start < 0 ? s.to : s.from + (s.to - s.from) * easeOutSoft(Math.min(1, (now - s.start) / GLIDE_MS));
    // The speed and acceleration of a smoothed copy of the edge; the surface bows against both, on an underdamped spring.
    const before = s.felt;
    s.felt += (s.e - s.felt) * (1 - Math.exp(-dt / FEEL_S));
    const speed = (s.felt - before) / dt;
    s.accel = s.accel * 0.8 + ((speed - s.speed) / dt) * 0.2;
    s.speed = speed;
    const target = Math.max(-BOW_MAX, Math.min(BOW_MAX, -s.speed * BOW_PER_SPEED - s.accel * BOW_PER_ACCEL));
    s.bowSpeed += (BOW_STIFFNESS * (target - s.bow) - BOW_DAMPING * s.bowSpeed) * dt;
    s.bow += s.bowSpeed * dt;
    s.time += dt;
    draw();
    s.frame = s.visible ? requestAnimationFrame(tick) : 0;
  };

  const run = () => {
    const s = sim.current;
    if (s.still || !s.visible || s.frame) return;
    s.last = 0;
    s.frame = requestAnimationFrame(tick);
  };

  useEffect(() => {
    view.current = { layout, width, height };
  });

  // A new place for the knob: jump on the first draw, sit on the pointer while dragging, else glide there.
  useEffect(() => {
    const s = sim.current;
    s.still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (s.ready && x === s.placed) return;
    s.placed = x;
    if (!s.ready || s.still) {
      s.ready = true;
      s.e = s.felt = s.from = s.to = x;
      s.bow = s.bowSpeed = s.speed = s.accel = 0;
      draw();
      return;
    }
    s.from = s.e;
    s.to = x;
    s.start = dragging ? -1 : performance.now();
    run();
  });

  // A new width or height (a resize, a phone turned) moves the edge straight to the knob.
  useEffect(() => {
    const s = sim.current;
    s.e = s.felt = s.from = s.to = s.placed = x;
    s.drawn = [];
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on a new size; x is read as it is now.
  }, [width, height]);

  // Ripple only while the boxes are on screen.
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const s = sim.current;
    const observer = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      if (s.visible) run();
      else if (s.frame) {
        cancelAnimationFrame(s.frame);
        s.frame = 0;
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(s.frame);
      s.frame = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- set up once.
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0">
      <svg className="absolute size-0">
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.035" />
          </linearGradient>
          <radialGradient id={`${id}-light`} cx="0.3" cy="0" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.09" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-soft`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation={SOFT_PX} />
          </filter>
        </defs>
      </svg>
      {layout.map((_, i) => (
        <div key={i} className={cn("absolute inset-y-0", boxClassName)} style={boxPlace(layout, i)}>
          <svg className="absolute inset-0 size-full overflow-visible">
            <defs>
              <clipPath id={`${id}-box${i}`}>
                <rect width="100%" height="100%" rx="8" />
              </clipPath>
              <mask id={`${id}-surface${i}`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="6000" height="600">
                <path
                  ref={(path) => {
                    paths.current[i] = path;
                  }}
                  fill="#fff"
                  filter={`url(#${id}-soft)`}
                />
              </mask>
            </defs>
            <g clipPath={`url(#${id}-box${i})`} mask={`url(#${id}-surface${i})`}>
              <rect width="100%" height="100%" fill={`url(#${id}-fill)`} />
              <rect width="100%" height="100%" fill={`url(#${id}-light)`} />
              {/* The lit border: a 2 px stroke, half of it clipped away by the box's corners, so 1 px shows inside. */}
              <rect width="100%" height="100%" rx="8" fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="2" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}

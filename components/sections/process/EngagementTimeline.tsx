"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { Phase, WayIn } from "@/content/process";
import { cn } from "@/lib/utils";
import {
  momentAt,
  phaseAt,
  phaseBounds,
  placeOf,
  pointLabel,
  rangeLabel,
  stepLayout,
  totalWeeks,
  weekOf,
} from "./engagement-math";
import { MomentNote } from "./MomentNote";
import { PlayheadSlider } from "./PlayheadSlider";
import { GlassFill } from "./GlassFill";
import { boxPlace, StepBoxes } from "./StepBoxes";
import { StepRail } from "./StepRail";
import styles from "./process.module.css";

/** The room a step's name needs, in px. */
const STEP_PX = { wide: 132, narrow: 84 };
const WEEKS_PER_MONTH = 52 / 12;
/** The phone's single box, as a layout of one step that fills the row. */
const WHOLE: [number, number][] = [[0, 1]];

type EngagementTimelineProps = {
  way: WayIn;
  /** Every way in, so the note's room fits the longest moment. */
  ways: WayIn[];
  phases: Phase[];
  week: number;
  onWeek: (week: number) => void;
  label: string;
  /** Said to screen readers with the timeline: how long it runs in all, and how much of it is shown. */
  summary: string;
  labels: { previous: string; next: string };
};

/**
 * The engagement, from 640 px: four boxes in a row, one per step, each as wide
 * as the step runs (never too narrow for its name), with its name and weeks
 * inside. As the playhead moves the boxes fill with frosted glass drawn as
 * liquid (GlassFill): filled glass stays still, and its surface sits on the
 * knob and bows in or out under the motion like liquid under g-force. The knob
 * rides the boxes' bottom edge, with small checkpoints along it where each
 * moment happens, and the current moment's name sits just above the knob. One
 * line drops from the knob past the note.
 *
 * On phones: a slim rail of the four steps with the checkpoints, the knob and
 * the word on it, and under it one box for the step the knob is in, with its
 * own liquid fill. Dragging anywhere across the rail or the box moves along the
 * whole engagement.
 *
 * Drag (the knob stays where you let go), press to jump, or use the keys.
 */
export function EngagementTimeline({ way, ways, phases, week, onWeek, label, summary, labels }: EngagementTimelineProps) {
  const root = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState(1200);
  // Until the row is measured the glass does not glide, so it never sweeps in on load.
  const [measured, setMeasured] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
      setMeasured(true);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const min = Math.min(0.25, Math.max(0.06, (width < 640 ? STEP_PX.narrow : STEP_PX.wide) / width));
  const layout = stepLayout(way, min);
  const bounds = phaseBounds(way);
  const current = phaseAt(way, week);
  const momentIndex = momentAt(way.moments, week);
  const moment = way.moments[momentIndex];
  const at = placeOf(way, week, layout) * 100;
  // How far through the current step the knob is, 0 to 1: the phone's box fills by it.
  const [stepStart, stepEnd] = bounds[current];
  const through = Math.min(1, Math.max(0, (week - stepStart) / Math.max(1e-6, stepEnd - stepStart)));

  // What marks the playhead glides when set by a key or a button. While dragging nothing animates,
  // so the knob, the word and the note follow the pointer together, in the same frame.
  const glide = !dragging && "duration-500 ease-out-soft motion-reduce:transition-none";

  // The word above the knob: the name of the latest moment the knob has passed. It sits on the knob and leans
  // as the knob moves along (translated by --at of its own width), so it never runs off either end.
  const word = (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-(--x) z-20 -translate-x-(--at) text-xs font-medium tracking-[-0.005em] whitespace-nowrap text-white",
        !dragging && "transition-[left,translate]",
        glide,
      )}
    >
      <span key={`${way.id}-${momentIndex}`} className={cn("block", styles.swap)}>
        {moment.label}
      </span>
    </span>
  );
  // Small checkpoints on the line, one where each moment happens: lit once passed.
  const ticks = way.moments.map((m, k) => (
    <span
      key={`${way.id}-${k}`}
      aria-hidden
      className={cn("pointer-events-none absolute w-px -translate-x-1/2 transition-colors", k <= momentIndex ? "bg-white/70" : "bg-white/25")}
      style={{ left: `${placeOf(way, m.week, layout) * 100}%` }}
    />
  ));


  // Arrow keys move a week (a month on the long ways in); Page Up and Down jump between moments.
  const onKey = (key: string) => {
    const total = totalWeeks(way);
    const unit = way.unit === "month" ? WEEKS_PER_MONTH : 1;
    const index = momentAt(way.moments, week);
    const moment = (i: number) => way.moments[Math.min(way.moments.length - 1, Math.max(0, i))].week;
    const next = {
      ArrowRight: week + unit,
      ArrowUp: week + unit,
      ArrowLeft: week - unit,
      ArrowDown: week - unit,
      PageUp: moment(index + 1),
      PageDown: moment(way.moments[index].week < week - 1e-6 ? index : index - 1),
      Home: 0,
      End: total,
    }[key];
    if (next === undefined) return false;
    onWeek(Math.min(total, Math.max(0, next)));
    return true;
  };

  const slider = (
    <PlayheadSlider
      place={at / 100}
      onPlace={(place) => onWeek(weekOf(way, place, layout))}
      onKey={onKey}
      onDragging={setDragging}
      label={label}
      valueText={`${pointLabel(way, week)}, ${phases[current].title}: ${moment.text}`}
      className="absolute inset-0 z-10"
    />
  );

  return (
    <div
      ref={root}
      className={cn("relative", styles.timeline)}
      // --x: the playhead line's left edge, kept 1 px inside at the very end. The knob and the note's line both use it.
      style={{ "--at": `${at}%`, "--x": `min(${at}%, 100% - 1px)` } as CSSProperties}
    >
      <p className="sr-only">{summary}</p>

      {/* From 640 px: the four boxes. */}
      <div className={cn("relative h-28 max-sm:hidden", styles.area)}>
        <StepBoxes layout={layout} boxClassName={cn("border-white/12", measured && styles.flow)} />
        <GlassFill
          layout={layout}
          width={width}
          height={112}
          x={(at / 100) * width}
          dragging={dragging}
          boxClassName={measured && !dragging ? styles.flow : undefined}
        />

        {/* Each step's name and weeks, inside its box. Placed exactly as the box is. */}
        <ol className="pointer-events-none absolute inset-0">
          {phases.map((phase, i) => (
            <li
              key={phase.title}
              aria-current={i === current ? "step" : undefined}
              style={boxPlace(layout, i)}
              className={cn("absolute inset-y-0 flex min-w-0 flex-col gap-1 px-4 pt-4", measured && styles.flow)}
            >
              <span
                  className={cn(
                    "overflow-hidden text-lg font-medium tracking-[-0.01em] whitespace-nowrap transition-colors",
                    i < current && "text-white/75",
                    i === current && "text-white",
                    i > current && "text-white/40",
                  )}
                >
                  {phase.title}
                </span>
                <span className="overflow-hidden font-mono text-[0.625rem] tracking-[0.08em] whitespace-nowrap text-white/40 uppercase">
                  {rangeLabel(way, bounds[i])}
                </span>
            </li>
          ))}
        </ol>

        {/* The checkpoints on the bottom edge, the word over the knob, and the knob. The line down from it is drawn with the note. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 [&>span]:inset-y-0">{ticks}</span>
        <span className="pointer-events-none absolute inset-x-0 bottom-3.5 h-4 [&>span]:bottom-0">{word}</span>
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-[calc(100%-0.5px)] left-[calc(var(--x)+0.5px)] z-20 size-3.5 -translate-1/2 rounded-full bg-white shadow-[0_0_0_3px_#0d1726]",
            dragging ? "scale-115" : "transition-[left,scale,box-shadow]",
            glide,
            styles.knob,
          )}
        />
        {slider}
      </div>

      {/* Phones: the four steps as a slim rail with the knob, then the current step, full width. */}
      <div className={cn("relative pt-7 sm:hidden", styles.area)}>
        <div className="relative">
          <span className="pointer-events-none absolute inset-x-0 bottom-3.5 h-4 [&>span]:bottom-0">{word}</span>
          <StepRail layout={layout} current={current} />
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 [&>span]:inset-y-0">{ticks}</span>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 left-(--at) z-20 size-3.5 -translate-1/2 rounded-full bg-white shadow-[0_0_0_3px_#0d1726]",
              dragging ? "scale-115" : "transition-[left,scale,box-shadow]",
              glide,
              styles.knob,
            )}
          />
        </div>
        <div className="relative mt-5 h-20 rounded-lg border border-white/12">
          {/* A fresh liquid for each step, so moving into the next one starts it empty instead of sloshing back. */}
          <GlassFill key={`${way.id}-${current}`} layout={WHOLE} width={width} height={80} x={through * width} dragging={dragging} />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-4">
            <span className="flex items-baseline justify-between gap-3">
              <span key={`${way.id}-${current}`} className={cn("text-base font-medium tracking-[-0.01em] text-white", styles.swap)}>
                {phases[current].title}
              </span>
              <span className="font-mono text-[0.625rem] tracking-[0.08em] whitespace-nowrap text-white/45 uppercase">
                {rangeLabel(way, bounds[current])}
              </span>
            </span>
          </div>
        </div>
        {slider}
      </div>

      <MomentNote way={way} ways={ways} week={week} phases={phases} at={at} trackWidth={width} dragging={dragging} onWeek={onWeek} labels={labels} />
    </div>
  );
}

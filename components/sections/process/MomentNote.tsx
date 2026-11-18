"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Moment, Phase, WayIn, TimeUnits } from "@/content/process";
import { cn } from "@/lib/utils";
import { momentAt, phaseAt, pointLabel } from "./engagement-math";
import styles from "./process.module.css";

type MomentNoteProps = {
  way: WayIn;
  /** Every way in: the note's room is sized to the longest of all their moments. */
  ways: WayIn[];
  phases: Phase[];
  week: number;
  /** Where the playhead is across the frame, 0 to 100. */
  at: number;
  /** The frame's width in px, to decide where the note can hang. */
  trackWidth: number;
  dragging: boolean;
  onWeek: (week: number) => void;
  labels: { previous: string; next: string };
  units: TimeUnits;
};

/** The note's width when it hangs beside the line. */
const NOTE_PX = 460;
const NARROW_PX = 640;

/** The round arrow buttons, for a dark ground. 44 px: a comfortable target. */
const arrowButton =
  "inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/50 hover:bg-white/5 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9cc0e6]";

/** What the note says: where (and which step), the latest moment up to there, and what the step is for. */
function NoteText({ where, moment, phase }: { where: string; moment: Moment; phase: Phase }) {
  return (
    <>
      <span className="type-label text-[#9cc0e6]">
        {where} · {phase.title}
      </span>
      <p className="mt-3 text-[1.25rem] leading-[1.3] font-medium tracking-[-0.02em] text-balance text-white sm:text-[1.5rem]">
        {moment.text}
      </p>
      <p className="mt-3 text-[0.9375rem] leading-[1.55] text-white/60">{phase.body}</p>
    </>
  );
}

/**
 * The note under the playhead, drawn like an annotation: the playhead's line
 * comes down from the knob and the note hangs beside it, with no box, and the arrows to step
 * through the moments sit under its text. It hangs right of the line, or left
 * of it near the end; where neither fits it spans the width under the line.
 * Its room is as tall as the longest moment of any way in, so nothing below
 * moves, at any width.
 */
export function MomentNote({ way, ways, phases, week, at, trackWidth, dragging, onWeek, labels, units }: MomentNoteProps) {
  const index = momentAt(way.moments, week);
  const moment = way.moments[index];
  const phase = phases[phaseAt(way, week)];
  const x = (at / 100) * trackWidth;
  const hang = trackWidth < NARROW_PX ? "full" : x + NOTE_PX <= trackWidth ? "right" : x >= NOTE_PX ? "left" : "full";
  const step = (by: number) => onWeek(way.moments[Math.min(way.moments.length - 1, Math.max(0, index + by))].week);
  const glide = !dragging && "transition-[left,translate] duration-500 ease-out-soft motion-reduce:transition-none";

  return (
    <div className="relative pt-8">
      {/* The playhead's line: one element, from the knob down past the note, at the --x the timeline sets.
          The note only hangs beside it, so gliding or changing sides never breaks it. Phones have no line:
          their knob sits on the rail above the step's box. */}
      <span
        aria-hidden
        className={cn("pointer-events-none absolute top-0 left-(--x) w-px bg-[#9cc0e6]/60 max-sm:hidden", hang === "full" ? "h-8" : "bottom-0", glide)}
      />

      {/* Every moment of every way in, stacked and hidden, with room for the arrows: the note is as tall as the longest. */}
      <div aria-hidden className="invisible grid w-full max-w-[460px] [&>*]:col-start-1 [&>*]:row-start-1">
        {ways.flatMap((w) =>
          w.moments.map((m) => (
            <div key={`${w.id}-${m.week}`} className="pl-5">
              <NoteText where={m.when} moment={m} phase={phases[phaseAt(w, m.week)]} />
              <div className="mt-6 h-11" />
            </div>
          )),
        )}
      </div>

      {/* The note itself, hanging from the line (or spanning the width where it cannot hang). */}
      <div
        className={cn(
          "absolute top-8 w-full",
          hang === "full" && "left-0",
          hang === "right" && "left-(--x) max-w-[460px] pl-5",
          hang === "left" && "left-(--x) max-w-[460px] -translate-x-full pr-5",
          glide,
        )}
      >
        <div key={`${way.id}-${index}`} aria-live="polite" className={styles.swap}>
          <NoteText where={pointLabel(way, week, units)} moment={moment} phase={phase} />
        </div>
        <div className="mt-6 flex items-center gap-2">
          <button type="button" className={arrowButton} onClick={() => step(-1)} disabled={index === 0} aria-label={labels.previous}>
            <ArrowLeftIcon className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className={arrowButton}
            onClick={() => step(1)}
            disabled={index === way.moments.length - 1}
            aria-label={labels.next}
          >
            <ArrowRightIcon className="size-4" aria-hidden />
          </button>
          <span className="ml-1.5 font-mono text-[0.625rem] tracking-[0.08em] text-white/40 tabular-nums">
            {index + 1} / {way.moments.length}
          </span>
        </div>
      </div>
    </div>
  );
}

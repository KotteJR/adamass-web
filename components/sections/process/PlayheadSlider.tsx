"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/** The slider's resolution: a place on the line from 0 to 1, in thousandths. */
const STEPS = 1000;

type PlayheadSliderProps = {
  /** Where the playhead is, 0 to 1 across the frame. */
  place: number;
  onPlace: (place: number) => void;
  /** Our own keys (by week, by moment); return true when handled. */
  onKey: (key: string) => boolean;
  onDragging: (dragging: boolean) => void;
  label: string;
  valueText: string;
  className?: string;
};

/**
 * What moves the playhead, built on Radix Slider: pointer and touch dragging
 * with capture, a press anywhere in the frame to jump there, and a real slider
 * for keyboards and screen readers. It covers the whole frame and draws
 * nothing itself: its thumb has no size, so it sits exactly on its value, and
 * the playhead it moves is drawn once, by the timeline, from the frame down to
 * the note.
 */
export function PlayheadSlider({ place, onPlace, onKey, onDragging, label, valueText, className }: PlayheadSliderProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (onKey(event.key)) event.preventDefault();
  };
  return (
    <SliderPrimitive.Root
      value={[Math.round(place * STEPS)]}
      min={0}
      max={STEPS}
      step={1}
      onValueChange={([value]) => onPlace(value / STEPS)}
      onPointerDown={() => onDragging(true)}
      onPointerUp={() => onDragging(false)}
      onPointerCancel={() => onDragging(false)}
      onKeyDown={onKeyDown}
      className={cn("flex cursor-grab touch-none items-center select-none active:cursor-grabbing", className)}
    >
      <SliderPrimitive.Track className="relative h-full grow bg-transparent">
        <SliderPrimitive.Range className="hidden" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb aria-label={label} aria-valuetext={valueText} className="block size-0 outline-none" />
    </SliderPrimitive.Root>
  );
}

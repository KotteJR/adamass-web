"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FitStageProps = {
  /** The stage's design size in px. */
  width: number;
  height: number;
  /**
   * width: scale the whole stage to the box's width (the box sets the ratio).
   * height: scale to the box's height, never up, and let the stage's own
   * layout take the width that is left (and, below minWidth, the height).
   */
  fit?: "width" | "height";
  /** With fit="height": the narrowest the stage is laid out; a narrower box scales it down instead. */
  minWidth?: number;
  /** The scale before the box is measured (the server knows no sizes). */
  initialScale?: number;
  className?: string;
  style?: CSSProperties;
  /** On the scaled layer, for hover zoom (set --zoom) and its transition. */
  stageClassName?: string;
  children: ReactNode;
};

/**
 * Shows a stage drawn at a fixed size inside a fluid box, scaled to fit. The
 * scale lives in a CSS variable written straight to the DOM, so resizing
 * never re-renders the stage.
 */
export function FitStage({
  width,
  height,
  fit = "width",
  minWidth = 0,
  initialScale = 1,
  className,
  style,
  stageClassName,
  children,
}: FitStageProps) {
  const box = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    const update = () => {
      const { clientWidth: w, clientHeight: h } = element;
      if (!w || !h) return;
      const scale = fit === "width" ? w / width : Math.min(1, h / height, minWidth ? w / minWidth : 1);
      element.style.setProperty("--fit", String(scale));
      element.style.setProperty("--fit-w", fit === "width" ? `${width}px` : `${w / scale}px`);
      element.style.setProperty("--fit-h", fit === "width" ? `${height}px` : `${h / scale}px`);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, height, fit, minWidth]);

  return (
    <div ref={box} className={cn("relative overflow-hidden", className)} style={style}>
      <div
        className={cn("absolute top-0 left-0 origin-top-left", stageClassName)}
        style={{
          width: `var(--fit-w, ${width}px)`,
          height: `var(--fit-h, ${height}px)`,
          transform: `scale(calc(var(--fit, ${initialScale}) * var(--zoom, 1)))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

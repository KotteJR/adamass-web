"use client";

import { useEffect, useState } from "react";

/**
 * Smooth L→R “written” reveal: clips from the right so scroll progress maps to
 * continuous motion (no per-character jumps from slice + scrub).
 */
export default function ScrollRevealText({
  text,
  progress,
  className = "",
  showCaret = true,
}: {
  text: string;
  progress: number;
  className?: string;
  showCaret?: boolean;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const p = reducedMotion ? 1 : Math.max(0, Math.min(1, progress));
  const hiddenRight = (1 - p) * 100;
  const clip = `inset(0 ${hiddenRight}% 0 0)`;

  const caretOn =
    showCaret && !reducedMotion && p > 0.02 && p < 0.998 && text.length > 0;

  return (
    <span className={`relative inline-block max-w-full ${className}`}>
      <span
        className="inline-block max-w-full [contain:paint]"
        style={{
          clipPath: clip,
          WebkitClipPath: clip,
        }}
      >
        {text}
      </span>
      {caretOn ? (
        <span
          className="stream-caret pointer-events-none absolute top-[0.1em] h-[0.82em] w-[0.07em] min-w-[2px] max-w-[4px]"
          style={{ left: `${p * 100}%`, transform: "translateX(-90%)" }}
          aria-hidden
        />
      ) : null}
    </span>
  );
}

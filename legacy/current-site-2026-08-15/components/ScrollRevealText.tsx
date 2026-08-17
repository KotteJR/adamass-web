"use client";

import { useMemo } from "react";

export default function ScrollRevealText({
  text,
  progress,
  className = "",
}: {
  text: string;
  progress: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(/\s+/), [text]);
  const p = Math.max(0, Math.min(1, progress));

  return (
    <span className={`inline ${className}`}>
      {words.map((word, i) => {
        const wordStart = i / words.length;
        const wordEnd = (i + 1) / words.length;
        const wordProgress = Math.max(
          0,
          Math.min(1, (p - wordStart) / (wordEnd - wordStart))
        );

        return (
          <span
            key={i}
            className="inline-block mr-[0.27em] last:mr-0"
            style={{
              opacity: wordProgress,
              transform: `translateY(${(1 - wordProgress) * 8}px)`,
              transition: "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

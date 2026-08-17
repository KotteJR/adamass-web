"use client";

import { useEffect, useRef, useState } from "react";

const CELL = 18;
const DOT = 6;
const ROWS = 4;

export default function BentoDots({
  tuned = 11,
  total = 72,
  label,
}: {
  tuned?: number;
  total?: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(16);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => {
      const next = Math.max(8, Math.floor(node.clientWidth / CELL));
      setCols(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const filled = Math.max(1, Math.round((cols * tuned) / total));
  const width = cols * CELL;
  const height = ROWS * CELL;

  return (
    <div ref={ref} className="bento-dots" role="img" aria-label={label}>
      <svg width={width} height={height} aria-hidden>
        {Array.from({ length: ROWS * cols }, (_, index) => {
          const column = index % cols;
          const row = Math.floor(index / cols);
          return (
            <circle
              key={index}
              cx={column * CELL + CELL / 2}
              cy={row * CELL + CELL / 2}
              r={DOT}
              fill={column < filled ? "#0066FF" : "#C7DAF5"}
            />
          );
        })}
      </svg>
    </div>
  );
}

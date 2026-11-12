"use client";

import { useEffect, useState, type ReactNode } from "react";

type StepObserverProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Writes the index of the step crossing the middle of the viewport to
 * `data-active`. Browsers without scroll-driven animations use it to light
 * the step; all browsers use it to rest the figures that are faded out.
 */
export function StepObserver({ className, children }: StepObserverProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      // A thin band across the middle of the viewport.
      { rootMargin: "-49.5% 0px -49.5% 0px" },
    );
    node.querySelectorAll("[data-step-text]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [node]);

  return (
    <div ref={setNode} className={className} data-active={active}>
      {children}
    </div>
  );
}

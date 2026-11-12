"use client";

import type { ComponentProps } from "react";
import { useInView } from "@/hooks/use-in-view";

type RevealOnceProps = Omit<ComponentProps<"div">, "ref"> & {
  /** Share of the element that must be visible before it reveals. */
  threshold?: number;
};

/**
 * Sets `data-revealed` the first time the element scrolls into view, for
 * one-off entrance animations (chart bars, the end-screen mark).
 */
export function RevealOnce({ children, threshold = 0.3, ...props }: RevealOnceProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, threshold });
  return (
    <div ref={ref} data-revealed={inView || undefined} {...props}>
      {children}
    </div>
  );
}

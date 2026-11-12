"use client";

import type { ComponentProps } from "react";
import { useInView } from "@/hooks/use-in-view";

type PlayWhenVisibleProps = Omit<ComponentProps<"div">, "ref">;

/**
 * Sets `data-playing` while the element is near the viewport. The element's
 * CSS keeps its animations paused without it, so offscreen figures cost nothing.
 * Reduced motion is handled in CSS, so this stays a plain observer.
 */
export function PlayWhenVisible({ children, ...props }: PlayWhenVisibleProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: "120px 0px" });
  return (
    <div ref={ref} data-playing={inView || undefined} {...props}>
      {children}
    </div>
  );
}

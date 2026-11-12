"use client";

import { useCallback, useEffect, useState } from "react";

type InViewOptions = {
  /** Grow or shrink the viewport box, as in IntersectionObserver. */
  rootMargin?: string;
  threshold?: number;
  /** Stay true after the first time the element is seen. */
  once?: boolean;
};

/**
 * Tracks whether an element is in the viewport.
 * Returns a callback ref for the element and the current state.
 */
export function useInView<T extends Element>({
  rootMargin = "0px",
  threshold = 0,
  once = false,
}: InViewOptions = {}): [(node: T | null) => void, boolean] {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // Old browsers: behave as if always visible.
      queueMicrotask(() => setInView(true));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, rootMargin, threshold, once]);

  return [ref, inView];
}

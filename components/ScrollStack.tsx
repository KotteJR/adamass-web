"use client";

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

export type ScrollStackHandle = {
  setProgress: (progress: number) => void;
};

export function ScrollStackItem({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) {
  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
  );
}

type ScrollStackProps = {
  children: ReactNode;
  className?: string;
  itemScale?: number;
  itemStackDistance?: number;
  baseScale?: number;
};

const ScrollStack = forwardRef<ScrollStackHandle, ScrollStackProps>(
  function ScrollStack(
    {
      children,
      className = "",
      itemScale = 0.03,
      itemStackDistance = 30,
      baseScale = 0.92,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const heightsRef = useRef<number[]>([]);
    const maxHRef = useRef(0);
    const progressRef = useRef(0);
    const lastProgressRef = useRef(-1);
    const lastHeightRef = useRef("");
    const lastTransformsRef = useRef<string[]>([]);
    const itemScaleRef = useRef(itemScale);
    const peekRef = useRef(itemStackDistance);
    const baseScaleRef = useRef(baseScale);

    itemScaleRef.current = itemScale;
    peekRef.current = itemStackDistance;
    baseScaleRef.current = baseScale;

    const measure = () => {
      const cards = cardsRef.current;
      const heights = cards.map((card) => card.offsetHeight);
      heightsRef.current = heights;
      maxHRef.current = heights.reduce((max, height) => Math.max(max, height), 0);
    };

    const apply = (force = false) => {
      const root = rootRef.current;
      const cards = cardsRef.current;
      const count = cards.length;
      if (!root || !count) return;

      const progress = Math.max(0, Math.min(1, progressRef.current));
      if (!force && Math.abs(progress - lastProgressRef.current) < 0.0008) return;
      lastProgressRef.current = progress;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const height = `${maxHRef.current}px`;
        if (lastHeightRef.current !== height) {
          lastHeightRef.current = height;
          root.style.height = height;
        }
        cards.forEach((card, index) => {
          if (lastTransformsRef.current[index] === "") return;
          lastTransformsRef.current[index] = "";
          card.style.transform = "";
        });
        return;
      }

      const peek = peekRef.current;
      const holdWeight = 1.15;
      const travelWeight = 0.85;
      const totalUnits =
        count * holdWeight + Math.max(count - 1, 0) * travelWeight;
      const cursor = progress * totalUnits;
      const arrivals = cards.map((_, index) => {
        if (index === 0) return 1;
        const transitionStart =
          index * holdWeight + (index - 1) * travelWeight;
        return Math.max(
          0,
          Math.min(1, (cursor - transitionStart) / travelWeight),
        );
      });
      const maxH = maxHRef.current;
      let dockH = 0;

      cards.forEach((card, index) => {
        const height = heightsRef.current[index] || maxH;
        const arrive = arrivals[index];
        let translateY = 0;
        let scale = 1;

        if (arrive <= 0) {
          translateY = maxH + 40;
        } else if (arrive < 1) {
          translateY = (1 - arrive) * (maxH + 40);
          dockH = Math.max(dockH, height * arrive);
        } else {
          const depth = arrivals
            .slice(index + 1)
            .reduce((sum, nextArrival) => sum + nextArrival, 0);
          scale = Math.max(baseScaleRef.current, 1 - depth * itemScaleRef.current);
          translateY = -peek * depth + (1 - scale) * height;
          dockH = Math.max(dockH, height);
        }

        const transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        if (lastTransformsRef.current[index] !== transform) {
          lastTransformsRef.current[index] = transform;
          card.style.transform = transform;
        }
      });

      const nextHeight = `${Math.max(dockH, heightsRef.current[0] ?? 0)}px`;
      if (lastHeightRef.current !== nextHeight) {
        lastHeightRef.current = nextHeight;
        root.style.height = nextHeight;
      }
    };

    useImperativeHandle(ref, () => ({
      setProgress(progress: number) {
        progressRef.current = progress;
        apply();
      },
    }));

    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const cards = Array.from(
        root.querySelectorAll<HTMLElement>(":scope > .scroll-stack-card"),
      );
      cardsRef.current = cards;
      lastTransformsRef.current = cards.map(() => "");
      cards.forEach((card) => {
        card.style.transformOrigin = "top center";
      });

      measure();
      apply(true);

      const observer = new ResizeObserver(() => {
        measure();
        apply(true);
      });
      observer.observe(root);
      cards.forEach((card) => observer.observe(card));

      return () => {
        observer.disconnect();
      };
    }, [children]);

    return (
      <div ref={rootRef} className={`scroll-stack ${className}`.trim()}>
        {children}
      </div>
    );
  },
);

export default ScrollStack;

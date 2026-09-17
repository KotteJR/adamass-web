"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { MarketplaceGlyph as GlyphKind } from "@/lib/marketplace";

type Pixel = "." | "m" | "s";

const marks: Record<GlyphKind, Pixel[][]> = {
  foundation: [
    "mmmmmmmmmmmmmmmm",
    ".mmmm.mmmm.mmmm.",
    ".mmmm.mmmm.mmmm.",
    ".mmmm.mmmm.mmmm.",
    "mmmmmmmmmmmmmmmm",
    "ssssssssssssssss",
    "..ssssssssssss..",
  ].map((row) => [...row] as Pixel[]),
  architect: [
    "......mmmm......",
    "....mmmmmmmm....",
    "..mmmmmmmmmmmm..",
    "mmmmmmmmmmmmmmmm",
    ".mm.mm.mm.mm.mm.",
    ".mm.mm.mm.mm.mm.",
    ".mm.mm.mm.mm.mm.",
    "ssssssssssssssss",
  ].map((row) => [...row] as Pixel[]),
  perimeter: [
    ".mmmmmm.........",
    "mm....mm........",
    "mm....mm........",
    ".mmmmmm.........",
    "...mm...........",
    "...mmmmmmmmmmmmm",
    "...mm..ss.ss.ss.",
    "...mm..ss.ss.ss.",
  ].map((row) => [...row] as Pixel[]),
};

function Cell({ tone }: { tone: Exclude<Pixel, "."> }) {
  return (
    <span className={tone === "s" ? "market-cell is-signal" : "market-cell"} />
  );
}

function Mark({ kind }: { kind: GlyphKind }) {
  return (
    <div className="market-glyph-mark">
      {marks[kind].map((row, y) => (
        <div key={y} className="market-glyph-row">
          {row.map((pixel, x) =>
            pixel === "." ? (
              <span key={x} className="market-cell is-empty" />
            ) : (
              <Cell key={x} tone={pixel} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

export default function MarketplaceGlyph({ kind }: { kind: GlyphKind }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const units = root.querySelectorAll<HTMLElement>(
      ".market-cell:not(.is-empty)",
    );
    if (!units.length) return;

    gsap.set(units, { opacity: 0.2, scale: 0.78 });

    const play = () => {
      gsap.to(units, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        stagger: {
          each: 0.012,
          from: kind === "architect" ? "start" : "center",
        },
        ease: "power2.out",
        overwrite: true,
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(units);
    };
  }, [kind]);

  return (
    <div ref={rootRef} className="market-glyph" aria-hidden>
      <Mark kind={kind} />
    </div>
  );
}

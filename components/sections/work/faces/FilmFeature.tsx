"use client";

import { useEffect, useRef, useState } from "react";
import { MorrowFilm } from "@/components/products/stages/MorrowFilm";

/**
 * Morrow's face: one of its games' 3D films over the card's painting. The still
 * rests on the card; pointing at or focusing the card plays the film once from
 * its start, as Morrow's own game cards do. Reduced motion keeps the still.
 */
export function FilmFeature({ id }: { id: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const card = box.current?.closest("article");
    if (!card) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    card.addEventListener("pointerenter", on);
    card.addEventListener("pointerleave", off);
    card.addEventListener("focusin", on);
    card.addEventListener("focusout", off);
    return () => {
      card.removeEventListener("pointerenter", on);
      card.removeEventListener("pointerleave", off);
      card.removeEventListener("focusin", on);
      card.removeEventListener("focusout", off);
    };
  }, []);

  return (
    <div ref={box} className="absolute top-[390px] left-1/2 h-[405px] w-[540px] -translate-x-1/2 -translate-y-1/2">
      <MorrowFilm id={id} playing={playing} bare />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { ClientLogoAsset } from "@/content/clients";
import { useInView } from "@/hooks/use-in-view";
import { usePageVisible } from "@/hooks/use-page-visible";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ClientLogo } from "./ClientLogo";

/** Matches --animate-logo-in / --animate-logo-out in globals.css. */
const FADE_MS = 1100;
/** How long a set stays before the next one fades in. */
const HOLD_MS = 4000;

type SlotStep = { readonly minWidth: number; readonly slots: number };

/** How many slots are visible now, from width steps ordered widest first. */
function useSlots(fallback: number, steps?: readonly SlotStep[]) {
  const [slots, setSlots] = useState(fallback);
  useEffect(() => {
    if (!steps?.length) return;
    const pick = () => {
      const step = steps.find((s) => window.innerWidth >= s.minWidth) ?? steps[steps.length - 1];
      setSlots(Math.min(fallback, step.slots));
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, [fallback, steps]);
  return slots;
}

type ClientLogosProps = {
  logos: readonly ClientLogoAsset[];
  /** Names the list for assistive tech, which gets every client at once. */
  label: string;
  /** Logos per set. A layout may hide trailing slots on small screens. */
  slots?: number;
  /** Fewer visible slots on narrower screens (widest first); sets then rotate through only those. */
  slotSteps?: readonly SlotStep[];
  className?: string;
  slotClassName?: string;
};

/**
 * A row of client logos. Not a marquee: the whole set crossfades to the next
 * set together, then holds. Each set continues where the last one ended, so
 * every client comes round. Rests offscreen, in background tabs and for
 * reduced motion.
 */
export function ClientLogos({ logos, label, slots: maxSlots = 5, slotSteps, className, slotClassName }: ClientLogosProps) {
  const [set, setSet] = useState(0);
  const slots = useSlots(maxSlots, slotSteps);
  const [ref, inView] = useInView<HTMLDivElement>();
  const pageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const count = logos.length;
  const running = inView && pageVisible && !reducedMotion && count > slots;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSet((s) => s + 1), FADE_MS + HOLD_MS);
    return () => window.clearInterval(timer);
  }, [running]);

  const logoAt = (s: number, slot: number) => logos[(s * slots + slot) % count];

  return (
    <div ref={ref} className={className}>
      <ul className="sr-only" aria-label={label}>
        {logos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
      {Array.from({ length: Math.min(maxSlots, count) }, (_, slot) => (
        <div key={slot} aria-hidden className={cn("relative grid grid-cols-1 place-items-center", slotClassName)}>
          {set > 0 ? (
            <ClientLogo
              key={`out-${set}`}
              logo={logoAt(set - 1, slot)}
              className="absolute max-w-full animate-logo-out motion-reduce:hidden"
            />
          ) : null}
          <ClientLogo
            key={`in-${set}`}
            logo={logoAt(set, slot)}
            className={cn("max-w-full", set > 0 && "animate-logo-in motion-reduce:animate-none")}
          />
        </div>
      ))}
    </div>
  );
}

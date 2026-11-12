"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Scrolls smaller than this, between two frames, leave the header as it is: no flicker on a nudge or a bounce. */
const JITTER_PX = 6;
/** How long a scroll must pause before an in-page jump counts as landed. */
const LANDED_MS = 150;

/**
 * The header's bar. At the top of the page it sits in place with no ground. It
 * slides away as you scroll down and comes back as soon as you scroll up, on a
 * soft paper ground with a hairline under it. A jump from an in-page link keeps
 * it away until the page lands, so it never covers the heading it scrolled to.
 * It also comes back whenever something in it takes keyboard focus.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const bar = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    let jumping = false;
    let landed = 0;
    const read = () => {
      frame = 0;
      // Clamped, so the rubber-band bounce past either end of the page reads as no scroll at all.
      const end = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(end, Math.max(0, window.scrollY));
      setAtTop(y <= 4);
      if (jumping) {
        last = y;
        return;
      }
      if (Math.abs(y - last) < JITTER_PX) return;
      setHidden(y > last && y > (bar.current?.offsetHeight ?? 76));
      last = y;
    };
    const land = (ms: number) => {
      window.clearTimeout(landed);
      landed = window.setTimeout(() => (jumping = false), ms);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
      if (jumping) land(LANDED_MS);
    };
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      jumping = true;
      setHidden(true);
      // Released when the scroll pauses; if the page does not move at all, after a second.
      land(1000);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      window.clearTimeout(landed);
    };
  }, []);

  return (
    <header
      ref={bar}
      className={cn(
        "sticky top-0 z-40 pt-[env(safe-area-inset-top)] transition-[translate,background-color,box-shadow] duration-300 ease-out-soft motion-reduce:transition-none",
        hidden && "-translate-y-full focus-within:translate-y-0",
        !atTop && "bg-background/85 shadow-[0_1px_0_rgb(16_24_40/0.06)] backdrop-blur-md",
      )}
    >
      {children}
    </header>
  );
}

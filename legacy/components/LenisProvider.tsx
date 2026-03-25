"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/** Tuned for GSAP-pinned scrub: smoother wheel → scroll coupling + gentle settle. */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      /** Higher lerp = scroll position eases more smoothly into place */
      lerp: 0.085,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.12,
      syncTouch: true,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      scrollHeight: () => document.documentElement.scrollHeight,
    });

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    };
  }, []);

  return <>{children}</>;
}

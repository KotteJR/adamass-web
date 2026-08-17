"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, scrollToId } from "@/lib/lenis-bridge";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      smoothWheel: true,
    });

    setLenis(lenis);

    const onScroll = () => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent("adamass:scroll", {
          detail: {
            scroll: lenis.scroll,
            direction: lenis.direction,
          },
        }),
      );
    };

    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", onScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      requestAnimationFrame(() => scrollToId(hash));
    }

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return children;
}

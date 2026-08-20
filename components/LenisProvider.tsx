"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, scrollToId } from "@/lib/lenis-bridge";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function syncAppHeight() {
  const height = Math.round(
    window.visualViewport?.height ?? window.innerHeight,
  );
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    syncAppHeight();
    window.visualViewport?.addEventListener("resize", syncAppHeight);
    window.addEventListener("orientationchange", syncAppHeight);

    const phone = window.matchMedia("(max-width: 767px)").matches;
    const hash = window.location.hash.replace("#", "");

    if (phone) {
      ScrollTrigger.refresh();
      if (hash) {
        requestAnimationFrame(() => scrollToId(hash));
      }

      return () => {
        window.visualViewport?.removeEventListener("resize", syncAppHeight);
        window.removeEventListener("orientationchange", syncAppHeight);
      };
    }

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

    if (hash) {
      requestAnimationFrame(() => scrollToId(hash));
    }

    return () => {
      window.visualViewport?.removeEventListener("resize", syncAppHeight);
      window.removeEventListener("orientationchange", syncAppHeight);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return children;
}

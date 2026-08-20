"use client";

import type { MouseEvent } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import AdamassLogo from "./AdamassLogo";
import ContactModalTrigger from "./ContactModal";
import { scrollToId, scrollToTop } from "@/lib/lenis-bridge";

const SHOW_EDGE = 88;
const HIDE_AFTER = 36;
const SHOW_AFTER = 20;

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const invertTargets = Array.from(
      document.querySelectorAll(".film-stage, .contact-section"),
    );
    const visible = new Set<Element>();

    const syncOverFilm = () => {
      const invert = Array.from(visible).some((target) => {
        if (target.classList.contains("contact-section")) return true;
        const journey = target.closest(".film-journey");
        return journey?.getAttribute("data-wash-plate") !== "true";
      });
      header.dataset.overFilm = invert ? "true" : "false";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        syncOverFilm();
      },
      { threshold: 0.45 },
    );
    invertTargets.forEach((target) => observer.observe(target));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previous = 0;
    let hidden = false;
    let travel = 0;
    let lastDirection = 0;
    let maxScroll = 0;

    const measureScroll = () => {
      maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );
    };
    measureScroll();
    const resizeObserver = new ResizeObserver(measureScroll);
    resizeObserver.observe(document.documentElement);

    const setHidden = (next: boolean) => {
      if (hidden === next) return;
      hidden = next;
      header.dataset.hidden = next ? "true" : "false";
    };

    const update = (event: Event) => {
      if (reduced.matches || document.documentElement.dataset.modal === "open") {
        setHidden(false);
        travel = 0;
        return;
      }

      const { scroll, direction } = (
        event as CustomEvent<{ scroll: number; direction: number }>
      ).detail;
      const delta = scroll - previous;
      previous = scroll;
      const atEnd = maxScroll > 0 && scroll >= maxScroll - 48;

      if (scroll < SHOW_EDGE || atEnd) {
        travel = 0;
        lastDirection = 0;
        setHidden(false);
        return;
      }

      if (direction === 0 || Math.abs(delta) < 0.4) return;

      if (direction !== lastDirection) {
        travel = 0;
        lastDirection = direction;
      }

      travel += Math.abs(delta);

      if (direction > 0 && travel > HIDE_AFTER) {
        setHidden(true);
      } else if (direction < 0 && travel > SHOW_AFTER) {
        setHidden(false);
      }

      syncOverFilm();
    };

    window.addEventListener("adamass:scroll", update);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("adamass:scroll", update);
    };
  }, []);

  const goTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!document.getElementById(id)) return;
    event.preventDefault();
    scrollToId(id);
  };

  return (
    <header ref={headerRef} className="site-header" data-hidden="false" data-over-film="false">
      <nav className="site-nav" aria-label="Main navigation">
        <Link
          className="site-wordmark"
          href="/"
          aria-label="Adamass home"
          onClick={(event) => {
            if (window.location.pathname !== "/") return;
            event.preventDefault();
            scrollToTop();
          }}
        >
          <AdamassLogo decorative />
        </Link>

        <div className="site-nav-links" aria-label="Page sections">
          <a href="/#practice" onClick={goTo("practice")}>
            Practice
          </a>
          <a href="/#work" onClick={goTo("work")}>
            Work
          </a>
          <ContactModalTrigger />
        </div>
      </nav>
    </header>
  );
}

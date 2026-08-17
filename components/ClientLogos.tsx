"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const logos: {
  src: string;
  alt: string;
  screen?: boolean;
  boost?: boolean;
  color?: boolean;
  badge?: boolean;
  crest?: boolean;
}[] = [
  { src: "/client-logos/ikea.png?v=6", alt: "IKEA", color: true, badge: true },
  { src: "/client-logos/nasdaq.png", alt: "Nasdaq" },
  { src: "/client-logos/tele2.svg", alt: "Tele2" },
  { src: "/client-logos/guardian.svg?v=4", alt: "The Guardian", boost: true },
  { src: "/client-logos/thomson-reuters.png", alt: "Thomson Reuters" },
  { src: "/client-logos/liverpool.png?v=7", alt: "Liverpool FC", color: true, crest: true },
  { src: "/client-logos/eyeradar.svg", alt: "EyeRadar" },
  { src: "/client-logos/rething.svg", alt: "Rething" },
  { src: "/client-logos/boksy.png", alt: "Boksy" },
  { src: "/client-logos/stabenfeldt.png", alt: "Stabenfeldt", screen: true },
  { src: "/client-logos/zoion.png", alt: "Zoion" },
  { src: "/client-logos/thefuturecats.webp", alt: "The Future Cats" },
];

export default function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.dataset.inView = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "80px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="client-proof"
      aria-labelledby="client-proof-title"
      data-in-view="false"
    >
      <div className="client-proof-copy">
        <h2 id="client-proof-title" className="client-proof-title">
          Organisations we can name in public.
        </h2>
      </div>
      <ul>
        {logos.map((logo, index) => (
          <li
            key={logo.src}
            style={{
              animationDuration: `${20 + (index % 5) * 2.4}s`,
              animationDelay: `${(index * 0.8) % 6}s`,
            }}
          >
            <span
              className={[
                "client-proof-mark",
                logo.boost ? "is-boost" : "",
                logo.badge ? "is-badge" : "",
                logo.crest ? "is-crest" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                unoptimized={logo.src.includes(".svg")}
                sizes="(max-width: 640px) 18vw, 8vw"
                className={
                  logo.screen ? "is-screen" : logo.color ? "is-color" : undefined
                }
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

const GUARDIAN_SRC = "/client-logos/the-guardian-2-logo-svg-vector.svg";

/** One row per client — no duplicates */
const LOGOS: { src: string; alt: string }[] = [
  { src: "/client-logos/boksyse-CM0V_JHD.png", alt: "Boksy" },
  { src: "/client-logos/Eye_Radar-RGB-colour-1.svg", alt: "EyeRadar" },
  { src: "/client-logos/Ikea_logo.svg.png", alt: "IKEA" },
  { src: "/client-logos/Liverpool_FC.svg.png", alt: "Liverpool FC" },
  { src: "/client-logos/NASDAQ_Logo.svg.png", alt: "Nasdaq" },
  { src: "/client-logos/rething.svg", alt: "Rething" },
  { src: "/client-logos/Stabenfeldt-CX0cCLzr.png", alt: "Stabenfeldt" },
  { src: "/client-logos/tele2-logo.svg", alt: "Tele2" },
  { src: GUARDIAN_SRC, alt: "The Guardian" },
  {
    src: "/client-logos/thefuture-cats-main-logo-001.png.webp",
    alt: "The Future Cats",
  },
  { src: "/client-logos/Thomson_Reuters_logo.svg.png", alt: "Thomson Reuters" },
  { src: "/client-logos/zoion-logo-DTGNPLfg.png", alt: "Zoion" },
];

/** Only The Guardian is enlarged vs the shared small base */
const GUARDIAN_BOOST = 1.82;

function imageClassFor(src: string) {
  if (src.includes("Stabenfeldt-CX0cCLzr")) {
    return "object-contain object-center grayscale contrast-[1.38] brightness-[0.52] opacity-[0.92]";
  }
  return "object-contain object-center grayscale contrast-[1.12] brightness-[0.93] opacity-[0.58]";
}

const DOT_SPACING = 10;
const DOT_RADIUS = 0.65;
const DOT_COLOR = "rgba(100, 116, 139, 0.18)";

export default function ClientLogoBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paintDots = useCallback(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const { width, height } = section.getBoundingClientRect();
    if (width < 1 || height < 1) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = DOT_COLOR;

    for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
      for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    paintDots();
    const section = sectionRef.current;
    if (!section) return;

    const ro = new ResizeObserver(() => paintDots());
    ro.observe(section);
    window.addEventListener("resize", paintDots);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", paintDots);
    };
  }, [paintDots]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-x-clip border-y border-[rgba(10,10,10,0.06)] bg-white py-12 md:py-16"
      aria-label="Selected clients and partners"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 block h-full min-h-full w-full min-w-full"
        aria-hidden
      />

      <div className="relative z-[1] w-full px-2 sm:px-4 md:px-5 lg:px-7 xl:px-9">
        <ul className="m-0 grid w-full list-none grid-cols-6 grid-rows-2 gap-x-2 gap-y-6 p-0 sm:gap-x-3 sm:gap-y-8 md:gap-x-4 md:gap-y-9 lg:gap-x-5 lg:gap-y-10">
          {LOGOS.map((logo, i) => {
            const duration = 11 + (i % 5) * 1.35;
            const delay = (i * 0.62) % 4.8;
            const guardian = logo.src === GUARDIAN_SRC;
            return (
              <li
                key={logo.src}
                className="client-logo-band-item flex min-h-0 min-w-0 items-center justify-center overflow-visible"
                style={{
                  animation: `logo-float ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              >
                <div
                  className="relative h-[1.05rem] w-full min-w-0 sm:h-[1.2rem] md:h-6 lg:h-[1.65rem]"
                  style={
                    guardian
                      ? {
                          transform: `scale(${GUARDIAN_BOOST})`,
                          transformOrigin: "center center",
                        }
                      : undefined
                  }
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    className={imageClassFor(logo.src)}
                    sizes="(max-width: 640px) 14vw, (max-width: 1024px) 12vw, 10vw"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

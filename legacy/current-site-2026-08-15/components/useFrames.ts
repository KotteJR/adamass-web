"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL = 192;

function paths(dir: string): string[] {
  return Array.from({ length: TOTAL }, (_, i) => {
    const n = String(i + 1).padStart(4, "0");
    return `/${dir}/frame_${n}.jpg`;
  });
}

export function useFrames(dir: string) {
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let cancelled = false;
    const srcs = paths(dir);
    const imgs: HTMLImageElement[] = [];
    let count = 0;

    srcs.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      imgs[i] = img;

      const done = () => {
        count++;
        if (!cancelled && count >= TOTAL) {
          imagesRef.current = imgs;
          setLoaded(true);
        }
      };

      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });

    return () => {
      cancelled = true;
    };
  }, [dir]);

  return { loaded, images: imagesRef, total: TOTAL };
}

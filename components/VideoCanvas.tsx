"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface VideoCanvasHandle {
  drawFrame: (index: number) => void;
}

interface Props {
  images: React.RefObject<HTMLImageElement[]>;
  total: number;
  className?: string;
}

const VideoCanvas = forwardRef<VideoCanvasHandle, Props>(function VideoCanvas(
  { images, total, className = "" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cssRef = useRef({ w: 0, h: 0 });

  const paint = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, h } = cssRef.current;
      if (w <= 0 || h <= 0) return;

      const i = Math.max(0, Math.min(total - 1, index));
      const img = images.current?.[i];
      if (!img?.complete || !img.naturalWidth) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, dx, dy, dw, dh);
    },
    [images, total]
  );

  const lastFrameRef = useRef(-1);

  const drawFrame = useCallback(
    (index: number) => {
      if (index === lastFrameRef.current) return;
      lastFrameRef.current = index;
      paint(index);
    },
    [paint]
  );

  useImperativeHandle(ref, () => ({ drawFrame }), [drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      cssRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 block h-full w-full ${className}`}
      aria-hidden
    />
  );
});

export default VideoCanvas;

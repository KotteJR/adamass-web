/** Must match public/frames/ and public/framesv2/ frame counts (see scripts/extract-frames.sh) */
export const TOTAL_FRAMES = 192;

/** Forward pin length — higher = slower, calmer scrub */
export const FORWARD_PIN_VH = 1780;

/** Reverse fog + deeper story + CTA */
export const REVERSE_PIN_VH = 1240;

/** Intro hint: first N vh of forward pin */
export const INTRO_SCROLL_VH = 100;

/** Wider crossfades = less “stop and read” between beats */
export const FADE_ZONE = 0.078;

/** Old combined timeline used 0–0.7 for forward; map forward pin p via this */
export const FORWARD_OVERLAY_SCALE = 0.7;

export function getSectionOpacity(
  enter: number,
  exit: number,
  p: number,
  fadeZone: number = FADE_ZONE
): number {
  if (p < enter || p > exit) return 0;
  if (p < enter + fadeZone) return (p - enter) / fadeZone;
  if (p > exit - fadeZone) return (exit - p) / fadeZone;
  return 1;
}

export function framePath(index: number): string {
  const n = String(index + 1).padStart(4, "0");
  return `/frames/frame_${n}.jpg`;
}

/** Second sequence — reverse scroll section (adamassv2 / framesv2) */
export function framePathV2(index: number): string {
  const n = String(index + 1).padStart(4, "0");
  return `/framesv2/frame_${n}.jpg`;
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cssW: number,
  cssH: number
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const scale = Math.max(cssW / iw, cssH / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cssW - dw) / 2;
  const dy = (cssH - dh) / 2;

  ctx.clearRect(0, 0, cssW, cssH);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function staggeredLineOpacity(
  p: number,
  sectionOpacity: number,
  lineIndex: number,
  sectionEnter: number,
  step: number
): number {
  const start = sectionEnter + lineIndex * step;
  const fade = 0.025;
  let o = 0;
  if (p >= start + fade) o = 1;
  else if (p > start) o = (p - start) / fade;
  return o * sectionOpacity;
}

export function easeOutCubic(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return 1 - (1 - x) ** 3;
}

/** Map sub-range of local timeline → 0…1 (e.g. typing phases) */
export function segmentEase(
  localT: number,
  start: number,
  end: number
): number {
  if (localT <= start) return 0;
  if (localT >= end) return 1;
  return easeOutCubic((localT - start) / (end - start));
}

/**
 * Linear 0→1 within [start,end] — use for scroll-locked reveals (clip-path)
 * so motion tracks scroll 1:1 without extra easing jitter.
 */
export function linearSegment(
  localT: number,
  start: number,
  end: number
): number {
  if (localT <= start) return 0;
  if (localT >= end) return 1;
  return (localT - start) / (end - start);
}

/** Slide index + local progress for N slides from normalized section vIn ∈ [0,1] */
export function segmentSlideFromV(
  vIn: number,
  slideCount: number
): { index: number; localT: number } {
  const n = Math.max(1, slideCount);
  const x = Math.max(0, Math.min(1, vIn)) * n;
  const index = Math.min(n - 1, Math.max(0, Math.floor(x - 1e-6)));
  const localT = x - index;
  return { index, localT };
}


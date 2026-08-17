import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

const easeOut = (time: number) => 1 - (1 - time) ** 3;

export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.scrollTo(target, { offset: 0, duration: 1.15, easing: easeOut });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.15, easing: easeOut });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function setLenisPaused(paused: boolean) {
  if (!instance) return;
  if (paused) instance.stop();
  else instance.start();
}

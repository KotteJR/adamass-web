"use client";

import { useSyncExternalStore } from "react";

const clock = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const pad = (n: number) => String(n).padStart(2, "0");

/** Time left until midnight in Stockholm, when Morrow's new set arrives. */
function untilMidnight() {
  const [h, m, s] = clock.format(new Date()).split(":").map(Number);
  const left = 86_400 - (h * 3600 + m * 60 + s);
  return `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left / 60) % 60)}:${pad(left % 60)}`;
}

function subscribe(onTick: () => void) {
  const timer = window.setInterval(onTick, 1000);
  return () => window.clearInterval(timer);
}

/** "New set in 07:12:09", ticking each second. The server renders a placeholder. */
export function MidnightCountdown() {
  const left = useSyncExternalStore(subscribe, untilMidnight, () => "--:--:--");
  return <>{left}</>;
}

"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Stockholm",
  weekday: "short",
  day: "numeric",
  month: "short",
});

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

/** Today in Stockholm, "Wed 11 Nov", as Murmur's header shows it. Empty on the server. */
export function StockholmDate() {
  const date = useSyncExternalStore(subscribe, () => format.format(new Date()), () => "");
  return <>{date}</>;
}

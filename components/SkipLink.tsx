"use client";

import type { MouseEvent } from "react";
import { scrollToId } from "@/lib/lenis-bridge";

export default function SkipLink() {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!document.getElementById("main-content")) return;
    event.preventDefault();
    scrollToId("main-content");
    document.getElementById("main-content")?.focus();
  };

  return (
    <a className="skip-link" href="#main-content" onClick={onClick}>
      Skip to content
    </a>
  );
}

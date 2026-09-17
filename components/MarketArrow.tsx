"use client";

import { ArrowRight } from "@phosphor-icons/react";

export default function MarketArrow({ size = 16 }: { size?: number }) {
  return (
    <span className="market-arrow" aria-hidden>
      <ArrowRight size={size} weight="bold" />
    </span>
  );
}

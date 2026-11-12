import type { ReactNode } from "react";
import { Painting } from "@/components/brand/Painting";

/**
 * One painting behind How we work and the end screen, so the dark process
 * section can dissolve into the light end of the page instead of meeting it at an edge.
 */
export function ClosingBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate bg-painting">
      <Painting name="tall" drift="slow" className="-z-10" />
      {children}
    </div>
  );
}

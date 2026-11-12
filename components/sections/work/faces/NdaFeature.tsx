import { LockIcon } from "lucide-react";

/** Widths of the redacted lines, in px on the 600 x 780 stage. */
const LINES = [300, 236, 270, 184, 252];

/** Work under NDA: a lock over redacted lines. */
export function NdaFeature() {
  return (
    <>
      <LockIcon className="absolute top-[248px] left-[272px] size-14" strokeWidth={1.5} />
      {LINES.map((width, k) => (
        <span
          key={k}
          className={k === 0 ? "absolute h-4 rounded-[4px] bg-white/50" : "absolute h-4 rounded-[4px] bg-white/28"}
          style={{ left: 300 - width / 2, top: 360 + k * 34, width }}
        />
      ))}
    </>
  );
}

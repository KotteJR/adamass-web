import { LockIcon } from "lucide-react";
import { DrawnMark } from "@/components/brand/DrawnMark";
import { Painting } from "@/components/brand/Painting";
import type { CardFace } from "@/content/work";
import { FaceLayers } from "./FaceLayers";

const LINES = [170, 130, 152];

/** The ask card's face on phones: the same ink painting, wide and 220 px tall, at its real size. */
export function NdaBanner({ face }: { face: CardFace }) {
  return (
    <div aria-hidden className="relative isolate h-[220px] overflow-hidden rounded-xl text-white">
      <Painting name={face.painting} position={face.position} drift="none" sizes="100vw" />
      <FaceLayers face={face} />
      <LockIcon className="absolute top-[70px] left-1/2 size-[30px] -translate-x-1/2" strokeWidth={1.6} />
      {face.mark ? <DrawnMark className="absolute right-4 bottom-4 w-9 text-white/55" /> : null}
      {LINES.map((width, k) => (
        <span
          key={k}
          className={k === 0 ? "absolute left-1/2 h-2 -translate-x-1/2 rounded-[3px] bg-white/50" : "absolute left-1/2 h-2 -translate-x-1/2 rounded-[3px] bg-white/28"}
          style={{ top: 118 + k * 17, width }}
        />
      ))}
    </div>
  );
}

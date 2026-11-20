import Image from "next/image";
import shellLines from "@/assets/studio/shell-lines.png";

/**
 * Adamass Studio's face: a close-up of a real kit's numbered template (The
 * Shell Stair, medium detail), its outlines and numbers in white on the painting.
 */
export function LinesFeature() {
  return (
    <div className="absolute top-[390px] left-1/2 h-[425px] w-[450px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px]">
      <Image src={shellLines} alt="" fill sizes="(min-width: 1280px) 16vw, 40vw" className="object-cover opacity-90" />
    </div>
  );
}

import type { CardFace } from "@/content/work";

/** Over the painting: the accent (keeps the painting's light, takes the accent's hue), then a soft darkening. */
export function FaceLayers({ face }: { face: CardFace }) {
  const [top, bottom] = face.shade;
  return (
    <>
      {face.accent ? (
        <div
          className="absolute inset-0 mix-blend-color"
          style={{ backgroundColor: face.accent.color, opacity: face.accent.strength }}
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, rgb(10 14 22 / ${top}) 0%, rgb(10 14 22 / ${bottom}) 100%)` }}
      />
    </>
  );
}

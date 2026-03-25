"use client";

interface Props {
  label: string;
  title: string;
  body: string;
  /** 0→1: controls fade-in of text content */
  contentReveal: number;
  /** 0→1: slides dock up from below viewport */
  slideUp: number;
}

export default function BottomDock({
  label,
  title,
  body,
  contentReveal,
  slideUp,
}: Props) {
  const r = Math.max(0, Math.min(1, contentReveal));
  const textOp = Math.max(0, Math.min(1, (r - 0.05) / 0.35));
  const bodyOp = Math.max(0, Math.min(1, (r - 0.15) / 0.4));
  const titleY = (1 - Math.min(1, r * 1.4)) * 16;
  const bodyY = (1 - Math.min(1, Math.max(0, (r - 0.1) * 1.4))) * 16;

  return (
    <div
      className="bottom-dock absolute inset-x-0 bottom-0 z-[5] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.1)]"
      style={{
        transform: `translateY(${(1 - Math.max(0, Math.min(1, slideUp))) * 100}%)`,
      }}
    >
      <div className="mx-auto grid max-w-[1200px] gap-6 px-5 py-7 md:grid-cols-[1fr_1fr] md:items-start md:gap-20 md:px-12 md:py-10">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--gray-mid)]">
            {label}
          </p>
          <h3
            className="mt-3 font-sans text-[clamp(1.15rem,2.4vw,1.6rem)] font-semibold leading-snug tracking-[-0.03em] text-[var(--black)]"
            style={{
              opacity: textOp,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {title}
          </h3>
        </div>
        <p
          className="font-sans text-[14px] leading-[1.8] text-[var(--gray-dark)] md:text-[15px]"
          style={{
            opacity: bodyOp,
            transform: `translateY(${bodyY}px)`,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

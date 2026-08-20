import type { ReactNode } from "react";

type AdamassLogoProps = {
  variant?: "primary" | "reversed" | "knockout" | "deep";
  icon?: boolean;
  className?: string;
  label?: string;
  decorative?: boolean;
};

const letters = [
  ["a", "-0.042em"],
  ["d", "-0.042em"],
  ["a", "-0.024em"],
  ["m", "-0.042em"],
  ["a", "-0.048em"],
  ["s", "-0.058em"],
  ["s", "-0.02em"],
] as const;

function Bracket({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className="adamass-logo__bracket"
      viewBox="0 0 30 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={side === "left" ? "M27 5H7V95H27" : "M3 5H23V95H3"}
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function AdamassBracketMark({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span className={`adamass-mark ${className}`.trim()} aria-hidden>
      <Bracket side="left" />
      <span className="adamass-mark__slot">{children}</span>
      <Bracket side="right" />
    </span>
  );
}

export default function AdamassLogo({
  variant = "primary",
  icon = false,
  className = "",
  label = "Adamass AB",
  decorative = false,
}: AdamassLogoProps) {
  const classes = [
    "adamass-logo",
    `adamass-logo--${variant}`,
    icon ? "adamass-logo--icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <Bracket side="left" />
      <span className="adamass-logo__word" aria-hidden="true">
        {(icon ? [["a", "0em"]] : letters).map(([letter, spacing], index) => (
          <span
            key={`${letter}-${index}`}
            style={{ letterSpacing: spacing }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span className="adamass-logo__end">
        <Bracket side="right" />
        {!icon ? (
          <span className="adamass-logo__dimension" aria-hidden="true">
            AB
          </span>
        ) : null}
      </span>
    </span>
  );
}

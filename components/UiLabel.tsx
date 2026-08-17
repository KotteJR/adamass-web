import type { ReactNode } from "react";

type Tone = "muted" | "signal" | "ink";

type UiLabelProps = {
  children: ReactNode;
  tone?: Tone;
  as?: "p" | "span";
  id?: string;
};

export default function UiLabel({
  children,
  tone = "muted",
  as: Tag = "p",
  id,
}: UiLabelProps) {
  const classes =
    tone === "signal"
      ? "ui-label ui-label--signal"
      : tone === "ink"
        ? "ui-label ui-label--ink"
        : "ui-label";

  return (
    <Tag id={id} className={classes}>
      {children}
    </Tag>
  );
}

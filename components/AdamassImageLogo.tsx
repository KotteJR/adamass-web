import { readFileSync } from "node:fs";
import { join } from "node:path";

type Variant = "primary" | "reversed" | "knockout" | "deep";

type AdamassImageLogoProps = {
  size: number;
  variant?: Variant;
  icon?: boolean;
};

const lockups: Record<Variant, string> = {
  primary: "adamass-lockup-primary.svg",
  reversed: "adamass-lockup-reversed.svg",
  knockout: "adamass-lockup-knockout.svg",
  deep: "adamass-lockup-deep.svg",
};

const assetData = new Map<string, string>();

function getAssetData(filename: string) {
  const cached = assetData.get(filename);
  if (cached) return cached;

  const source = readFileSync(
    join(process.cwd(), "public", "brand", filename),
    "base64",
  );
  const data = `data:image/svg+xml;base64,${source}`;
  assetData.set(filename, data);
  return data;
}

export default function AdamassImageLogo({
  size,
  variant = "primary",
  icon = false,
}: AdamassImageLogoProps) {
  const filename = icon
    ? variant === "knockout"
      ? "adamass-icon-knockout.svg"
      : "adamass-icon-reversed.svg"
    : lockups[variant];
  const height = icon ? size : size * 0.91;
  const width = icon ? size : size * 5.094;

  return (
    <img
      src={getAssetData(filename)}
      alt=""
      width={width}
      height={height}
      style={{ display: "flex" }}
    />
  );
}

import type { CSSProperties } from "react";
import type { ClientLogoAsset } from "@/content/clients";
import { cn } from "@/lib/utils";

/**
 * Logos share one optical height. Wide wordmarks come down a little and
 * compact marks go up a little (a gentle power curve, kept in a narrow band),
 * so no logo looks bigger or smaller than its neighbours. `scale` fine-tunes
 * single logos.
 */
function heightFactor({ aspect, scale = 1 }: ClientLogoAsset) {
  return Math.min(1.25, Math.max(0.78, (3 / aspect) ** 0.35)) * scale;
}

type ClientLogoProps = {
  logo: ClientLogoAsset;
  className?: string;
};

/**
 * One client logo painted in currentColor. Size it with `--logo-h` on an
 * ancestor (the height of a logo with a 3:1 aspect). Decorative by itself:
 * the list that holds it names the clients.
 */
export function ClientLogo({ logo, className }: ClientLogoProps) {
  const style = {
    "--logo-factor": heightFactor(logo).toFixed(3),
    aspectRatio: logo.aspect,
    maskImage: `url("${logo.mask}")`,
    WebkitMaskImage: `url("${logo.mask}")`,
  } as CSSProperties;

  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        "block h-[calc(var(--logo-h,24px)*var(--logo-factor))] bg-current",
        "mask-contain mask-center mask-no-repeat [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]",
        className,
      )}
    />
  );
}

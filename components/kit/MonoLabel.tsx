import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type MonoLabelProps = ComponentProps<"span"> & {
  /** 10.5 px (default) or 11 px. */
  size?: "sm" | "md";
};

/** Geist Mono, small and uppercase. The only place the mono face appears. */
export function MonoLabel({ size = "sm", className, ...props }: MonoLabelProps) {
  return (
    <span
      className={cn(
        "font-mono uppercase text-mute",
        size === "md" ? "text-[0.6875rem] tracking-[0.08em]" : "text-2xs",
        className,
      )}
      {...props}
    />
  );
}

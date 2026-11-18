import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The small label over a section, a field or a spec: sans, sentence case, a
 * touch of tracking, in mute (type-label). Kept under its old name; it was mono.
 */
export function MonoLabel({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("type-label text-mute", className)} {...props} />;
}

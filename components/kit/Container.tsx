import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The page column: the same outer gutter (--gutter) for every section, the
 * header and the footer, up to --page-max. Full-bleed paintings sit outside it.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("gutter mx-auto w-full max-w-(--page-max)", className)} {...props} />;
}

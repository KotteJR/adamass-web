import { cn } from "@/lib/utils";

/** The small label over a chart or a stack group. */
export function PanelLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("type-label text-slate", className)}>{children}</span>
  );
}

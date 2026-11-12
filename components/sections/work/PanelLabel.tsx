import { cn } from "@/lib/utils";

/** The small mono label over a chart or a stack group. */
export function PanelLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("font-mono text-[10.5px] tracking-[0.08em] text-slate uppercase", className)}>{children}</span>
  );
}

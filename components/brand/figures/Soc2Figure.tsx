import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { cn } from "@/lib/utils";
import { Soc2Art } from "./art/Soc2Art";
import styles from "./figures.module.css";

/** SOC 2 readiness: the control drawers light, evidence goes to the archive, the auditor's stamp seals the report. */
export function Soc2Figure({ className, label }: { className?: string; label?: string }) {
  return (
    <PlayWhenVisible className={cn(styles.figure, styles.soc2, className)}>
      <Soc2Art label={label} />
    </PlayWhenVisible>
  );
}

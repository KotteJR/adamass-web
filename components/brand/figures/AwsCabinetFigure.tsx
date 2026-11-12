import { cn } from "@/lib/utils";
import { AwsCabinetArt } from "./art/AwsCabinetArt";
import styles from "./aws-cabinet.module.css";

/**
 * The AWS organisation as a cabinet. An ancestor's m-<mode> class picks the
 * motion story; the explorer's plate owns the play state, so the drawing and
 * its step names rest and run together.
 */
export function AwsCabinetFigure({ className }: { className?: string }) {
  return (
    <div className={cn(styles.cabinet, className)}>
      <AwsCabinetArt />
    </div>
  );
}

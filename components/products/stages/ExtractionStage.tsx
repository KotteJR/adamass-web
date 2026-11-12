import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { extractionStage as stage, type StageVariant } from "@/content/product-stages";
import { cn } from "@/lib/utils";
import styles from "./extraction-stage.module.css";

const cls = (name: string) => styles[name as keyof typeof styles];

function Label({ children }: { children: string }) {
  return <span className="flex h-9 items-center font-mono text-[10.5px] tracking-[0.12em] text-slate uppercase">{children}</span>;
}

/** The policy, its binding phrases underlined one after another. */
function Policy({ className }: { className?: string }) {
  return (
    <p className={cn("leading-[1.6] text-ink-2", className)}>
      {stage.text.map((part) =>
        part.mark === undefined ? (
          part.text
        ) : (
          <span key={part.text} className={cn(styles.exp, cls(`exP${part.mark}`))}>
            {part.text}
          </span>
        ),
      )}
    </p>
  );
}

/** The library: the three controls the policy binds light up; the others dim. */
function Controls({ card }: { card: boolean }) {
  return stage.controls.map((control) => (
    <div
      key={control.code}
      className={cn(
        "flex items-center gap-3 rounded-lg bg-white px-3",
        card ? "h-[38px]" : "h-[42px]",
        control.mark === undefined ? styles.exDim : cls(`exR${control.mark}`),
      )}
    >
      <span className="w-[34px] font-mono text-[11px] text-lit">{control.code}</span>
      <span className="truncate text-[14px] text-ink">{control.name}</span>
      {control.mark === undefined ? null : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2f5b8c"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={cn("ml-auto flex-none opacity-0", cls(`exK${control.mark}`))}
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      )}
    </div>
  ));
}

function Found() {
  return (
    <div className={cn("flex h-11 items-center gap-3 opacity-0", styles.exChip)}>
      <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 text-[14px] font-medium text-white">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        {stage.found}
      </span>
      <span className="text-[14px] text-ink-2">{stage.foundNote}</span>
    </div>
  );
}

/**
 * Library-backed extraction at work, on paper: an access policy is read, each
 * binding phrase lights the standard control it maps to (AC-2, AC-6, AU-6),
 * then "3 found" comes up. Decorative; the row and the modal carry the words.
 */
export function ExtractionStage({ variant }: { variant: StageVariant }) {
  const card = variant !== "modal";
  return (
    <PlayWhenVisible aria-hidden className={styles.root}>
      {card ? (
        <div className="relative grid h-full grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] grid-rows-[auto_1fr_auto] gap-x-9 p-9">
          <Label>{stage.policy}</Label>
          <Label>{stage.library}</Label>
          <Policy className="mt-2.5 text-[19px]" />
          <div className="mt-2.5 flex flex-col gap-1.5">
            <Controls card />
          </div>
          <div className="col-span-full">
            <Found />
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col p-10">
          <Label>{stage.policy}</Label>
          <Policy className="mt-3.5 text-[20px]" />
          <div className="mt-8 flex flex-col gap-1.5">
            <Label>{stage.library}</Label>
            <Controls card={false} />
          </div>
          <div className="mt-auto">
            <Found />
          </div>
        </div>
      )}
    </PlayWhenVisible>
  );
}

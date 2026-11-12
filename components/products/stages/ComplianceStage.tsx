import Image from "next/image";
import paintWide from "@/assets/paintings/paint-wide.webp";
import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { complianceStage as stage, type StageVariant } from "@/content/product-stages";
import { cn } from "@/lib/utils";
import styles from "./compliance-stage.module.css";

const cls = (name: string) => styles[name as keyof typeof styles];

function Label({ children }: { children: string }) {
  return (
    <span className="flex h-9 items-center font-mono text-[10.5px] tracking-[0.12em] uppercase opacity-85">{children}</span>
  );
}

/** The article, its binding phrases underlined one after another. */
function Article({ className }: { className?: string }) {
  return (
    <p className={cn("leading-[1.6] text-white/74", className)}>
      {stage.text.map((part, i) =>
        i % 2 ? (
          <span key={part} className={cn(styles.hl, cls(`hl${(i - 1) / 2}`))}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </p>
  );
}

function Findings() {
  return stage.findings.map((finding, j) => (
    <div key={finding.risk} className={cn("flex flex-col gap-[3px]", styles.fd, cls(`fd${j}`))}>
      <span className="text-[16px] font-medium tracking-[-0.01em]">{finding.risk}</span>
      <span className="text-[14px] text-[#dbe5f1]">→ {finding.control}</span>
    </div>
  ));
}

function Sent() {
  return (
    <div className={cn("flex h-11 items-center gap-3.5", styles.fd, styles.fd3)}>
      <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-[14px] font-medium text-ink">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111214" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        {stage.sent}
      </span>
      <span className="text-[14px] text-[#dbe5f1]">{stage.tally}</span>
    </div>
  );
}

/**
 * The Compliance SLM at work, on our wide painting: the article's binding
 * phrases are underlined in turn, three risk → control findings come out,
 * then the result goes to the reviewer. The card also shows "94 in 100".
 */
export function ComplianceStage({ variant }: { variant: StageVariant }) {
  const card = variant !== "modal";
  return (
    <PlayWhenVisible aria-hidden className={styles.root}>
      <Image
        src={paintWide}
        alt=""
        fill
        sizes={card ? "(max-width: 767px) 100vw, 540px" : "(max-width: 767px) 100vw, 600px"}
        className={cn("object-cover", styles.paint)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(14,28,48,0.56)_0%,rgba(14,28,48,0.3)_60%,rgba(14,28,48,0.36)_100%)]" />
      {card ? (
        <div className="relative grid h-full grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] grid-rows-[auto_1fr_auto] gap-x-10 p-9 text-white">
          <Label>{stage.article}</Label>
          <Label>{stage.findingsLabel}</Label>
          <Article className="mt-2.5 text-[19px]" />
          <div className="mt-2.5 flex flex-col gap-4">
            <Findings />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[44px] leading-none font-medium tracking-[-0.045em]">{stage.score.value}</span>
            <span className="text-[13px] leading-[1.35] text-[#dbe5f1]">
              {stage.score.label[0]}
              <br />
              {stage.score.label[1]}
            </span>
          </div>
          <Sent />
        </div>
      ) : (
        <div className="relative flex h-full flex-col p-10 text-white">
          <Label>{stage.article}</Label>
          <Article className="mt-3.5 text-[20px]" />
          <div className="mt-9 flex flex-col gap-[18px]">
            <Label>{stage.findingsLabel}</Label>
            <Findings />
          </div>
          <div className="mt-auto">
            <Sent />
          </div>
        </div>
      )}
    </PlayWhenVisible>
  );
}

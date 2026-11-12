import Image from "next/image";
import cloudPuff from "@/assets/murmur/cloud-puff.webp";
import cloudWide from "@/assets/murmur/cloud-wide.webp";
import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { murmurStage, type MurmurPhase, type StageVariant } from "@/content/product-stages";
import { cn } from "@/lib/utils";
import { murmurFonts } from "./fonts";
import { WAVE_A, WAVE_B } from "./murmur-waves";
import { StockholmDate } from "./StockholmDate";
import styles from "./murmur-stage.module.css";

const { phases, phaseSeconds } = murmurStage;
const DAY = phaseSeconds * phases.length;

/** Starts each phase's layer at its own point in the shared 20 s day. */
const delay = (i: number) => ({ animationDelay: `-${(DAY - i * phaseSeconds) % DAY}s` });

/** One line per phase, stacked in place; the CSS shows each during its phase. */
function Cycle({ text }: { text: (phase: MurmurPhase) => string }) {
  return phases.map((phase, i) => (
    <span key={phase.greeting} className={styles.t} style={delay(i)}>
      {text(phase)}
    </span>
  ));
}

const SERIF = "[font-family:var(--font-newsreader),ui-serif,Georgia,serif]";
const SANS = "[font-family:var(--font-hanken-grotesk),ui-sans-serif,system-ui,sans-serif]";
const MONO = "[font-family:var(--font-ibm-plex-mono),ui-monospace,monospace]";

/**
 * Murmur, live: its sky moves through Morning, Afternoon, Evening and Night,
 * the clouds drift, a white wave flows and the loop pill names what plays.
 * Decorative; the Work row and the modal carry the words.
 */
export function MurmurStage({ variant }: { variant: StageVariant }) {
  const card = variant !== "modal";
  return (
    <PlayWhenVisible aria-hidden className={cn(styles.root, murmurFonts)}>
      {phases.map((phase, i) => (
        <div key={phase.greeting} className={styles.sky} style={{ background: phase.sky, ...delay(i) }} />
      ))}
      <Image src={cloudWide} alt="" sizes="(max-width: 767px) 80vw, 620px" className={cn(styles.cl, styles.c1)} />
      <Image src={cloudPuff} alt="" sizes="(max-width: 767px) 40vw, 290px" className={cn(styles.cl, styles.c2)} />
      <Image src={cloudWide} alt="" sizes="(max-width: 767px) 90vw, 710px" className={cn(styles.cl, styles.c3)} />

      <div className={cn("relative flex h-full flex-col", card ? "p-9" : "p-10")}>
        <div className="flex h-9 items-center justify-between">
          <span className={cn(SERIF, "text-[23px] tracking-[-0.01em]")}>{murmurStage.name}</span>
          <span className={cn(MONO, "text-[10.5px] tracking-[0.14em] uppercase opacity-85")}>
            <StockholmDate />
          </span>
        </div>
        <div
          className={cn(
            SERIF,
            "relative leading-[1.1] tracking-[-0.02em]",
            card ? "mt-[26px] h-[73px] text-[66px]" : "mt-[68px] h-[90px] text-[82px]",
          )}
        >
          <Cycle text={(p) => p.greeting} />
        </div>
        <div className={cn(SANS, "relative mt-2 h-6 text-[16px] opacity-90")}>
          <Cycle text={(p) => `Pick up ${p.mood} where you left it.`} />
        </div>
        <div className={cn("relative min-h-0 flex-1 overflow-hidden", card ? "-mx-9" : "-mx-10")}>
          <svg className={styles.wave} viewBox="0 0 1600 90" width="1600" height="90">
            <path d={WAVE_A} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
          </svg>
          <svg className={cn(styles.wave, styles.wave2)} viewBox="0 0 1600 90" width="1600" height="90">
            <path d={WAVE_B} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
        <div className="flex h-11 items-center justify-between gap-4">
          <span
            className={cn(
              SANS,
              "inline-flex h-11 items-center gap-2.5 rounded-[10px] bg-white pr-[18px] pl-3.5 text-[15px] font-medium text-[#10131a]",
            )}
          >
            <span className={styles.eq}>
              <i />
              <i />
              <i />
            </span>
            <span className="relative inline-block h-5 w-28">
              <Cycle text={(p) => p.mood} />
            </span>
          </span>
          <span className="flex flex-col items-end gap-1">
            <span className={cn(styles.r, SANS, "relative block h-[18px] w-[190px] text-[14px]")}>
              <Cycle text={(p) => p.mix} />
            </span>
            <span
              className={cn(
                styles.r,
                MONO,
                "relative block h-3.5 w-[120px] text-[10.5px] tracking-[0.12em] uppercase opacity-80",
              )}
            >
              <Cycle text={(p) => `${p.loop} loop`} />
            </span>
          </span>
        </div>
      </div>
    </PlayWhenVisible>
  );
}

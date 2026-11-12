import type { CSSProperties, ReactNode } from "react";
import { PlayWhenVisible } from "@/components/motion/PlayWhenVisible";
import { morrowRounds, morrowStage, type StageVariant } from "@/content/product-stages";
import { cn } from "@/lib/utils";
import { morrowFonts } from "./fonts";
import { MidnightCountdown } from "./MidnightCountdown";
import { MorrowMark } from "./MorrowMark";
import styles from "./morrow-stage.module.css";

// The timings live in morrow-stage.module.css, generated from
// design/handoff/generators/round2/stages.py; the class names here match its keyframes.

const DEEP = { quint: "#06603A", nib: "#8C1237", sheaf: "#8A4200", orbit: "#6E4E00", nonet: "#035C55", skein: "#3E1FA0" };
const QUINT_WASH = "#E9F4EC";
const { games } = morrowRounds;

/** A colour mixed toward white, as Morrow tints its game colours. */
function tint(hex: string, amount: number) {
  const channel = (i: number) => {
    const c = Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
    return Math.round(255 + (c - 255) * amount)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

const cls = (name: string) => styles[name as keyof typeof styles];

function Logo() {
  return (
    <span className="inline-flex items-center gap-[9px]">
      <MorrowMark className="size-[26px] flex-none" />
      <span className="text-[22px] font-bold tracking-[-0.02em] text-ink">{morrowStage.wordmark}</span>
    </span>
  );
}

function Countdown() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-[#3d4a42]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {morrowStage.newSet}{" "}
      <b className="font-semibold text-ink tabular-nums">
        <MidnightCountdown />
      </b>
    </span>
  );
}

/** Today's eleven on the card: the first solved, Quint filling as it is solved. */
function CardProgress() {
  return (
    <div className="flex flex-col gap-[9px]">
      <div className="flex justify-between text-[13px] text-[#3d4a42]">
        <span>{morrowStage.eleven}</span>
        <span className="relative inline-block h-[18px] w-[110px]">
          <span className={cn("absolute left-0", styles.count1)}>{morrowStage.solved[0]}</span>
          <span className={cn("absolute left-0 opacity-0", styles.count2)}>{morrowStage.solved[1]}</span>
        </span>
      </div>
      <div className="flex gap-1">
        {morrowStage.gameColors.map((color, i) => (
          <span key={color} className="relative h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: tint(color, 0.28) }}>
            {i === 0 ? <span className="absolute inset-0" style={{ backgroundColor: color }} /> : null}
            {i === 1 ? <span className={cn("absolute inset-0 origin-left", styles.seg)} style={{ backgroundColor: color }} /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

/** In the modal, segments fill as each game is solved: Quint, Sheaf, Skein, Orbit, Nib, Nonet. */
const MODAL_SOLVED = new Set([1, 2, 3, 4, 5, 6]);

/** Today's eleven across the modal's whole loop: 1 → 7 of 11. */
function ModalProgress() {
  return (
    <div className="absolute bottom-10 left-10 flex w-64 flex-col gap-[9px]">
      <div className="relative h-[18px] text-[13px] text-[#3d4a42]">
        <span>{morrowStage.eleven}</span>
        {Array.from({ length: 7 }, (_, k) => (
          <span key={k} className={cn("absolute top-0 right-0 whitespace-nowrap", k > 0 && "opacity-0", cls(`mrN${k}`))}>
            {k + 1} of 11 solved
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        {morrowStage.gameColors.map((color, i) => (
          <span key={color} className="relative h-1.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: tint(color, 0.28) }}>
            {i === 0 ? <span className="absolute inset-0" style={{ backgroundColor: color }} /> : null}
            {MODAL_SOLVED.has(i) ? (
              <span className={cn("absolute inset-0 origin-left", cls(`mrSeg${i}`))} style={{ backgroundColor: color }} />
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Quint, today's answer STACK: CRANE, SLACK, STACK, three rows left empty. */
function QuintBoard({ tile, gap, prefix }: { tile: number; gap: number; prefix: "q" | "Mq" }) {
  const { guesses } = morrowStage.quint;
  return (
    <div className="relative">
      <div
        className="grid [perspective:600px]"
        style={{ "--t": `${tile}px`, gridTemplateColumns: `repeat(5, ${tile}px)`, gap, fontSize: Math.round(tile * 0.46) } as CSSProperties}
      >
        {Array.from({ length: 6 }, (_, r) =>
          Array.from({ length: 5 }, (_, c) => {
            const guess = guesses[r];
            if (!guess) return <span key={`${r}${c}`} className={cn(styles.qt, styles.empty)} />;
            return (
              <span key={`${r}${c}`} className={cn(styles.qt, cls(`${prefix}${r}${c}`))}>
                {guess.word[c]}
                {guess.marks[c] === "p" ? (
                  <span
                    className={cn("absolute top-0 right-0 size-[34%] opacity-0", cls(`${prefix}m${r}${c}`))}
                    style={{
                      background: `linear-gradient(225deg, ${games.quint.color} 50%, transparent 50%)`,
                      borderTopRightRadius: Math.round(tile * 0.22),
                    }}
                  />
                ) : null}
              </span>
            );
          }),
        )}
      </div>
      <span
        className={cn(
          "absolute -bottom-3.5 left-1/2 inline-flex h-[34px] items-center gap-[7px] rounded-full bg-ink px-3.5 text-[13.5px] font-semibold whitespace-nowrap text-white opacity-0",
          prefix === "q" ? styles.toast : styles.MqToast,
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        {morrowStage.toast}
      </span>
    </div>
  );
}

/** Numbers each square that starts an across or down word, as a crossword does. */
function numberGrid(grid: readonly string[]) {
  const numbers = new Map<string, number>();
  let n = 0;
  for (let r = 0; r < 5; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      if (grid[r][c] === "#") continue;
      const across = (c === 0 || grid[r][c - 1] === "#") && c < 4 && grid[r][c + 1] !== "#";
      const down = (r === 0 || grid[r - 1][c] === "#") && r < 4 && grid[r + 1][c] !== "#";
      if (across || down) numbers.set(`${r}${c}`, (n += 1));
    }
  }
  return numbers;
}

/** Nib, the mini crossword, filling word by word. */
function NibBoard() {
  const { grid } = morrowStage.nib;
  const numbers = numberGrid(grid);
  return (
    <div className="grid auto-rows-[40px] grid-cols-[repeat(5,40px)] gap-1 text-[18px]">
      {grid.flatMap((row, r) =>
        [...row].map((letter, c) =>
          letter === "#" ? (
            <span key={`${r}${c}`} />
          ) : (
            <span key={`${r}${c}`} className={cn(styles.nc, cls(`n${r}${c}`))}>
              {numbers.has(`${r}${c}`) ? (
                <i className="absolute top-0.5 left-1 text-[8px] font-semibold text-[rgba(140,18,55,0.6)] not-italic">
                  {numbers.get(`${r}${c}`)}
                </i>
              ) : null}
              {letter}
            </span>
          ),
        ),
      )}
    </div>
  );
}

function Status({ label, color, children, className }: { label: string; color: string; children: ReactNode; className?: string }) {
  return (
    <span className={cn(styles.clue, className)}>
      <b className="font-bold" style={{ color }}>
        {label}
      </b>
      &nbsp;&nbsp;{children}
    </span>
  );
}

function NibClues() {
  const { across, solved } = morrowStage.nib;
  return (
    <>
      {across.map((item, k) => (
        <Status key={item.number} label={`${item.number} Across`} color={DEEP.nib} className={cls(`nc${k}`)}>
          {item.clue}
        </Status>
      ))}
      <Status label={solved.label} color={DEEP.nib} className={styles.ncS}>
        {solved.text}
      </Status>
    </>
  );
}

/** Sheaf: tiles are picked, slide into rows and collapse into four bands, tier 1 to tier 4. */
function SheafBoard() {
  const { bundles, order } = morrowRounds.sheaf;
  const W = 56;
  const H = 40;
  const G = 5;
  const tiers = [tint(games.sheaf.color, 0.32), tint(games.sheaf.color, 0.6), games.sheaf.color, DEEP.sheaf];
  return (
    <div className="relative" style={{ width: 4 * W + 3 * G, height: 4 * H + 3 * G }}>
      {order.map((word, i) => (
        <span
          key={word}
          className={cn("absolute", cls(`shM${i}`))}
          style={{ left: (i % 4) * (W + G), top: Math.floor(i / 4) * (H + G), width: W, height: H }}
        >
          <span
            className={cn(
              "flex size-full items-center justify-center rounded-lg bg-white text-[11px] font-semibold tracking-[-0.01em] text-[#2A1500]",
              cls(`shS${i}`),
            )}
          >
            {word}
          </span>
        </span>
      ))}
      {bundles.map((bundle, g) => (
        <span
          key={bundle.title}
          className={cn("absolute left-0 flex flex-col items-center justify-center gap-px rounded-lg opacity-0", cls(`shB${g}`))}
          style={{
            top: g * (H + G),
            width: 4 * W + 3 * G,
            height: H,
            backgroundColor: tiers[g],
            color: g >= 2 ? "#ffffff" : "#2A1500",
          }}
        >
          <b className="text-[11.5px] font-bold">{bundle.title}</b>
          <span className="text-[10px] opacity-85">{bundle.words.join(", ")}</span>
        </span>
      ))}
    </div>
  );
}

/** Nonet: blanks fill box by box with a cursor, then a solved wave. */
function NonetBoard() {
  const { givens, solution } = morrowRounds.nonet;
  return (
    <div className="relative size-[228px]">
      {[...givens].map((given, i) => {
        const r = Math.floor(i / 9);
        const c = i % 9;
        const blank = given === "0";
        return (
          <span
            key={i}
            className={cn(
              "absolute flex size-6 items-center justify-center rounded text-[12.5px]",
              blank ? "font-bold" : "font-semibold text-slate",
              cls(blank ? `nnB${i}` : `nnG${i}`),
            )}
            style={{ left: c * 25 + Math.floor(c / 3) * 3, top: r * 25 + Math.floor(r / 3) * 3 }}
          >
            {blank ? solution[i] : given}
          </span>
        );
      })}
    </div>
  );
}

/** Orbit: DIVE, COVER, VOICE, DRIVER, then DIVORCED for a full orbit. */
function OrbitBoard() {
  const { core, ring, words } = morrowRounds.orbit;
  const cx = 120;
  const cy = 146;
  const R = 72;
  const disc = (letter: string, x: number, y: number, size: number, isCore: boolean) => (
    <span
      key={letter}
      className={cn("absolute flex items-center justify-center rounded-full font-bold", cls(`orP${letter}`))}
      style={{
        left: Math.round(x - size),
        top: Math.round(y - size),
        width: 2 * size,
        height: 2 * size,
        fontSize: isCore ? 20 : 16,
        backgroundColor: isCore ? games.orbit.color : "#ffffff",
        color: isCore ? "#ffffff" : DEEP.orbit,
        boxShadow: `0 2px 0 ${tint(DEEP.orbit, 0.5)}`,
      }}
    >
      {letter.toUpperCase()}
    </span>
  );
  return (
    <div className="relative h-[250px] w-60">
      <div className="absolute inset-x-0 top-3.5 h-[30px] text-[22px] font-bold tracking-[0.06em]" style={{ color: DEEP.orbit }}>
        {words.map(({ word }, wi) => (
          <span key={word} className="absolute inset-x-0 top-0 flex justify-center gap-0.5">
            {[...word].map((letter, li) => (
              <span key={li} className={cn("opacity-0", cls(`orL${wi}_${li}`))}>
                {letter.toUpperCase()}
              </span>
            ))}
          </span>
        ))}
      </div>
      <svg width="240" height="250" className="absolute top-0 left-0" aria-hidden>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={tint(games.orbit.color, 0.45)} strokeWidth="1.5" strokeDasharray="3 5" />
      </svg>
      {ring.map((letter, k) => {
        const angle = ((-90 + 60 * k) * Math.PI) / 180;
        return disc(letter, cx + R * Math.cos(angle), cy + R * Math.sin(angle), 21, false);
      })}
      {disc(core, cx, cy, 28, true)}
    </div>
  );
}

function OrbitChips() {
  const { words, fullOrbit } = morrowRounds.orbit;
  return (
    <div className="mt-[18px] flex flex-wrap gap-1.5">
      {words.map(({ word, points }, wi) => (
        <span
          key={word}
          className={cn("inline-flex h-7 items-center gap-1.5 rounded-md bg-white px-2.5 text-[12.5px] font-semibold opacity-0", cls(`orC${wi}`))}
          style={{ color: DEEP.orbit }}
        >
          {word.toUpperCase()}
          <i className="font-medium text-[#8a7a4a] not-italic">
            +{points}
            {points > 9 ? ` · ${fullOrbit}` : ""}
          </i>
        </span>
      ))}
    </div>
  );
}

function OrbitScore() {
  const { words, score, ranks } = morrowRounds.orbit;
  const totals = words.reduce<number[]>((acc, { points }) => [...acc, (acc.at(-1) ?? 0) + points], [0]);
  return totals.map((total, k) => (
    <Status key={k} label={`${score} ${total}`} color={DEEP.orbit} className={cls(`orS${k}`)}>
      {total >= ranks.at ? ranks.high : ranks.low}
    </Status>
  ));
}

/** Skein: six threads trace through the letters, then the knot spells TOOLS. */
function SkeinBoard() {
  const { grid, threads } = morrowRounds.skein;
  const S = 26;
  const G = 3;
  const W = 6 * S + 5 * G;
  const H = 8 * S + 7 * G;
  const centre = ([r, c]: readonly [number, number]) => `${(c * (S + G) + S / 2).toFixed(1)},${(r * (S + G) + S / 2).toFixed(1)}`;
  return (
    <div className="relative" style={{ width: W, height: H }}>
      {grid.flatMap((row, r) =>
        [...row].map((letter, c) => (
          <span
            key={`${r}${c}`}
            className={cn("absolute flex items-center justify-center rounded-full bg-white text-[12.5px] font-bold", cls(`skC${r}_${c}`))}
            style={{ left: c * (S + G), top: r * (S + G), width: S, height: S, color: DEEP.skein }}
          >
            {letter}
          </span>
        )),
      )}
      <svg width={W} height={H} className="pointer-events-none absolute top-0 left-0" aria-hidden>
        {threads.map((thread, wi) => (
          <polyline
            key={thread.word}
            className={cls(`skT${wi}`)}
            points={thread.path.map((cell) => centre(cell)).join(" ")}
            pathLength={1}
            fill="none"
            stroke={games.skein.color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.55"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        ))}
      </svg>
    </div>
  );
}

function SkeinStatus() {
  const { threads, threadCount, knotLabel, knotText } = morrowRounds.skein;
  return (
    <>
      {threads.map((thread, k) => (
        <Status key={thread.word} label={thread.word} color={DEEP.skein} className={cls(`skS${k}`)}>
          {k + 1} {threadCount}
        </Status>
      ))}
      <Status label={knotLabel} color={DEEP.skein} className={cls(`skS${threads.length}`)}>
        {knotText}
      </Status>
    </>
  );
}

/** A game's tag, name and line, on the left of its half. */
function GameIntro({ game, ink }: { game: keyof typeof games; ink: string }) {
  const { color, tag, name, line } = games[game];
  return (
    <>
      <span className="inline-flex items-center gap-2 text-[14px]" style={{ color: ink }}>
        <i className="size-[9px] rounded-[3px]" style={{ backgroundColor: color }} />
        {tag}
      </span>
      <span className="mt-1.5 text-[44px] leading-none font-bold tracking-[-0.035em] text-ink">{name}</span>
      <span className="mt-2.5 max-w-[250px] text-[14px] leading-[1.5]" style={{ color: ink }}>
        {line}
      </span>
    </>
  );
}

/** One round's game in one half: shown during its 12 s, crossfading with the others. */
function Round({
  round,
  game,
  board,
  top,
  ink = "#3d4a42",
  extra,
}: {
  round: 0 | 1 | 2;
  game: keyof typeof games;
  board: ReactNode;
  top: number;
  ink?: string;
  extra?: ReactNode;
}) {
  return (
    <div className={cn("absolute inset-0", round > 0 && "opacity-0", cls(`mrA${round}`))}>
      <div className="absolute left-10 flex w-64 flex-col" style={{ top }}>
        <GameIntro game={game} ink={ink} />
        {extra}
      </div>
      <div className="absolute right-10 flex w-60 justify-center" style={{ top }}>
        {board}
      </div>
    </div>
  );
}

/** The halves' washes, one per round, crossfading with the rounds. */
function Washes({ colors }: { colors: [string, string, string] }) {
  return colors.map((color, r) => (
    <div key={color} className={cn("absolute inset-0", r > 0 && "opacity-0", cls(`mrA${r}`))} style={{ backgroundColor: color }} />
  ));
}

/** On the phone sheet the modal's ✕ floats over the top-right corner: the countdown moves in clear of it. */
function TopHalf({ sheet = false }: { sheet?: boolean }) {
  return (
    <div className="relative h-[420px] flex-none overflow-hidden">
      <Washes colors={[QUINT_WASH, tint(games.sheaf.color, 0.13), tint(games.nonet.color, 0.12)]} />
      <div className={cn("absolute top-10 left-10 flex h-9 items-center justify-between", sheet ? "right-24" : "right-10")}>
        <Logo />
        <Countdown />
      </div>
      <Round round={0} game="quint" top={104} board={<QuintBoard tile={38} gap={5} prefix="Mq" />} />
      <Round round={1} game="sheaf" top={110} board={<SheafBoard />} />
      <Round round={2} game="nonet" top={100} board={<NonetBoard />} />
      <ModalProgress />
    </div>
  );
}

function BottomHalf() {
  return (
    <div className="relative min-h-[360px] flex-1 overflow-hidden">
      <Washes colors={[tint(games.nib.color, 0.12), tint(games.orbit.color, 0.15), tint(games.skein.color, 0.11)]} />
      <Round round={0} game="nib" top={28} ink="#5a3a45" board={<NibBoard />} />
      <Round round={1} game="orbit" top={28} ink="#5a4a1e" board={<OrbitBoard />} extra={<OrbitChips />} />
      <Round round={2} game="skein" top={28} ink="#43386a" board={<SkeinBoard />} />
      <div className="absolute bottom-10 left-10 h-11 w-64 text-[14px] leading-[1.4] text-[#3a2a30]">
        <div className={cn("absolute inset-0", styles.mrA0)}>
          <NibClues />
        </div>
        <div className={cn("absolute inset-0 opacity-0", styles.mrA1)}>
          <OrbitScore />
        </div>
        <div className={cn("absolute inset-0 opacity-0", styles.mrA2)}>
          <SkeinStatus />
        </div>
      </div>
    </div>
  );
}

/**
 * Morrow, live, with real puzzles from its content.
 * - card: Quint solved in three guesses (CRANE, SLACK, STACK), on an 11 s loop.
 * - modal: three 12 s rounds of two games: Quint and Nib, Sheaf and Orbit,
 *   Nonet and Skein. Today's eleven fills from 1 to 7 across the 36 s loop.
 * - sheet (phones): the modal's top half, so Quint, Sheaf, then Nonet.
 */
export function MorrowStage({ variant }: { variant: StageVariant }) {
  const { quint } = morrowStage;

  if (variant === "card") {
    return (
      <PlayWhenVisible aria-hidden className={cn(styles.root, morrowFonts)} style={{ backgroundColor: QUINT_WASH }}>
        <div className="relative grid h-full grid-cols-[minmax(0,1fr)_300px] gap-6 p-9">
          <div className="flex flex-col">
            <div className="flex h-9 items-center">
              <Logo />
            </div>
            <div className="mt-auto flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-2 text-[14px] text-[#3d4a42]">
                <i className="size-[9px] rounded-[3px]" style={{ backgroundColor: games.quint.color }} />
                {quint.cardLabel}
              </span>
              <span className="text-[52px] leading-none font-bold tracking-[-0.035em] text-ink">{quint.name}</span>
            </div>
            <div className="mt-[22px]">
              <CardProgress />
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <QuintBoard tile={46} gap={6} prefix="q" />
          </div>
        </div>
      </PlayWhenVisible>
    );
  }

  return (
    <PlayWhenVisible aria-hidden className={cn(styles.root, morrowFonts, "flex flex-col")}>
      <TopHalf sheet={variant === "sheet"} />
      {variant === "modal" ? <BottomHalf /> : null}
    </PlayWhenVisible>
  );
}

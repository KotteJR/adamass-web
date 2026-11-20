// What the live product stages show (components/products/stages). Source:
// design/handoff/generators/round2/stages.py. The stage keyframes in the CSS
// modules are generated for exactly these words, grids and lines: change one
// here and regenerate the module, or the motion stops matching.

/**
 * card: 780 x 450, shown scaled in the Work index. modal: 600 x 780, the modal's
 * left half. sheet: the phone sheet's stage, the card for most products and
 * the modal's top half (600 x 420) for Morrow.
 */
export type StageVariant = "card" | "modal" | "sheet";

export type MurmurPhase = {
  sky: string;
  greeting: string;
  /** "Pick up {mood} where you left it." */
  mood: string;
  mix: string;
  loop: string;
};

export const murmurStage = {
  name: "Murmur Studio",
  /** Four phases of 5 s each: a 20 s day. */
  phases: [
    {
      sky: "linear-gradient(168deg, #7a4a22 0%, #b4713c 52%, #e6be95 100%)",
      greeting: "Morning.",
      mood: "Slow start",
      mix: "Piano · Focus · Vinyl",
      loop: "2:00",
    },
    {
      sky: "linear-gradient(168deg, #a35a2c 0%, #c47f48 50%, #e0b07a 100%)",
      greeting: "Afternoon.",
      mood: "Deep work",
      mix: "Rhodes · Focus · Rain",
      loop: "4:00",
    },
    {
      sky: "linear-gradient(165deg, #4f537a 0%, #7a7ea0 52%, #a6a8c0 100%)",
      greeting: "Evening.",
      mood: "Winding down",
      mix: "Guitar · Night · Cafe",
      loop: "2:00",
    },
    {
      sky: "linear-gradient(168deg, #1d2848 0%, #374472 54%, #7887ae 100%)",
      greeting: "Night.",
      mood: "Falling asleep",
      mix: "Brown noise · 32 dBA",
      loop: "10 h",
    },
  ] satisfies MurmurPhase[],
  phaseSeconds: 5,
} as const;

/** One of Morrow's daily games, as its card shows it: the name, its line, and its colours (Morrow's lib/accents). */
export type MorrowGame = { id: string; name: string; line: string; accent: string; tint: string; deep: string };

/**
 * Morrow as it looks now: the games' 3D films (public/morrow/films, from the Morrow
 * app's /loops). The showcase plays one film after another, each once, through
 * the games below; the row under it is today's games, the one playing marked.
 */
export const morrowStage = {
  wordmark: "morrow",
  newSet: "New set in",
  eleven: "Today’s eleven",
  free: "Free today",
  games: [
    { id: "quint", name: "Quint", line: "Find the five-letter word in six tries.", accent: "#2f7bff", tint: "#dbe6f6", deep: "#0655e0" },
    { id: "lattice", name: "Lattice", line: "The daily crossword. Small on Monday, grand by Sunday.", accent: "#6a5cff", tint: "#e3e1f6", deep: "#1806e0" },
    { id: "nib", name: "Nib", line: "A five-by-five crossword with a big middle.", accent: "#ff4fa0", tint: "#f8dfe9", deep: "#c7055e" },
    { id: "skein", name: "Skein", line: "Trace six themed words through the letters.", accent: "#9b5cff", tint: "#eae1f6", deep: "#5a06e0" },
    { id: "orbit", name: "Orbit", line: "Spin as many words as you can from seven letters.", accent: "#ffc928", tint: "#f8f1d8", deep: "#866503" },
  ] satisfies MorrowGame[],
} as const;

export const complianceStage = {
  article: "Article 9 · Sample",
  /** The article, with its binding phrases (underlined in turn) as the odd parts. */
  text: [
    "Providers shall ",
    "establish and document a risk management process",
    " for the system, and shall ",
    "keep records of its operation for as long as it is in use",
    ". A ",
    "named person shall oversee",
    " each release before it reaches users.",
  ],
  findingsLabel: "Risks that bind",
  findings: [
    { risk: "No documented risk process", control: "Risk register, reviewed each quarter" },
    { risk: "Records not kept for the system’s life", control: "Retention policy on audit logs" },
    { risk: "No named oversight", control: "A named reviewer signs each release" },
  ],
  sent: "Sent to the reviewer",
  tally: "3 risks, 3 controls",
  score: { value: "94 in 100", label: ["match the", "reviewer"] },
} as const;


/**
 * Adamass Studio, our paint-by-numbers shop, on one work from its catalogue (The Shell Stair,
 * design 34): the kit at each detail level, as the generator wrote it (assets/studio). For
 * each level: the colours, the numbered areas, how many patches the clean-up merged them
 * from, and the first twelve paints of its colour key.
 */
export const studioStage = {
  nav: ["Collections", "All works", "Your photo"],
  title: "The Shell Stair",
  colours: "colours",
  key: "Colour key",
  /** "{areas} areas, merged from {patches}" */
  areas: (areas: number, patches: number) => `${areas} numbered areas, merged from ${patches.toLocaleString("en-GB")} patches`,
  levels: [
  {
    name: "Low",
    colours: 20,
    areas: 162,
    patches: 958,
    key: [
      "#693222",
      "#7D4A38",
      "#52231E",
      "#241618",
      "#3A1A1D",
      "#A05F3F",
      "#0E111D",
      "#B16C47",
      "#E79F61",
      "#DF945A",
      "#C57B4F",
      "#68636C"
    ]
  },
  {
    name: "Medium",
    colours: 29,
    areas: 232,
    patches: 1216,
    key: [
      "#6B3422",
      "#57261E",
      "#874529",
      "#211618",
      "#9F5F3F",
      "#47191D",
      "#2C1A1A",
      "#362323",
      "#0E101B",
      "#DE935A",
      "#7A5951",
      "#3A0F16"
    ]
  },
  {
    name: "High",
    colours: 41,
    areas: 282,
    patches: 1459,
    key: [
      "#783E25",
      "#8D512D",
      "#301C1A",
      "#201517",
      "#69301D",
      "#4D1F19",
      "#5C251B",
      "#281819",
      "#332425",
      "#44161E",
      "#593737",
      "#A26040"
    ]
  }
],
} as const;

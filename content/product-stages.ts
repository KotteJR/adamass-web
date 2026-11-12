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

/** c: correct, p: present, a: absent. */
export type QuintMark = "c" | "p" | "a";

export const morrowStage = {
  wordmark: "morrow",
  newSet: "New set in",
  eleven: "Today’s eleven",
  solved: ["1 of 11 solved", "2 of 11 solved"],
  toast: "Solved in 3",
  /** Today’s eleven, in Morrow’s game colours. Quint is the second. */
  gameColors: [
    "#4B63E6",
    "#24A26A",
    "#EE8A2C",
    "#7A5DE8",
    "#E9B12A",
    "#E0577D",
    "#1B9E93",
    "#3A90DA",
    "#BE56D4",
    "#76AE34",
    "#EC6753",
  ],
  quint: {
    name: "Quint",
    cardLabel: "Five letters · today’s puzzle",
    label: "Five letters",
    description: "Find the five-letter word in six tries.",
    /** Morrow, 2026-10-01: the answer is STACK. */
    guesses: [
      { word: "CRANE", marks: ["p", "a", "a", "a", "a"] },
      { word: "SLACK", marks: ["c", "a", "c", "c", "c"] },
      { word: "STACK", marks: ["c", "c", "c", "c", "c"] },
    ] satisfies { word: string; marks: QuintMark[] }[],
  },
  nib: {
    name: "Nib",
    label: "Mini crossword",
    description: "A five-by-five crossword with a big middle.",
    /** Morrow, 2026-10-01. "#" is a black square. */
    grid: ["ARE##", "LONG#", "LOTUS", "#MERE", "##RUT"],
    across: [
      { number: 1, clue: "Exist, for more than one" },
      { number: 4, clue: "Lengthy" },
      { number: 6, clue: "Water lily of Asia" },
      { number: 8, clue: "Nothing more than" },
      { number: 9, clue: "Groove you get stuck in" },
    ],
    solved: { label: "Solved", text: "The big answer was LOTUS." },
  },
} as const;

/** One of Morrow's games, as the modal stage introduces it. */
export type MorrowGame = { color: string; tag: string; name: string; line: string };

/**
 * The Morrow modal's three 12 s rounds, two games each (top half, bottom half),
 * every one a real puzzle from Morrow's content.
 */
export const morrowRounds = {
  games: {
    quint: { color: "#24A26A", tag: "Five letters", name: "Quint", line: "Find the five-letter word in six tries." },
    nib: { color: "#E0577D", tag: "Mini crossword", name: "Nib", line: "A five-by-five crossword with a big middle." },
    sheaf: { color: "#EE8A2C", tag: "Four bundles", name: "Sheaf", line: "Sixteen words hide four bundles of four." },
    orbit: { color: "#E9B12A", tag: "Seven letters", name: "Orbit", line: "Spin as many words as you can from seven letters." },
    nonet: { color: "#1B9E93", tag: "Number place", name: "Nonet", line: "Nine rows, nine columns, nine boxes, no repeats." },
    skein: { color: "#7A5DE8", tag: "Word threads", name: "Skein", line: "Trace six themed words through the letters." },
  } satisfies Record<string, MorrowGame>,
  /** Sheaf, 2026-11-10: four bundles, tier 1 to tier 4, and the board's starting order. */
  sheaf: {
    bundles: [
      { title: "Morning drinks", words: ["Tea", "Cocoa", "Juice", "Latte"] },
      { title: "Has a shell", words: ["Egg", "Taco", "Turtle", "Pistachio"] },
      { title: "___cake", words: ["Cup", "Pan", "Cheese", "Sponge"] },
      { title: "Hides a bird", words: ["Wrench", "Bowl", "Lemur", "Crown"] },
    ],
    order: ["Turtle", "Cup", "Wrench", "Latte", "Pan", "Bowl", "Egg", "Juice", "Lemur", "Cheese", "Tea", "Taco", "Sponge", "Crown", "Pistachio", "Cocoa"],
  },
  /** Orbit, 2026-10-01: core V, the words in the order they are played, and their points. */
  orbit: {
    core: "v",
    ring: ["d", "c", "e", "o", "i", "r"],
    words: [
      { word: "dive", points: 1 },
      { word: "cover", points: 3 },
      { word: "voice", points: 3 },
      { word: "driver", points: 5 },
      { word: "divorced", points: 19 },
    ],
    fullOrbit: "full orbit",
    score: "Score",
    /** The rank once the score reaches 24. */
    ranks: { low: "Spark", high: "Glow", at: 24 },
  },
  /** Nonet, 2026-10-01: the givens ("0" is blank) and the solution, row by row. */
  nonet: {
    givens: "050000000004090000003600890405030010730080024090040706046001300000070100000000050",
    solution: "659718243184392675273654891465237918731986524892145736946521387528473169317869452",
  },
  /** Skein, 2026-11-10: the letters, six threads ([row, column] in order) and the knot. */
  skein: {
    grid: ["RDWERS", "IERIHC", "VRSRSC", "EEETOO", "MLILSA", "NMPLWS", "ANAHKC", "SPERAH"],
    threads: [
      { word: "HAMMER", path: [[6, 3], [6, 2], [5, 1], [4, 0], [3, 0], [2, 1]] },
      { word: "PLIERS", path: [[5, 2], [5, 3], [4, 2], [3, 2], [2, 3], [2, 4]] },
      { word: "CHISEL", path: [[2, 5], [1, 4], [1, 3], [2, 2], [3, 1], [4, 1]] },
      { word: "SPANNER", path: [[7, 0], [7, 1], [6, 0], [5, 0], [6, 1], [7, 2], [7, 3]] },
      { word: "HACKSAW", path: [[7, 5], [7, 4], [6, 5], [6, 4], [5, 5], [4, 5], [5, 4]] },
      {
        word: "SCREWDRIVER",
        path: [[0, 5], [1, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [1, 1], [1, 2]],
      },
    ] satisfies { word: string; path: [number, number][] }[],
    knot: [[3, 3], [3, 4], [3, 5], [4, 3], [4, 4]] satisfies [number, number][],
    threadCount: "of 6 threads",
    knotLabel: "Knot",
    knotText: "TOOLS, in the workshop",
  },
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

/** Library-backed extraction: an access policy read against a library of standard controls. */
export const extractionStage = {
  policy: "Policy · Access",
  library: "Library · Standard controls",
  /** The policy, with each binding phrase marked by the control it lights (0, 1, 2). */
  text: [
    { text: "Users get " },
    { text: "access only through a request their manager approves", mark: 0 },
    { text: ", and every account is reviewed each quarter. Administrators hold " },
    { text: "only the rights their role needs", mark: 1 },
    { text: ". " },
    { text: "Security logs are read every week", mark: 2 },
    { text: " by a named person." },
  ] as { text: string; mark?: 0 | 1 | 2 }[],
  controls: [
    { code: "AC-2", name: "Account management", mark: 0 },
    { code: "AC-6", name: "Least privilege", mark: 1 },
    { code: "AU-6", name: "Audit record review", mark: 2 },
    { code: "CP-9", name: "System backup" },
    { code: "IA-2", name: "Identification and authentication" },
    { code: "IR-4", name: "Incident handling" },
  ] as { code: string; name: string; mark?: 0 | 1 | 2 }[],
  found: "3 found",
  foundNote: "each one already in the library",
} as const;

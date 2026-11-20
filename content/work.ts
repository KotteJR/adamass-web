// Selected work: a grid of our three products and one client system, each with
// a "Learn more" modal, and a fifth card that asks about other work. Source: design/handoff/HANDOFF-round2.md, the boards
// Work.dc.html and WorkModal*.dc.html, and generators/round2/build.py (P).
// The client is never named.

import { anchors, founders } from "./site";
import type { Headline, LinkAction } from "./types";

export type ProductSlug = "murmur" | "morrow" | "paint-by-numbers" | "compliance-slm";

/** Which live stage a product shows (components/products/stages). */
export type StageKey = "murmur" | "morrow" | "studio" | "compliance";

/** Which isometric figure the modal's "The model" tab shows (components/products/models). */
export type ModelFigureKey = "murmur" | "morrow" | "pnb" | "slm";

export type Stat = { value: string; label: string };

export type StackGroup = { name: string; items: string[] };

/** "What the model does": a behaviour, and how it measures (in mono, on the right). */
export type Capability = { text: string; value: string };

export type DotChart = {
  label: string;
  /** Read out in full for assistive tech. */
  description: string;
  strong: string;
  rest: string;
};

/** The paintings in components/brand/Painting. */
export type PaintingName = "wide" | "tall" | "diag";

/** The one still thing on a card's face, from the work itself. */
export type CardFeature =
  | { kind: "loop" }
  /** One of Morrow's 3D game films (public/morrow/films). */
  | { kind: "film"; id: string }
  | { kind: "dots"; filled: number; total: number }
  /** A close-up of a real paint-by-numbers template, in white lines. */
  | { kind: "lines" }
  | { kind: "nda" };

/**
 * A card's face in the grid: one of our paintings, recoloured to the card's
 * accent (CSS mix-blend-mode: color), darkened a little, with one feature.
 * No captions, no motion.
 */
export type CardFace = {
  painting: PaintingName;
  position: string;
  /** Left out, the painting keeps its own steel blue. */
  accent?: { color: string; strength: number };
  /** Darkening at the top and the bottom, 0 to 1. */
  shade: [number, number];
  /** Our drawn [a] in the bottom right: on our own products and the ask card. */
  mark?: boolean;
  feature: CardFeature;
};

export type WorkProduct = {
  slug: ProductSlug;
  stage: StageKey;
  name: string;
  tags: [string, string, string];
  line: string;
  /** The shorter line under the product's card in the grid. */
  cardLine: string;
  face: CardFace;
  modal: {
    label: string;
    title: Headline;
    overview: {
      body: string;
      stats?: Stat[];
      /** The SLM shows its size and its held-out score instead of stats. */
      charts?: { size: DotChart & { billions: number }; agreement: DotChart & { matched: number; total: number } };
    };
    model: {
      body: string;
      /** label: what the figure shows, for screen readers; left out, the drawing's own English. */
      figure: { key: ModelFigureKey; steps: string[]; label?: string };
      /** Under the figure: what the model does, row by row. */
      capabilities?: { label: string; items: Capability[] };
      stats?: Stat[];
      more?: string[];
    };
    stack: StackGroup[];
    cta: LinkAction;
  };
};

const aleksandar = founders.find((person) => person.name.startsWith("Aleksandar"));

export const workProducts: WorkProduct[] = [
  {
    slug: "murmur",
    stage: "murmur",
    name: "Murmur",
    tags: ["Our product", "Generative audio", "Coming soon"],
    line: "Sound for focus and sleep. A music model we post-trained on lofi and noise writes every loop.",
    cardLine: "Sound for focus and sleep. Every loop is written by our own music model.",
    face: {
      painting: "wide",
      position: "70% 50%",
      accent: { color: "#c58552", strength: 0.82 },
      shade: [0.04, 0.26],
      feature: { kind: "loop" },
      mark: true,
    },
    modal: {
      label: "Our product · Web · Coming soon",
      title: { lead: "Sound you describe.", rest: "Looped all night long." },
      overview: {
        body: "Murmur makes the sound for focus and sleep. Pick instruments, a mood and a texture, or shape a noise to the room you are in. It writes a loop that joins end to start without a seam, so it can play all night.",
        stats: [
          { value: "12", label: "instruments, from piano to harp" },
          { value: "6", label: "textures: vinyl, rain, cafe, tape, wind, fire" },
          { value: "1 to 4 min", label: "loops, played for hours" },
        ],
      },
      model: {
        // TODO founders: confirm "14,000 hours" and "scored by ear".
        body: "We took an open-source music model and rebuilt it for one job. About 90% of its weights are post-trained by us, on 14,000 hours of lofi and noise scored by ear for a single thing: nothing in it should pull your attention. It now writes a whole loop in 8 steps, and the last sample lands exactly where the first one began.",
        figure: { key: "murmur", steps: ["Lofi and noise in", "~90% of layers retrained", "A loop with no seam"] },
        stats: [
          // TODO founders: confirm "14,000 h".
          { value: "14,000 h", label: "of lofi and noise it learned from" },
          { value: "8 steps", label: "to write a full loop" },
          // TODO founders: confirm "0 audible seams".
          { value: "0", label: "audible seams, all night" },
        ],
      },
      stack: [
        // TODO founders: confirm naming the ACE-Step 1.5 Turbo base, or remove it.
        { name: "Model", items: ["ACE-Step 1.5 Turbo base", "Post-training on lofi and noise", "8-step generation"] },
        {
          name: "Audio",
          items: ["Pedalboard", "NumPy", "SciPy", "Web Audio AudioWorklet", "Seamless loop rendering"],
        },
        {
          name: "Web app",
          items: ["Next.js", "React", "TypeScript", "Motion", "GSAP", "PixiJS", "Radix UI", "Zod"],
        },
        { name: "API", items: ["FastAPI", "SQLAlchemy", "Pydantic", "Stripe", "JWT"] },
        { name: "AWS", items: ["ECS Fargate", "RDS Postgres", "S3", "SQS workers", "AWS CDK"] },
      ],
      cta: { label: "Join the waitlist", href: "#contact" },
    },
  },
  {
    slug: "morrow",
    stage: "morrow",
    name: "Morrow",
    tags: ["Our product", "In-house model", "Invite only"],
    line: "The daily puzzles people pay a subscription for, free every morning. A model we trained in house writes them.",
    cardLine: "The puzzles people pay for, free every morning. Written by our model.",
    face: {
      painting: "diag",
      position: "60% 50%",
      accent: { color: "#4e8a6a", strength: 0.86 },
      shade: [0.06, 0.3],
      feature: { kind: "film", id: "lattice" },
      mark: true,
    },
    modal: {
      label: "Our product · Web · Invite only",
      title: { lead: "The puzzles people pay for,", rest: "free every morning." },
      overview: {
        body: "Morrow has the kinds of daily puzzles people usually pay a subscription for: a crossword and a mini, five-letter words, bundles, word threads, number place and more. AI writes them, which makes them cheap enough to give away, so at midnight the same eleven arrive for everyone, free. Eight Odds games, where you play against a language model’s guesses, a Wednesday special and a monthly Almanac sit around them.",
        stats: [
          { value: "11", label: "new puzzles every day" },
          { value: "1 answer", label: "each, proved by a solver" },
          { value: "8 Odds", label: "games against a model" },
        ],
      },
      model: {
        // TODO founders: confirm "4,000 drafts a night" (and the 4,000 / 1,150 / 140 / 11 funnel) and "less than a cent".
        body: "Our puzzle model is trained in house to do what a puzzle editor does. Every night it drafts about 4,000 candidates. Solvers then play every one: any puzzle with a second answer, a dead end or a dull path is thrown out, and the rest are ranked by how they feel to solve. Eleven survive. Because the model is small and ours, a whole day of fresh puzzles costs less than a cent to make. That is the point: AI should make good entertainment cheaper for everyone, not another subscription.",
        figure: { key: "morrow", steps: ["4,000 drafts a night", "Solvers play each one", "Eleven make the morning"] },
        stats: [
          // TODO founders: confirm "4,000", "1 in 360" and "< 1¢".
          { value: "4,000", label: "drafts every night" },
          { value: "1 in 360", label: "makes it to the morning" },
          { value: "< 1¢", label: "to make a whole day" },
        ],
      },
      stack: [
        { name: "Model", items: ["In-house puzzle model", "Language-model word odds", "Nightly generation"] },
        {
          name: "Generators and solvers",
          items: ["Backtracking constructors", "Uniqueness solvers", "Breadth-first proofs", "Per-game validators"],
        },
        {
          name: "Web app",
          items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "three.js", "TanStack Query"],
        },
        {
          name: "API",
          items: ["FastAPI", "SQLAlchemy 2, async", "Alembic", "PostgreSQL 17", "Pydantic", "Stripe"],
        },
        { name: "Quality", items: ["Playwright", "Vitest", "pytest", "mypy", "Ruff"] },
        { name: "Hosting", items: ["Render"] },
      ],
      cta: { label: "Open Morrow", href: "https://morrow.adamass.se" },
    },
  },
  {
    slug: "paint-by-numbers",
    stage: "studio",
    name: "Adamass Studio",
    tags: ["Our product", "Diffusion model", "Live"],
    line: "Paint-by-numbers kits from any picture. A diffusion model we trained repaints it to be painted, and our code finds every colour it used and numbers it.",
    cardLine: "Paint-by-numbers kits from any picture, close to the photo it came from.",
    face: {
      painting: "tall",
      position: "40% 30%",
      accent: { color: "#9a4b5e", strength: 0.78 },
      shade: [0.06, 0.32],
      feature: { kind: "lines" },
      mark: true,
    },
    modal: {
      label: "Our product · Web · Live",
      title: { lead: "Any picture,", rest: "ready to paint by numbers." },
      overview: {
        body: "Adamass Studio turns a picture into a paint-by-numbers kit: the numbered template, a colour key with plain paint names, and a preview of the finished painting, as a printable A4 at low, medium or high detail. Original works come in collections, and turning your own photo into a kit is next.",
        stats: [
          { value: "3 levels", label: "of detail on every work" },
          { value: "Free", label: "A4 kits to print, with the colour key" },
          { value: "Your photo", label: "turned into a kit, coming next" },
        ],
      },
      model: {
        // TODO founders: confirm how the diffusion model was trained (base model, data) before naming more.
        body: "We trained a diffusion model to repaint a picture the way a kit needs it: clear areas of colour, with the detail kept. Our code then reads the exact colours the model painted, groups them the way eyes see colour rather than by their hex codes, and merges every patch too small to paint into its neighbour. Because the model paints in high detail, a kit can come close to the quality of the photo.",
        figure: { key: "pnb", steps: ["A picture in", "Our model paints it flat", "Each colour found and numbered"] },
        stats: [
          { value: "35,684 → 431", label: "areas on one photo, after the clean-up" },
          { value: "0", label: "areas too small to hold a number" },
          { value: "< 10 s", label: "to cut a painted picture into a kit" },
        ],
      },
      stack: [
        { name: "Model", items: ["Diffusion model trained in house", "Colour grouping in OKLab", "ΔE2000 colour matching"] },
        {
          name: "Generator",
          items: ["Python", "NumPy", "SciPy", "scikit-image", "scikit-learn", "OpenCV", "ReportLab"],
        },
        { name: "Web app", items: ["FastAPI", "Jinja2", "PostgreSQL 17", "psycopg 3", "Pydantic"] },
        { name: "Hosting", items: ["Vercel", "Neon Postgres", "Vercel Blob"] },
      ],
      cta: { label: "Open Adamass Studio", href: "https://adamass.studio" },
    },
  },
  {
    slug: "compliance-slm",
    stage: "compliance",
    name: "Compliance SLM",
    tags: ["Client work", "27B model, dual RAG", "Private cloud"],
    line: "A first-pass regulatory auditor, private to the client’s cloud. A 27B model and a library of known controls, and 94 in 100 of its answers match the reviewer.",
    cardLine: "A first-pass auditor in the client’s cloud. 94 in 100 match the reviewer.",
    face: {
      painting: "wide",
      position: "20% 50%",
      shade: [0.1, 0.34],
      feature: { kind: "dots", filled: 94, total: 100 },
    },
    modal: {
      label: "Client work · Regulatory model",
      title: { lead: "A compliance SLM,", rest: "private to the client’s cloud." },
      overview: {
        body: "It reads a regulatory article or a policy and returns the risks and controls that bind, or nothing when the text does not. Two parts work together: a 27B model we fine-tuned for the job, and library-backed extraction, where every answer is bound to a library of known risks and controls, so it is one the reviewers already recognise. A reviewer still signs. Built for a client in a regulated industry, it runs inside their own AWS account.",
        charts: {
          size: {
            label: "Model size",
            description: "27 billion parameters, shown as 27 squares of one billion each",
            billions: 27,
            strong: "27B",
            rest: "parameters, one square per billion",
          },
          agreement: {
            label: "Held-out test",
            description: "94 of 100 held-out answers match the reviewer",
            matched: 94,
            total: 100,
            strong: "94 in 100",
            rest: "answers match the reviewer",
          },
        },
      },
      model: {
        body: "A 27B specialist model, developed from an expert-labelled workflow and built with supervised fine-tuning and reinforcement learning. Synthetic data covers the rare labels. It is scored on a held-out gold set, with the expert labels withheld from training. Beside it, two retrieval paths run side by side, one over the document and one over the library, and extraction is bound to that library: in standardized domains, where it already exists, and in new ones, where we build it with the client first.",
        figure: {
          key: "slm",
          steps: ["Expert-labelled work", "Synthetic data for rare labels", "Fine-tuned, then reinforced", "Held-out gold set"],
        },
        capabilities: {
          label: "What the model does",
          items: [
            { text: "Returns the risks a regulatory article creates", value: "94% match" },
            { text: "Maps every risk to the control that answers it", value: "93% match" },
            { text: "Answers only with controls the library holds", value: "Bound" },
            { text: "Emits output the downstream system can parse", value: "100%" },
            { text: "Covers rare labels through synthetic data", value: "Synthetic" },
            { text: "Returns nothing when the text does not bind", value: "Guardrail" },
            { text: "Leaves the client’s own AWS account", value: "Never" },
            { text: "Signs the compliance opinion", value: "Never" },
          ],
        },
        more: [
          "We design AI frameworks and architectures like this for other needs too: agent workflows with a person in the loop, document review, decision support. Each one is shaped around the job, and runs where the data already lives.",
        ],
      },
      stack: [
        {
          name: "Model",
          items: ["27B specialist model", "Supervised fine-tuning", "Reinforcement learning", "Synthetic data", "Held-out gold set"],
        },
        // TODO founders: confirm the extraction stack (Retrieval, Libraries and Workflow items).
        { name: "Retrieval", items: ["Dual RAG", "Library-backed extraction", "Reranking"] },
        { name: "Libraries", items: ["Standard control libraries", "Custom libraries built with the client"] },
        { name: "Workflow", items: ["Human-in-the-loop review", "Agentic workflow engine"] },
        {
          name: "AWS",
          items: ["Control Tower", "Organisations", "IAM", "Amazon S3", "SageMaker", "Amazon VPC", "CloudWatch", "Budgets"],
        },
      ],
      cta: { label: "Ask about a similar model", href: "#contact" },
    },
  },
];

export type WorkSectionContent = {
  headline: Headline;
  intro: string;
  learnMore: string;
  /** The fifth card: other client work, which is under NDA. */
  ask: {
    label: string;
    name: string;
    line: string;
    action: LinkAction;
    face: CardFace;
  };
  modal: {
    tabs: { overview: string; model: string; stack: string };
    close: string;
    escapeHint: string;
    /** Read after a link to one of our product sites, which opens in a new tab. */
    newTab: string;
    previous: string;
    next: string;
    write: LinkAction;
  };
};

export const workSection: WorkSectionContent = {
  headline: { lead: "Selected work.", rest: "Ours, and one we can show." },
  intro: "Three are products we build and run ourselves. One is an AI system we built for a client in regulated work.",
  learnMore: "Learn more",
  ask: {
    label: "More work",
    name: "Ask about other work",
    line: "Most client work is under NDA. Tell us the problem and we’ll show you what fits.",
    action: { label: "Send a short brief", href: `#${anchors.contact}` },
    face: {
      painting: "diag",
      position: "15% 60%",
      accent: { color: "#1b1d22", strength: 1 },
      shade: [0.5, 0.66],
      feature: { kind: "nda" },
      mark: true,
    },
  },
  modal: {
    tabs: { overview: "Overview", model: "The model", stack: "Stack" },
    close: "Close",
    escapeHint: "ESC",
    newTab: "(opens in a new tab)",
    previous: "Previous",
    next: "Next",
    write: {
      label: "Write to Aleksandar",
      href: `mailto:${aleksandar?.email ?? "aleksandar.kotevski@adamass.se"}`,
    },
  },
};

/** The hash that opens a product's modal, so it can be linked to. */
export const workHash = (slug: ProductSlug) => `work/${slug}`;

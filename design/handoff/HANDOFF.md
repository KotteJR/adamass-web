# Adamass site build: handoff

Build the new adamass.se home page in this Next.js app, from the designs the founders approved in the canvas.
Read `AGENTS.md` first: this Next.js (16.4) differs from older versions; check `node_modules/next/dist/docs` before using an API.

## Stack

- Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS 4.
- shadcn/ui as the base layer (init it for Tailwind 4, `components.json`, `components/ui/*`). Our own components sit on top of it and never edit generated shadcn files beyond theming.
- One component per `.tsx` file, imported where used. No barrel files that pull client code into server components.
- Server components by default. `"use client"` only on interactive leaves (listed per section below).
- `next/font` for Geist, Geist Mono, Instrument Serif and Bricolage Grotesque.
- No new dependencies beyond shadcn's own (Radix, class-variance-authority, clsx, tailwind-merge, lucide-react). No animation library: CSS and small hooks are enough.

## Source of truth

`design/handoff/boards/*.dc.html` are the approved designs, as 1440 px wide HTML with inline styles. Open them in a browser; `/_blob/<id>` URLs map to files through `assets/blob-map.json`.

Approved, build these:

| Board | What it is |
|---|---|
| `HeroA` | Hero: two-line headline (grey line, then ink line), "Send a short brief" + arrow button on the right, one wide painting band edge to edge (the founders made it full-bleed), then a short line about the studio and the client logos. |
| `Statement` | "One senior, start to handover." with the two paragraphs, then **Four ways in** as a sticky scroll: text on the left scrolls, the figure on the right stays and changes per service. |
| `AwsExplorer` | AWS: five tabs whose active background slides and joins the panel, the isometric cabinet figure (one motion story per service), text on the right, "How buying works / Billing / All listings" below. Keep the founders' sizing from this file. |
| `More` | Use these parts: "How long work runs" (log-scale range chart), "How an engagement runs" (four steps), and the CTA at the bottom: headline left, card on the painting right with two tabs, **Reach out** (brief form) and **How it works** (four steps, this replaces an FAQ). Ignore the case study block at the top: it is being redesigned (see Pending). |
| `Closing` | Light end screen: full-width painting, the sketched [a] mark drawing itself, "Adamass", the tagline, "Send a short brief" and "Back to top", client logos, and a live Malmö clock whose time of day tints the sky (dawn, day, dusk, night). Thin white footer below. |

Reference only: `HeroB`, `Main` (hero C, a live product window), `FourWays` (grid alternative), `Products` (old products section, being redesigned), `System` (tokens).

## Page order (home)

1. Nav + Hero A, with the client logo row.
2. Statement (two paragraphs).
3. Four ways in (sticky scroll with figures).
4. Selected work. **Pending design**, see below.
5. Our products (Murmur, Morrow). **Pending design**, see below.
6. AWS explorer.
7. How long work runs + How an engagement runs.
8. CTA (Reach out / How it works).
9. End screen + footer.

## Pending: Selected work, Our products, our names

These are being redesigned in the canvas right now, after Studio Sphere's "Latest work" pattern (a calm case card: name, one line, one result, platform and year, open case). Build the sections with the data model and a clean neutral layout so they slot in; the final design will be sent to you as new board files in `design/handoff/boards/` and a message.

The founders' names must appear on the page: **Vlatko Kotevski, CEO** and **Aleksandar Kotevski, Partner, GenAI and ML** (emails `vlatko.kotevski@adamass.se`, `aleksandar.kotevski@adamass.se`). They are in the CTA card already; more placement comes with the pending design.

## Tokens

Put these in CSS variables (shadcn's theme variables map onto them) and Tailwind theme:

- Neutrals: ink `#111214`, slate `#6B7079`, haze `#A3A8B0`, line `#E4E3DF`, paper `#F7F7F5`, white `#FFFFFF`, soft fill `#F3F2EE`.
- Blues: deep steel `#1F3A5C`, steel `#4171A9`, lit `#2F5B8C` (the one lit part of a figure, links on hover), sky `#C9D5E3`.
- Type: Geist 500 for headlines (tight tracking, about -0.04em at display sizes), 400 for text; Geist Mono only for small uppercase labels. Headlines are two lines: ink, then haze. No blue words.
- Radii: cards 12, buttons 8 (the hero uses 4), chips and tags 4 to 6. Paintings are square edged when full-bleed.
- **No hairlines**: no divider borders in lists, specs, footers or between rows. Separate with space and soft fills (`#F3F2EE`, `#F7F7F5`). Outlined buttons become soft filled ones.
- Paintings: `assets/paint-wide.webp` (hero, CTA card, end screen), `paint-tall.webp`, `paint-diag.webp`. They drift very slowly (scale 1.06, translateX ±1.2 %, 26–30 s, alternate). Gradients `steel/dusk/pale/steel-tall.webp` are older stages; prefer the paintings.
- Light mode is the primary mode. Prepare dark tokens with `next-themes`, but don't spend time on a dark design.

## Components and behaviour

- **Logo**: `assets/adamass-lockup-primary.svg` / `-reversed.svg` as an SVG component.
- **Client logos**: the real logos are in `public/clients` (IKEA, Nasdaq, Tele2, Thomson Reuters, The Guardian, Liverpool, Stabenfeldt, Eyeradar, plus Boksy, Rething, The Future Cats, Zoion; use the first eight unless told otherwise). **Not a marquee.** Show five slots; every ~3 s one slot at a time crossfades to the next logo, staggered, like a slow shuffle. Monochrome (CSS filter or currentColor SVG), same optical height. Reduced motion: static. Client component.
- **Painting**: a server component around `next/image` with the drift animation in CSS; `preload`/priority on the hero image only (check the Next 16 docs for the right prop).
- **Isometric figures**: `figures/*.svg` with `figures/figures.css` (four services) and `figures/aws-cabinet.svg` with `aws-cabinet.css`. Wrap each as a TSX component that renders the SVG inline (server component), and move its keyframes into a CSS module. Pause animations while offscreen (an IntersectionObserver toggles `data-playing`), and stop them under `prefers-reduced-motion`. The generators in `generators/` (Python) made these SVGs; you don't need to run them.
- **Four ways in**: left column of four 520 px steps, right a sticky 760 px tall figure panel. Drive it with CSS scroll-driven animation (`animation-timeline: view()`, see the board's CSS) and fall back to an IntersectionObserver that sets the active index. Inactive steps fade to about 0.06. On mobile, stack each figure above its text instead of sticking. The client part is only the fallback observer.
- **AWS explorer**: data in `content/services.ts` (`awsOffers`), with the copy and readouts from the board. Tabs follow the WAI-ARIA tabs pattern (roving tabindex, arrow keys, `aria-controls`); the shadcn Tabs primitive is fine if you can style the sliding background. It auto-advances every 8 s until the user touches it. The figure's mode (`lz`, `aas`, `sap`, `mig`, `genai`) is a class on the wrapper; each mode loops its own animation; the right-hand text slides in on change. Client component for the tabs; the figure itself stays a server-rendered SVG.
- **Range chart** ("How long work runs"): plain SVG or CSS grid, log scale, bars grow in once when they enter view.
- **CTA**: shadcn Tabs inside a card on the painting. Reach out: service chips (single select), name, work email, brief textarea, submit. Wire it to a server action that validates (zod is fine if shadcn's form setup adds it) and returns a friendly state; sending can be a stub with a TODO. How it works: the four steps from the board.
- **End screen**: live clock in `Europe/Stockholm` (client component, updates every 20 s), phase tint, the mark draws itself once with `stroke-dashoffset`, "Back to top" scrolls to `#top`.
- **Nav**: logo, Work, Services, AWS, Studio, active dot style from Hero A; a sheet menu on mobile (shadcn Sheet).

## Content

Keep copy in typed `content/*.ts` files, not inside components. Facts, all from adamass.se:

- Services (Four ways in): Embedded delivery (3 months to 2 years), Modernisation (phased, not a rewrite), Diligence and advisory (3 to 5 weeks), GenAI development (8 to 14 weeks). Copy and specs are in the `Statement` board.
- AWS Marketplace: Landing Zone Foundation, Architect as a Service, Sovereign AI Perimeter (listing URLs in `content/services.ts`), plus Migration and GenAI on Bedrock delivered directly.
- Selected work: regulatory model, 27B parameters, 94 in 100 match the reviewer on a held-out test, deployed in the client's AWS account; architecture: Control Tower, Organizations, IAM, S3, SageMaker, VPC, CloudWatch, Budgets.
- Company: Adamass AB, Nordmannagatan 35B, 217 74 Malmö, Org. nr 559151-2388, since 2019, hello@adamass.se. See `content/site.ts`.
- Older content files (`content/services.ts` capabilities, `content/projects.ts`) predate this direction; update them rather than trusting them where they disagree with the boards.

## Structure and practice

- `app/layout.tsx` (fonts, metadata, theme provider), `app/page.tsx` composes sections only.
- `components/sections/*` one file per section; `components/brand/*` (logo, painting, figures, client logos, clock); `components/ui/*` shadcn only.
- Typed props, no `any`. Semantic landmarks, one `h1`, headings in order, visible focus, alt text, `prefers-reduced-motion` everywhere motion exists.
- Metadata and Open Graph, `sitemap.ts`, `robots.ts`, Organization JSON-LD.
- Remove leftovers from earlier experiments (`components/art`, `components/blocks`, the `/lab` page) once nothing imports them.
- Done means: `npm run lint`, a typecheck and `npm run build` pass; the home page matches the boards at 1440 px and works at 390 px; a short README section explains the structure. Don't commit or push; leave the work in the working tree.

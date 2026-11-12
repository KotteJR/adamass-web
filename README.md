# adamass-web

The adamass.se home page. Next.js 16 (App Router, Cache Components), React 19,
TypeScript strict, Tailwind CSS 4, shadcn/ui on Radix. The approved designs and
the written spec are in `design/handoff/` (read `HANDOFF.md` first; treat the
folder as read-only input).

```bash
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck  # next typegen && tsc --noEmit
npm run build
```

## Structure

```
app/
  layout.tsx            fonts (next/font), metadata, theme provider, header, footer, the
                        brief modal and the Organization JSON-LD
  page.tsx              composes the sections; nothing else
  globals.css           tokens: palette, shadcn variables, type scale, radii, keyframes, the
                        one page gutter (--gutter: 16 / 24 / 32 px), --page-max (1600), the
                        Statement/Four ways split (--split-aside 760, --split-gap 48)
  actions/send-brief.ts server action behind the brief form (delivery is a stub, see TODO)
  opengraph-image.tsx   share card; sitemap.ts, robots.ts, icon.svg
components/
  ui/                   shadcn only (accordion, button, dialog, tabs, sheet, input, textarea, label);
                        theming only
  contact/              the brief modal: ContactModal (server), ContactDialog (client, follows
                        #contact), ContactCard, BriefForm, FieldError
  kit/                  our primitives on top: Container (the only place the gutter is set),
                        SectionHeading, MonoLabel, Tag,
                        SpecList, NumberedSteps, ActionLink, ArrowLink, PersonLink
  brand/                Logo, Painting, ClientLogo(s), MalmoClock, SketchMark, figures/
  brand/figures/        one wrapper per isometric figure + CSS modules with the keyframes;
                        art/ is generated from design/handoff/figures (do not edit)
  products/stages/      the live product stages (Murmur, Morrow, Compliance SLM), each in a
                        card (780 x 450) and a modal (600 x 780) shape, with a CSS module of
                        keyframes; FitStage scales a stage into a fluid box; stage fonts
  products/models/      "The model" figures for the product modal; art/ is generated
  motion/               PlayWhenVisible (data-playing), RevealOnce (data-revealed)
  sections/             one file per page section; their parts in a folder of the same name
  site/                 SiteHeader, MobileNav, SiteFooter, SkipLink, ThemeProvider
content/                all copy and data, typed (site, home, services, work, product-stages,
                        process, contact, clients)
hooks/                  useInView, useReducedMotion, usePageVisible
lib/                    cn, brief validation, JSON-LD
scripts/                figures-to-tsx.mjs, build-client-logos.mjs (no dependencies)
assets/                 paintings and Murmur's clouds, imported by next/image; the OG card's painting
```

Server components by default. Client components are only the interactive
leaves: `ClientLogos`, `MalmoClock`, `WorkDialog` and `ProductModalBody` (the
product modal), `FitStage`, `StockholmDate`, `MidnightCountdown`, `AwsExplorer`,
`ContactDialog`, `ContactCard`, `BriefForm`, `MobileNav`, `StepObserver`,
`PlayWhenVisible`, `RevealOnce`, `ThemeProvider`.

## Selected work and the product modal (round 2)

From `design/handoff/HANDOFF-round2.md`. An index of four rows (Murmur, Morrow,
Compliance SLM, Library-backed extraction). Each has a live 520 x 300 preview: the product's stage drawn at
780 x 450 and scaled. The preview and "Learn more" link to the product's hash
(`#work/murmur`, `#work/morrow`, `#work/compliance-slm`,
`#work/library-extraction`). `WorkDialog` follows
that hash, as the brief follows `#contact`.

- **From 1024 px:** the modal is 1200 x 780 in two halves. On the left, the modal
  stage scaled to the height and given the width that is left. On the right, the
  label, heading, tabs (Overview, The model, Stack), a scrolling panel and the buttons.
- **Below 1024 px:** a full-screen sheet with the card stage on top, a floating ✕
  and a sticky footer.
- **Content:** in `content/work.ts`. The client is never named. Facts the
  founders still need to confirm are marked `// TODO founders: confirm`.
- **Morrow's modal stage** plays three 12 s rounds, 36 s in all:
  - Round 1: Quint and Nib. Round 2: Sheaf and Orbit. Round 3: Nonet and Skein.
  - Each is a real puzzle; Today's eleven fills from 1 to 7 across the loop.
  - On the phone sheet only the top half shows (Quint, Sheaf, Nonet).
  - The page preview stays Quint only, on an 11 s loop.
- **Stage keyframes:** `morrow-stage.module.css` and `compliance-stage.module.css`
  are generated from `design/handoff/generators/round2/stages.py` for the exact
  words in `content/product-stages.ts`. Change one and regenerate, or the motion
  stops matching.

## AWS explorer motion (round 2)

- **Cabinet:** the drawing is `figures/aws-cabinet.svg` (through `npm run figures`).
  `aws-cabinet.module.css` holds the motion from `figures/aws-explorer.css`.
- **Story:** each service is one 9 s story in three steps. The steps are named above
  the drawing (`awsOffers[].steps`) and light in time. Each mode has its own keyframe
  names, so the story and the step highlight restart on every switch.
- **Timing:** the explorer moves on when a story ends (the first step's
  `animationiteration`), so pauses never put the switch out of step. It stops for
  good once a tab is picked.
- **Play state:** the plate owns it for the drawing and the steps together, paused
  offscreen. With reduced motion every mode shows its final state.
- **Tabs:** unchanged.

## Layout and the brief modal

- Every section, the header and the footer sit in `Container`, so they share
  one outer edge at every width. Paintings that run edge to edge sit outside it.
- There is no contact section. Every call to action is a plain link to
  `#contact`; `ContactDialog` opens when the hash is `#contact`, closes on
  Escape, the close button or Back, and hands focus back to the link.
  `/#contact` can be shared.

## Phones

- Below 768 px the type scale steps up (globals.css): body copy, buttons and
  inputs at 16 px. Product windows keep board sizes (`type-fixed`) because they
  are drawn at a fixed size and scaled.
- Tap targets are at least 44 px on phones; gutters and fixed bars respect
  `env(safe-area-inset-*)` (`viewportFit: "cover"`).
- The AWS tabs keep their board look and scroll sideways in their row; the
  brief modal becomes a full-screen sheet; Four ways in drops the sticky
  scroll.

## Tablets and small laptops

Checked at 360, 390, 430, 768, 834, 1024, 1180, 1280 and 1440. Each section
keeps its design and only reflows to fit. Tap targets stay 44 px up to
1023 px; from `lg` they drop to the board sizes.

| Section | Below the split | Split from |
| --- | --- | --- |
| Statement | Heading full width, two paragraph columns under it (`md`) | 1280 (`xl:split-cols`) |
| Four ways in | Stacked; 1024–1279 a two-column row (text, figure), not sticky | 1280, sticky (text column 408 px at 1280) |
| Work, AWS headers | Intro under the heading | 1024 (`lg`), as designed |
| AWS | The five board tabs at every width; where they do not fit (208 px each) the row scrolls sideways and snaps, keeping the active tab in view. Figure left, text right from 768 (text 320 px, 400 from 1024); text under the figure on phones | — |
| Process | Chart and engagement card stacked (the chart track was 120 px beside the card at 1024) | 1280 (`xl`) |
| Footer | Stacked | Three columns from 1024; the nav column takes its content width until 1280 so the links stay on one line |

The AWS tab background is absolutely placed in the first grid cell
(`col-[1/2] row-[1/2]`) and moved by `translateX(index × 100%)`, so it matches
a tab whether or not the row scrolls.

Figure plates in Four ways hide their left caption below 500 px of plate width
(container query), so the two corner captions never meet.

## Motion

- Figures render as inline SVG on the server. `PlayWhenVisible` sets
  `data-playing` near the viewport; without it the CSS module pauses every
  animation. `prefers-reduced-motion` holds the first frame.
- Four ways in is CSS scroll-driven (`view-timeline` per step). `StepObserver`
  writes the active step for browsers without scroll timelines and to rest the
  figures that are faded out.
- Client logos: the whole set (five slots, three on phones) crossfades to the
  next set together, 1.1 s ease-in-out, then holds 4 s. Static for reduced
  motion, paused offscreen and in background tabs.

## Regenerating assets

- Figures changed in `design/handoff/figures`: `npm run figures`.
- New client logo PNGs: add them to `scripts/build-client-logos.mjs`, run
  `npm run logos`, then list them in `content/clients.ts`.

## Pending

- Confirm the facts marked `// TODO founders: confirm` in `content/work.ts`:
  - Murmur: 14,000 hours, scored by ear, 0 audible seams, and naming the ACE-Step base.
  - Morrow: 4,000 drafts and its funnel, 1 in 360, < 1¢.
  - Library-backed extraction: its Stack items.
- The brief form validates and returns a friendly state, but does not send yet:
  pick the channel in `app/actions/send-brief.ts`.
- Dark tokens exist in `globals.css`; the theme is forced to light until a dark
  design exists.

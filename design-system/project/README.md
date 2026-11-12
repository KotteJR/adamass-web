Adamass is a small software studio in Malmö. We build our own products, Murmur and Morrow, and help teams ship theirs: product engineering, applied AI and AWS, led by one senior from first brief to handover. The brand should read like the people behind it: senior, calm and exact. Grays and white carry every page, and one cobalt blue marks the thing that matters.

## Principles

- **Gray carries, blue signals.** In any view, `blue` marks one primary action and one highlighted path. If two things compete for blue, one of them should be ink.
- **Draw the mechanism.** Illustrations explain how something works: a track that branches and merges back, a route across terrain. No stock 3D, no gradients, no people, no glowing brains.
- **Show the construction.** Hairline frames on the shell edges, registration crosses where lines meet, mono coordinates in brackets. The page shows the grid it is built on.
- **Say it once, plainly.** Short sentences. No hype words, no invented numbers, no claims the partners have not confirmed.

## Voice

We write the way a senior engineer talks to a founder: direct, specific, slightly dry.

- "We" is Adamass. "You" is the reader. Sentence case everywhere; `label` text is uppercase mono.
- British spelling: modernisation, organisation, centralised.
- No emoji, no exclamation marks, no "Learn more", no "Click here".
- Name real things: "Amazon Bedrock", "ECS Fargate", "a 40-hour block". Avoid category words like "solutions", "cutting-edge", "seamless", "unlock", "leverage", "empower".
- End a block of copy on one plain sentence in `ink`. That is the sentence a skimmer keeps.

| Do | Don't |
| --- | --- |
| Senior engineering for products that ship. | Empowering businesses with cutting-edge digital solutions. |
| The senior who scopes your project writes the code. | Our world-class team delivers end-to-end excellence. |
| When we leave, the keys stay with you. | We're with you every step of the journey! |
| A written verdict on architecture, operations, security and team. | Unlock actionable insights with our proven framework. |

## Colour

- Pages are `bg`. Plates that hold things (cards, illustrations, the scoper, the AWS panel) are `bg-2`. `bg-3` is for quiet fills only.
- Text: `ink` for headlines and the closing sentence, `ink-2` for running copy, `ink-3` for labels and metadata. Never put `ink-3` text on `bg-3`.
- Two-tone headlines: first line `ink`, the tail `ink-4` (24px and up only). The hero alone uses a `blue-text` tail.
- Blue fills (`blue`) take `on-blue` text. Blue words on a page use `blue-text`, which is lighter in the dark theme so it stays at 7:1.
- Hairlines are `line`. Controls without a fill (chips, inputs) are outlined in `line-control`, which holds 3:1.
- Focus is a 2px solid `blue` outline at a 3px offset, on every interactive element, in both themes.
- Dark theme mirrors the light one token for token. Nothing is inverted by filter; every value is chosen.

## Type

- Geist for language, Geist Mono for coordinates. Both are variable fonts, shipped from `fonts/`.
- Headlines (`display`, `heading`, `subheading`) are weight 500 with tight negative tracking. Running text (`lead`, `body`) is 400.
- `display` is one per page (the hero). On phones it steps down to 44px; `heading` to 34px.
- `label` is always uppercase, two to four words, inside brackets via the `Label` component. `code` is for region ids, tags and numbers.
- Running text stays under `measure` (65 characters).

## Layout and spacing

- One centred shell, `shell-max` 1360px, with a `line` hairline on each edge running the height of the section. Crosses sit where the frame meets a section rule.
- Side gutter: `space-4` on phones, up to `gutter` (56px) on desktop.
- Sections are far apart on purpose: `space-11` above and below on desktop, `space-9` on phones. The Statement block gets the most air on the page.
- Radii by role: `radius-xs` tags, `radius-sm` tabs, `radius-md` windows and screenshots, `radius-lg` cards and plates, `radius-xl` large panels, `radius-pill` buttons, chips and the nav.
- Two shadows only: `shadow-window` for product windows and phones over the hero, `shadow-pop` for small overlays. Everything else separates by plate colour and hairlines.

## Imagery

- **Hero photographs** (`Imagery` assets): one quiet scene in two lights, `hero-light.webp` and `hero-dark.webp`. Sky fills the top two thirds; the headline sits there. The horizon is a low band of pale limestone in fog, and the product windows overlap it.
- Rules for new photographs: landscape, muted, cool, no people, no buildings, no text, no visible sun. Generate light and dark versions of the same scene.
- **Product screenshots** (`Products` assets) are real captures of the live products at 1440×900, always inside a `ProductWindow` or `ProjectCard`, never loose and never mocked up.
- Client work never shows the client's screens.

## Infographics

Five drawings, one per service, built from the brand's own geometry:

| Drawing | Service | What the blue marks |
| --- | --- | --- |
| `iso`, a test bench | Product engineering | The branch that worked, merging back |
| `schematic` | Applied AI | The grounded path from source to answer |
| `contour`, terrain | Modernisation | The new route past the bridge |
| `stack`, exploded layers | Technical diligence | The finding |
| `globe` | AWS | The primary cross-region path |

- Three line tiers: `art` for outlines, `art-2` dashed for guides, `art-ink` for solids and anchors. One blue element per drawing.
- The small black chip with two bars is Adamass, wherever it appears.
- Registration crosses in the four corners of every plate. No text inside drawings.
- On the web, use the `Illustration` component. The `Infographics` asset files are light-only exports for decks.

## Iconography

There is no icon set yet, on purpose. The arrow is drawn inline (1.5px stroke, round caps), and bracketed mono labels do most of the work icons usually do. If the site needs icons later, use Phosphor in its regular weight (the current site already depends on it) and keep it to interface functions: menu, close, theme, external link.

## Logo

- The lockup `[adamass]` with superscript AB, and the mark `[a]` on a blue tile. Use the `Logo` component on the web; the files are under `Logos`.
- The nav uses the lockup at 17px tall. Minimum sizes: lockup 14px, mark 20px. Clear space: half the lockup's height on every side.
- The construction board (`LogoConstruction`) records the mark's real geometry: mirror-exact brackets, the a on a true baseline and x-height, and two deliberate offsets (the bracket group sits 26 units high, and the a sits 10 units left to balance its stem).
- Open decision: the logo files use the previous blue `#0066FF`, while the token `blue` is `#2B5CFF`. The `Logo` component already draws in the token blue.

## Components

Everything is in `components/bundle.js` as `window.Adamass` and expects React 18. Group by job:

- **Brand**: `Logo`, and the `LogoConstruction` board.
- **Actions**: `Button` (ink, blue, quiet, glass), `Chip`.
- **Type**: `Label`, `Tag`, `Headline`.
- **Navigation**: `NavPill`.
- **Sections**: `Hero`, `Statement`, `ProcessSteps`.
- **Showcase**: `ProductWindow`, `ProjectCard`.
- **Infographics**: `Illustration`, `CapabilityCard`.
- **Interactive**: `AwsExplorer` (replaces service charts with a live account map), `Scoper` (four questions that become a brief).
- **Data**: `Specs`.

Each component's page says what it takes and when to use it. The page order and content plan for the website are in the Website section.

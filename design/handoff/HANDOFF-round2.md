# Handoff, round 2: new Selected work, product modals, AWS motions

The founders approved these on the canvas, and the site still shows the old versions. Build them into `adamass-web` with the same stack and rules as `HANDOFF.md`: TypeScript, Tailwind 4, shadcn base, one component per `.tsx`, server components by default, CSS modules for motion, and copy in `content/*.ts`. Don't commit.

**Hard rule:** change only what is listed here. Every other section keeps its current design. On small screens, components only scale, scroll or stack. The AWS explorer's tabs stay exactly as they are.

## Source files

| File | What it is |
|---|---|
| `boards/Work.dc.html` | The new Selected work section: an index of three rows |
| `boards/WorkModalMurmur.dc.html`, `WorkModalMorrow.dc.html`, `WorkModalAuditor.dc.html` | The Learn more modal for each product, open on "The model" tab. In each board, the modal markup for all three products is in the file |
| `boards/AwsExplorer.dc.html` | The AWS explorer with the new cabinet and its motion. Only the figure and the step names above it changed |
| `figures/aws-cabinet.svg` | The new cabinet. It replaces the old one and adds a glass cover, a log pipe, a review bar, a product screen, a check sweep and ticks |
| `figures/aws-explorer.css` | The AWS board CSS. Tab rules are unchanged; take the `.fig …`, `.bm-* …` and `@keyframes` rules for the figure and the step row. It replaces `figures/aws-cabinet.css` |
| `figures/model-slm.svg`, `model-murmur.svg`, `model-morrow.svg`, `models.css` | The isometric figures for each modal's "The model" tab, with their motion |
| `assets/murmur-cloud-wide.webp`, `murmur-cloud-puff.webp`, `morrow-mark.svg` | The products' own art: Murmur's clouds and Morrow's mark. Mapped in `assets/blob-map.json` |
| `generators/round2/*.py` | The Python that wrote the boards, as a reference for exact timings and geometry. Read `stages.py` for the stage markup and keyframe timings, and `build.py` for the content and modal layout. You don't need to run them |

## 1. Selected work (replaces the current section)

> **Update, 12 Nov:** the index rows are replaced by a grid of five cards. This is built in `components/sections/Work.tsx`, `work/WorkCard.tsx`, `work/WorkCardCaption.tsx`, `work/AskCard.tsx`, `work/AskArt.tsx` and `work/Redacted.tsx`. Boards: `Work.dc.html` (desktop), `WorkTablet.dc.html` (834) and `WorkPhone.dc.html` (390).
> - **Layout:** from 1280 px all five sit in one row. From 768 px, two on top and three below (a six-column grid). On phones, two by two, then the ask card across both columns as a short banner.
> - **Each card:** the product's stage in the modal's portrait shape (600×780, scaled to the card), then "01 · Our product", the name, a short `cardLine` and "Learn more ↗". The whole card is one link to `#work/<product>`.
> - **Fifth card:** ink, "Under NDA", redacted lines with a slow highlight, "More we can show on a call." Its link is "Send a short brief →" to `#contact`.
>
> - **Card faces, 12 Nov (later):** the cards no longer show the live stages. Each face is still: one of our paintings recoloured to the card's accent (`mix-blend-mode: color`), one white feature from the work, centred (no captions). The features are Murmur's loop ring, Morrow's solved Quint, the 94-in-100 dot grid, a policy phrase bound to a library control, and a lock over redacted lines. The face data is in `content/work.ts` (`face`), and the components are in `work/faces/`. The live stages stay in the modals. Generator: `generators/round2/cards.py`.
>
> The bullets below describe the earlier rows and are kept for reference.

- **Header:** unchanged: "Selected work. / Ours, and two we can show." and the paragraph on the right.
- **Three index rows:**
  - **Text column:** the number, the name at 56 px, one line of copy, three mono tags and a soft "Learn more ↗" button pinned to the bottom of the row.
  - **Preview column:** a 520×300 live preview, radius 12. The preview is the product's stage rendered at 780×450 and scaled to 0.6667.
  - **Interaction:** the whole preview is a button that opens the modal. On hover the name turns `#2f5b8c` and the button goes ink.
  - **Phones:** the preview goes above the text, at full width and the same 52:30 ratio.
- **No founders row in this section.** The names live only in the contact modal.
- **Stages** go in their own components, for example `components/products/stages/*` plus a CSS module each. Each stage takes `variant: "card" | "modal"` (card 780×450, modal 600×780):
  - **Murmur:** Murmur's own sky gradients cycle through Morning, Afternoon, Evening and Night. Clouds drift. The serif greeting is Newsreader, the "Pick up … where you left it." line Hanken Grotesk and the labels IBM Plex Mono. A white wave flows, and a white pill shows the loop name with an equaliser. Load these three fonts with `next/font` and scope them to the stage.
  - **Morrow:** the real games being played, using Morrow's content from 2026-10-01:
    - Quint, answer STACK: it guesses CRANE, SLACK, STACK, with tiles flipping in Morrow's greens and a corner mark for "present", then the "Solved in 3" toast.
    - Nib, in the modal variant only: the mini crossword `["ARE##","LONG#","LOTUS","#MERE","##RUT"]` with its across clues, filling word by word, then "The big answer was LOTUS."
    - Use Figtree and Bricolage Grotesque. Morrow's logo is `assets/morrow-mark.svg` with the word "morrow".
    - The "New set in" countdown runs to midnight Europe/Stockholm and ticks each second. It needs a small client component.
  - **Compliance SLM:** our wide painting under a dark gradient. The article text has its binding phrases underlined in turn, then three risk → control findings appear, then the "Sent to the reviewer ✓ · 3 risks, 3 controls" chip. The card variant also shows "94 in 100" large.
  - All stage motion is CSS. Timings are in `stages.py`. Pause when off screen, as the existing `PlayWhenVisible` does. Reduced motion shows one still frame (see `REDUCED` in `stages.py`).

## 2. Product modal ("Learn more")

- **Opening and closing:** use shadcn Dialog (Radix). On desktop it is centred, 1200×780 and radius 12, with a blurred dark backdrop. Enter motion follows the board: the panel rises and scales in, the left side's clip-path opens, and the right-side items stagger in. It closes with ✕, Esc or a click outside.
- **Two equal columns:** on the left the stage (modal variant); on the right the content.
  - **Alignment:** both columns have 40 px top padding. The top rows line up (36 px tall), and so do the bottom rows (44 px tall).
- **Right column, top to bottom:**
  1. A mono label, with "ESC" and the ✕ button on the right.
  2. A two-line heading at 38 px, ink then haze.
  3. Tabs: Overview, The model, Stack. Use a segmented track with a sliding white indicator; shadcn Tabs is fine.
  4. A scrolling panel with a fade at the bottom.
  5. A bottom row:
     - **Buttons:** ink "Join the waitlist" (Murmur, Morrow) or "Send a short brief" (Compliance SLM), both linking to `#contact`. Then a soft "Write to Aleksandar" (mailto).
     - **Arrows:** ← and → icon buttons with "n / 3" between them, going to the previous and next product. Switching product resets the tab to Overview.
- **No text inputs anywhere in the modal.**
- **Tab panels** (all copy is in `build.py`'s `P` list):
  - **Overview:** the paragraph, then either three stats or, for the SLM, two charts: 27 squares for 27B and a 100-dot grid with 94 filled.
  - **The model:** the story paragraph, the isometric figure from `figures/model-*.svg` with its numbered caption, then stats, or two extra paragraphs for the SLM.
  - **Stack:** grouped mono labels with soft chips.
- **Phones:** the modal becomes a full-screen sheet. The stage goes on top at about 56vw tall (Morrow's split stage becomes one stage, Quint only). The content scrolls, and the bottom row is a sticky footer with full-width buttons.
- **Each product gets a hash** (`#work/murmur`, `#work/morrow`, `#work/compliance-slm`) so a modal can be linked to.

## 3. Compliance SLM (renamed from Regulatory auditor)

- **Never name the client.** The copy says "Built for a client in a regulated industry".
- **Name:** "Compliance SLM". **Tags:** Client work, 27B model, Dual RAG.
- **Model tab:** two retrieval paths, one reading the regulation and one searching the library of risks and controls. Extraction is bound to the library. It works in standardized domains, where the library exists, and in unstandardized ones, where we build the library with the client first. Then the paragraph about designing AI frameworks and architectures for other needs.

## 4. AWS explorer: the figure only

- **Unchanged:** keep the tabs, panel, text, specs, buttons and layout exactly as they are.
- **Cabinet:** replace it with `figures/aws-cabinet.svg`.
- **Motion:** take the mode motion from `aws-explorer.css`. Each service is one 9 s story in three steps:
  - **Landing Zone:** accounts slide in, the guardrail drops and locks, then logs run down the pipe to one archive.
  - **Architect as a Service:** the 40-hour dial starts, the review bar goes down the accounts, then a decision record prints.
  - **Sovereign AI Perimeter:** glass walls come down, questions arrive over the private cable, then a public call bounces off the glass.
  - **Migration:** the workload goes half in to staging, checks pass and three ticks light, then it goes into production.
  - **GenAI on Bedrock:** the product screen asks, the drawer opens and a card lifts, then the answer goes back with its card.
- **Step names:** replace the figure's top-right caption with the three step names. Each lights in time (step 1 at 0–3 s, step 2 at 3–6 s, step 3 at 6–9 s) with the number in a small blue chip. They live in `awsOffers[].steps` in `content/services.ts`; the text is in the board's script, `beats`.
- **Restart:** each mode's animations, and the step highlight, restart on every switch. The board does this by giving each mode its own keyframe names.
- **Timing:** auto-advance becomes 9 s, matching one story, and stops once the user picks a tab.
- **Off screen and reduced motion:** pause when off screen. With reduced motion, show the final state of each mode.

## 5. Facts to confirm before launch

Mark these in `content/work.ts` with a `// TODO founders: confirm` comment:
- **Murmur:** "14,000 hours", "scored by ear" and "0 audible seams". The Stack tab names the ACE-Step 1.5 Turbo base, which the founders may remove.
- **Morrow:** "4,000 drafts a night", the funnel 4,000 / 1,150 / 140 / 11, "1 in 360" and "< 1¢ a day".
- **Compliance SLM:** the guessed Stack items: SageMaker endpoints, reranking, agentic workflow engine and checkpointed runs.

## Done means

- Desktop at 1440 matches the boards.
- 1280, 1024, 834, 768, 430, 390 and 360 have no horizontal scroll, and nothing redesigned beyond making it fit.
- Touch targets are at least 44 px.
- Lint, typecheck and build pass.
- You send screenshots: the work index and one modal per product at 1440 and 390, and the AWS section at 1440 and 390 showing the original tabs.

## 6. How we work (12 Nov, replaces the dial and the engagement bench)

- **Board:** `boards/Process.dc.html` (generator `generators/round2/build_process3.py`). It shows the section and the end screen under it.
- **Layout:**
  - The heading sits beside its intro on the split grid.
  - Four steps sit in columns. Each has a number, title, kicker, body, and its outputs in mono.
  - "How long work runs" is a plain table (shadcn `Table`). On phones each row stacks.
- **Motion:** none.
- **Backdrop:** one painting (`ClosingBackdrop`) runs behind How we work and the end screen. The section's dark overlay fades out over its last 20rem. The end screen's Malmö sky tint fades in from its top edge, so there is no seam.
- **Removed:** the time dial, the W0–W12 ruler and the isometric bench (`figures/engagement-scene.svg` is no longer used).

## 7. The model tab: one harness (12 Nov)

- **Component:** `components/sections/work/ModelHarness.tsx`, used by all four products. The figure motion stays in `ModelFigure`.
- **Bands:** one outlined frame (1px `#e7e6e1`, radius 12):
  - **Figure:** sits on a paper band.
  - **Steps:** run in even columns (three across, or two by two for four steps), each with a blue mono number.
  - **Bottom:** the stats line up in the same three columns, or the SLM's "What the model does" rows follow.
- **Removed:** `CapabilityList.tsx` (its rows now live in the harness).

## 8. How we work: glass boxes that fill live (12 Nov, replaces the ruler)

- **Ways in:** a row of buttons in the language of the brief form's topic chips (shadcn Tabs, restyled). One row only: where they do not fit, it scrolls sideways. Focus moves with the selection, so the white chosen button is the focus mark. Each length in all is said to screen readers with the timeline.
- **Steps:** four outlined boxes (`StepBoxes.tsx`), one per step, each as wide as the step runs but never too narrow for its name. The name and weeks sit inside. No numbers.
- **Fill (`GlassFill.tsx`):** the boxes fill up to the knob with white frosted glass, drawn as liquid. Each box is an SVG: the glass (a soft gradient, a still highlight and a lit 1 px border) is clipped to the box's rounded corners and masked by the liquid's surface, softened by a 7 px blur.
  - Filled glass stays still. The surface sits exactly on the knob and answers the motion like liquid under g-force, from the speed and acceleration of a smoothed copy of the edge:
    - **Dragging right:** the middle lags and the surface bows in, about 50 px when fast.
    - **Stopping:** it swings back, surges out, wobbles once or twice and settles flat.
    - **Dragging left:** the other way round.
  - At rest it ripples a little, only while on screen.
  - Key presses and the arrows glide the edge on the knob's own curve (0.5 s, ease-out-soft), so they move together.
  - The surface is redrawn every frame outside React. Reduced motion keeps it flat and still.
- **Moments:** small checkpoints on the line (the boxes' bottom edge) where each moment happens, lit once passed. Just above the knob sits the current moment's short name (`label` in `content/process.ts`); it leans along with the knob, so it never runs off either end. That is all: no lists, no bars. The boxes are 112 px tall.
- **Phones (under 640 px; tablets keep the boxes):** nothing to drag. Under the way-in buttons, the way in reads as a list (`StepList.tsx`): the four steps on one thin line, each with a small white mark, its name and its weeks, and under it what happens in it and when (the moment's `when` in blue mono, then its text). The intro there says "Pick a way in to see what happens when." (`introPhone`). The drag rail and its single box are gone (`StepRail.tsx` deleted): on a phone the slider took the page's vertical swipes.
- **Knob:** a white round knob on the boxes' bottom edge, on a Radix Slider (`PlayheadSlider.tsx`) that covers the boxes.
  - You can drag anywhere and it stays where you let go. Pressing jumps there.
  - Arrow keys move a week (a month on the long ways in), Page Up and Page Down jump between moments, and Home and End go to the ends.
- **Line:** one element (in `MomentNote.tsx`) runs from the knob down past the note, at the same `--x` as the knob. The note has no border, so gliding or changing sides never breaks the line.
- **Note:** it hangs beside the line: right, left near the end, or full width where the row is narrow. Its room is as tall as the longest moment, so nothing below moves. The text cross-fades only when the moment changes; pressing the boxes no longer restarts it.
- **Files:** `components/sections/process/` holds `ProcessTimeline`, `EngagementTimeline`, `StepBoxes`, `PlayheadSlider`, `MomentNote`, `GlassFill`, `StepList` (phones), `engagement-math.ts` and `process.module.css`. `components/ui/timeline.tsx` and `RulerSlider.tsx` are gone.
- **Board:** `boards/Process.dc.html` (`build_process13.py`). It has the checkpoints, the word over the knob and the still glass; the liquid surface and its g-force are on the site only. Phones: `boards/ProcessPhone.dc.html` (`build_process_phone.py`), 390 px wide, beside it.
- **Office address:** Fridhemsborg, Fridhemsvägen 2, 217 74 Malmö (`content/site.ts`). Bolagsverket may still list Nordmannagatan 35 B as the registered address.

## 8b. Header, contact modal, fewer numbers (12 Nov)

- **Header (`SiteHeader.tsx`, `HeaderShell.tsx`):**
  - The links are quiet buttons with a soft fill on Work. "Contact" is an ink button, also used in the phone sheet (`contactNav` in `content/site.ts`).
  - The bar hides as you scroll down and comes back on the way up, with a soft white ground.
  - It ignores small or bouncy scrolls and stays away while an in-page link scrolls. It comes back when a link in it is focused.
  - `#top` is now an empty anchor before the bar.
- **Contact modal (`ContactDialog.tsx`):** a plain white card. No painting frame; the page behind is dimmed a little and blurred well out of focus. The More board's brief card matches.
  - **Phones (13 Nov):** a full-screen sheet that slides up solid and back down (no fade, which showed the page's text through the form). The sticky bar with the close button is solid white: Safari drew the frosted one see-through, with the form showing under "Get in touch". No blur behind it, since the sheet covers the page. Focus starts on the dialog itself, so the close button shows no ring on a tap.
- **Fewer numbers:**
  - Removed: "No. 05" and the "Fig n" labels, corner titles, captions and readouts around the Five ways figures (the `number` and `figure` fields are gone from `content/services.ts`).
  - Also removed: the "01 ·" before each work card's kind, the AWS explorer tab numbers and the model harness step numbers.
  - Kept: the "3 / 7" counters, which say where you are.
- **What each service involves (`ServiceFigurePanel.tsx`, `entails` in `content/services.ts`):** under each Five ways figure, a quiet strip of three parts, each a dot, a title and one line, all taken from the service's own copy:
  - **Embedded delivery:** Join, Ship, Step out.
  - **Modernisation:** Assess, Replace, Keep running.
  - **Diligence:** Read, Review, Report.
  - **GenAI:** Test set, Prototype, Live.
  - **SOC 2:** Gap list, Controls, Audit.
  - It shows once the plate is 520 px wide; the figure scales down to the height left above it. Phones keep the figure alone.
  - The Statement board matches.
- **AWS drawing's steps (13 Nov):** on phones the three steps under the cabinet stack one per line instead of two and a straggler.

## 9. The drawn [a] on our cards (12 Nov)

- **Where:** Murmur, Morrow and the Ask card carry a small drawn [a] bottom right: the bracket strokes and the outlined "a" from the end screen's mark, without the construction lines.
- **Component:** `components/brand/DrawnMark.tsx` (it reuses `BRACKETS`, `A_GLYPH` and `A_TRANSFORM` from `SketchMark.tsx`). It is turned on by `face.mark` in `content/work.ts`.
- **Not on client work:** the client-work cards do not carry it.

## 10. SOC 2 readiness (12 Nov)

- **Five ways in:** a fifth service, `soc2`, in `content/services.ts`; the section label is now "Five ways in". `four-ways.module.css` takes five steps. The figure is `figures/soc2-readiness.svg` (generator `generators/round2/soc2.py`, iso kit), converted to `art/Soc2Art.tsx`, with its 9 s motion in `figures.module.css`: the control drawers light, evidence goes to the archive, and the stamp seals the report.
- **How we work:** a fifth way in, "SOC 2 readiness", with eight dated moments from scope to the Type II report. TODO founders: confirm.
- **Wording:** we prepare; an independent auditor carries out the audit and issues the report. Never "certified", "we issue" or "we file".
- **Boards:** `Statement.dc.html` (the five-way sticky scroll) and `Process.dc.html`.

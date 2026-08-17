# Adamass redesign brief

Design read: A boutique IT consultancy site for founders, investors, and engineering leaders who value senior judgement over agency theatre.
Concept spine: Clear signal. Cinematic technical landscapes resolve into plain written decisions.
Delivery tier: Cinema.
Animation mode: animated-website.
Journey shape: Two single-shot films, already supplied with the redesign. Film one resolves through a white wash into scroll-written copy.
Opening transition: a white page with the networked forest image filling oversized Adamass lettering. White cloud cover then clears to reveal Film I. One video only. No zoom.

## Brand

Palette — one hue. Blue at full chroma is the signal; drained blue is type, labels, and surfaces.
- Wash `#EAF1FF`
- Mist `#B9D0FF`
- Soft `#3385FF`
- Core / Signal `#0066FF`
- Deep `#0047B3`
- Ink `#0B1B33`
- Page `#FFFFFF`
- Tint `#F4F7FB`
- Rule `#E9EFF7` — a fill, not a border
- Muted `#8B99AE` — labels only
- Slate `#5B6B85` — secondary prose
- Ochre `#C4714E` — arrows only
- Film `#050B16` · panel `#0C1524` · raised `#16202F`
- Film slate `#94A3BA` · film muted `#5C7395` · film signal `#4D94FF`

Type:
- Familjen Grotesk for language. Display 500 / −0.05em / 0.94. Section 500 / −0.04em / 1.0. Body 17px ink or 15px slate, line-height 1.7.
- Martian Mono for coordinates only: 10–11px, 0.22em, uppercase. Never a sentence. Never above 11px except figures.

Shape:
- 10 swatches · 14 tiles · 16 media · 20 cards/panels · 24 film and large blocks · 999 pills
- No outlines. Separation from space and flat tint. No shadows.

Reusable CSS in `globals.css`:
- `.ui-label` `.ui-display` `.ui-section` `.ui-body` `.ui-body--secondary`
- `.ui-button` `.ui-button--primary` `.ui-button--secondary` `.ui-button--ink`
- `.ui-link` `.ui-tag` `.ui-tag--quiet` `.ui-card` `.ui-panel` `.ui-index` `.ui-list`
- `.ui-figure` `.ui-series` `.ui-matrix`

Wrappers in `/components`: `UiButton` `UiTag` `UiLabel` `UiLink`.

Navigation:
- One centered floating pill containing the logo and all three destinations
- Hide while scrolling down and return immediately on upward intent

## Scroll journeys

Journey one:
1. Adamass: senior delivery and fixed accountability
2. Embedded delivery: one team, shared tools and ownership
3. Modernisation: improve systems without a risky rewrite
4. Diligence and advisory: evidence for decisions

Journey two:
1. Scope: write down the problem and success criteria
2. Delivery: work in the client's systems with visible decisions
3. Handover: transfer source, configuration, notes, and ownership

World grammar:
- Fine high-resolution pixel art of Macedonian places with compute built in
- Blue is the machine; terracotta, stone, olive and bone white are what was already there
- Film I: Ohrid lakeside, through the quiet hand gap, across the lake, up server terraces, down into the forest
- Single start frame only. No flash, no numbers, no text inside the film
- HTML copy lives in a compact white rounded shelf with a two-line title limit

Mobile framing:
- Focal action stays center safe
- Dedicated 720p mobile encodes
- Shelves remain readable without covering most of the film

Delivery budget:
- Desktop films total under 32 MiB
- Mobile films total under 16 MiB

## Page plan

1. Image-filled type opener: Adamass expands into Film I
2. Film journey: capability story
3. Practice: truthful company description and client proof
4. Services: three editorial image-and-copy rows with white-and-blue pixel diagrams
5. Engagement: four concrete working stages in one ruled list
6. Film journey: scope to handover
7. Contact: direct email and named contacts

## Copy rules

- Do not lead with machine learning
- Do not invent evaluation metrics, model accuracy, training rounds, or ownership claims
- Do not claim a delivery model the company has not confirmed
- Use current, user-approved language for embedded work, diligence, advisory, and handover
- Keep one accountable lead and family-style team integration as differentiators

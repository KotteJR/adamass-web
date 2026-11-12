# Website

The plan for the new adamass.se, built from the components in this system. Nothing below is built as pages yet; it waits for approval of the brand.

## Pages

| Path | Page | Built from |
| --- | --- | --- |
| `/` | Home | Hero, client logos, Statement, CapabilityCard ×4, AwsExplorer, ProjectCard (products), ProcessSteps, Scoper |
| `/work` | Work index | ProjectCard grid, filter chips: All, Our products, Client work |
| `/work/[slug]` | Project page | Long form for our products, short form for client work |
| `/start` | Start a project | Scoper on its own |
| `/faq`, `/privacy`, `/terms` | Carried over | Text pages from the current site |

## Home, in order

1. **Hero.** Label `[ ADAMASS AB · MALMÖ · SINCE 2019 ]`. "Senior engineering for / products that ship." One sentence under it. Actions: Start a project, See the work. The ProductWindow shows Murmur and Morrow, with the open "Yours" tab.
2. **Client logos.** The eight logos from the current site, in one muted row.
3. **Statement.** "One lead, / start to handover." Two columns on ownership and handover.
4. **What we do.** Four CapabilityCards: Product engineering, Applied AI, Modernisation, Technical diligence.
5. **AWS.** Headline, then the AwsExplorer with the three Marketplace listings plus migration and GenAI on Bedrock. The globe drawing sits beside the headline.
6. **Our products.** Murmur and Morrow as large ProjectCards.
7. **How we work.** ProcessSteps: Frame, Join, Deliver, Hand over.
8. **Start a project.** The Scoper, with the two partners' names and emails beside it.
9. **Footer.** Lockup, address, org number, LinkedIn, AWS Marketplace profile.

## Project pages

Two templates, one per kind.

**Our products** (Murmur, Morrow): hero screenshot in a ProductWindow, a Specs block (type, platform, stack, status), then three short sections (The idea, What we built, How it runs) and a gallery of real captures.

**Client work** (Cogniveil, the regulatory auditor): no screenshots. An illustration, a Specs block (client, area, our part), and two short sections (What they needed, Where we helped). Written so the client would be comfortable reading it.

## Content model

Each project is one entry: `slug`, `name`, `kind` (product or client), `year`, `oneLiner`, `card`, `role`, `platform`, `stack`, `status`, `cover` and `phone` captures (products only), `art` (an Illustration kind), `sections` and `facts`. Services, AWS offers and the scoper's questions live in the same way, so copy changes never touch components.

## Needs sign-off before launch

- Cogniveil's wording, and whether it can be named.
- The scoper's suggested first steps.
- The logo blue: keep `#0066FF` in the files, or move them to the token blue `#2B5CFF`.
- Which client logos may stay.

import { marketplaceListings, marketplaceNotes } from "./marketplace";
import { faqs } from "./faq";
import {
  SITE_ALLABOLAG,
  SITE_AWS_MARKETPLACE,
  SITE_EMAIL,
  SITE_FOUNDED,
  SITE_LINKEDIN,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_ORG_NUMBER,
  SITE_POSTAL,
  SITE_REGISTERED,
  SITE_SLOGAN,
  SITE_STREET,
  SITE_URL,
  coreServices,
  engagementSteps,
  longDescription,
  people,
  selectedWork,
} from "./site";

export function llmsIndex(): string {
  const serviceLines = coreServices
    .map((service) => `- ${service.name}: ${service.description}`)
    .join("\n");
  const marketLines = marketplaceListings
    .map((listing) => `- [${listing.title}](${listing.href}): ${listing.body}`)
    .join("\n");
  const peopleLines = people
    .map((person) => `- ${person.name}, ${person.role} — ${person.email} — ${person.phone}`)
    .join("\n");
  const stepLines = engagementSteps
    .map((step, index) => `${index + 1}. ${step.name}: ${step.body}`)
    .join("\n");
  const workLines = selectedWork
    .map((item) => `- ${item.title}: ${item.summary}`)
    .join("\n");

  return `# ${SITE_NAME}

> ${longDescription}

${SITE_SLOGAN} Adamass is not a staffing desk and not a slide factory. One named technical lead stays accountable from the first brief through handover. Work happens in the client's repositories, tools, and ceremonies. Decisions are written down. Engagements close when source, configuration, and operating notes are in the client's hands.

## Facts

- Legal name: ${SITE_NAME}
- Organisation number: ${SITE_ORG_NUMBER}
- Address: ${SITE_STREET}, ${SITE_POSTAL} ${SITE_LOCALITY}, Sweden
- Practice since: ${SITE_FOUNDED}
- Registered: ${SITE_REGISTERED}
- Contact: ${SITE_EMAIL}
- LinkedIn: ${SITE_LINKEDIN}
- Company record: ${SITE_ALLABOLAG}
- AWS Marketplace: ${SITE_AWS_MARKETPLACE}
- Site: ${SITE_URL}/

## Services

${serviceLines}

## AWS Marketplace

${marketLines}

## People

${peopleLines}

## How an engagement runs

${stepLines}

## Selected work

${workLines}

## Pages

- [Home](${SITE_URL}/): practice, services, AWS Marketplace, selected work, and contact
- [FAQ](${SITE_URL}/faq): questions about the practice, diligence, Marketplace buying, and how to start
- [Privacy policy](${SITE_URL}/privacy): how Adamass handles personal data
- [Terms of use](${SITE_URL}/terms): terms for using adamass.se
- [Full text](${SITE_URL}/llms-full.txt): plain-text export of the same facts
`;
}

export function llmsFull(): string {
  const serviceBlocks = coreServices
    .map((service) => `### ${service.name}\n\n${service.description}`)
    .join("\n\n");
  const marketBlocks = marketplaceListings
    .map((listing) => {
      const specs = listing.specs
        .map((spec) => `- ${spec.k}: ${spec.v}`)
        .join("\n");
      return `### ${listing.title}\n\n${listing.body}\n\n${specs}\n\nListing: ${listing.href}`;
    })
    .join("\n\n");
  const noteBlocks = marketplaceNotes
    .map((note) => `### ${note.title}\n\n${note.body}`)
    .join("\n\n");
  const faqBlocks = faqs
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");
  const peopleBlocks = people
    .map((person) => `- ${person.name}, ${person.role} — ${person.email} — ${person.phone}`)
    .join("\n");
  const stepBlocks = engagementSteps
    .map((step, index) => `${index + 1}. ${step.name}: ${step.body}`)
    .join("\n");
  const workBlocks = selectedWork
    .map((item) => `### ${item.title}\n\n${item.summary}`)
    .join("\n\n");

  return `# ${SITE_NAME}

${longDescription}

${SITE_SLOGAN}

## Entity

- Legal name: ${SITE_NAME}
- Organisation number: ${SITE_ORG_NUMBER}
- Street: ${SITE_STREET}
- Postcode: ${SITE_POSTAL}
- Locality: ${SITE_LOCALITY}, Sweden
- Practice since: ${SITE_FOUNDED}
- Registered: ${SITE_REGISTERED}
- Email: ${SITE_EMAIL}
- LinkedIn: ${SITE_LINKEDIN}
- Allabolag: ${SITE_ALLABOLAG}
- AWS Marketplace seller: ${SITE_AWS_MARKETPLACE}
- Canonical site: ${SITE_URL}/

## Services

${serviceBlocks}

## AWS Marketplace listings

${marketBlocks}

${noteBlocks}

## People

${peopleBlocks}

## Engagement

${stepBlocks}

## Selected work

${workBlocks}

## FAQ

${faqBlocks}

## Pages

- Home: ${SITE_URL}/
- FAQ: ${SITE_URL}/faq
- Privacy: ${SITE_URL}/privacy
- Terms: ${SITE_URL}/terms
`;
}

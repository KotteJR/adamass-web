import { NumberedSteps } from "@/components/kit/NumberedSteps";
import { PersonLink } from "@/components/kit/PersonLink";
import { getCopy } from "@/content/copy";
import { anchors } from "@/content/site";
import { BriefForm } from "./BriefForm";
import { ContactCard } from "./ContactCard";
import { ContactDialog } from "./ContactDialog";

/** The brief modal, built on the server and opened by any link to #contact. */
export async function ContactModal() {
  const { briefTopics, contact, founders } = await getCopy();
  return (
    <ContactDialog
      hash={anchors.contact}
      label={contact.label}
      title={contact.headline}
      description={contact.body}
      email={contact.email}
      closeLabel={contact.closeLabel}
    >
      <ContactCard
        labels={{ list: contact.tabs.label, reachOut: contact.tabs.reachOut, howItWorks: contact.tabs.howItWorks }}
        reachOut={<BriefForm topics={briefTopics} copy={contact.form} />}
        howItWorks={<NumberedSteps steps={contact.steps} size="sm" />}
        footer={
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-2">
            {founders.map((person) => (
              <li key={person.email}>
                <PersonLink person={person} showEmail />
              </li>
            ))}
          </ul>
        }
      />
    </ContactDialog>
  );
}

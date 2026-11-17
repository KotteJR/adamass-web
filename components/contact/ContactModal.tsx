import { NumberedSteps } from "@/components/kit/NumberedSteps";
import { PersonLink } from "@/components/kit/PersonLink";
import { getCopy, getLang } from "@/content/copy";
import { pathOf } from "@/content/routes";
import { bookingEnabled, bookingHosts, bookingMode } from "@/lib/booking/service";
import { anchors } from "@/content/site";
import { BookingPanel } from "./BookingPanel";
import { BriefForm } from "./BriefForm";
import { ContactCard } from "./ContactCard";
import { ContactDialog } from "./ContactDialog";

/** The contact modal, built on the server and opened by any link to #contact. */
export async function ContactModal() {
  const [lang, { briefTopics, contact, founders }] = await Promise.all([getLang(), getCopy()]);
  // Set up in the environment (docs/booking-setup.md); until then the modal is the brief alone.
  const canBook = bookingEnabled();
  const hosts = canBook ? founders.filter((person) => bookingHosts().includes(person.email.toLowerCase())) : [];
  return (
    <ContactDialog
      hash={anchors.contact}
      label={contact.label}
      title={contact.headline}
      // With the calendar, the brief's own line moves into its tab; the header is just the title.
      description={canBook ? undefined : contact.body}
      email={canBook ? undefined : contact.email}
      closeLabel={contact.closeLabel}
      wide={canBook}
    >
      <ContactCard
        labels={{ list: contact.tabs.label, book: contact.tabs.book, reachOut: contact.tabs.reachOut, howItWorks: contact.tabs.howItWorks }}
        booking={
          canBook ? (
            <BookingPanel
              lang={lang}
              copy={contact.booking}
              form={contact.form}
              topics={briefTopics}
              hosts={hosts.map(({ name, initials, tone }) => ({ name, initials, tone }))}
              mode={bookingMode()}
              bookedPath={pathOf("booked", lang)}
            />
          ) : undefined
        }
        reachOut={
          canBook ? (
            <div className="flex flex-col gap-4">
              <p className="max-w-[460px] text-sm text-slate">
                {contact.body}{" "}
                <a href={contact.email.href} className="py-3.5 font-medium text-ink no-underline hover:text-lit">
                  {contact.email.label}
                </a>
              </p>
              <BriefForm topics={briefTopics} copy={contact.form} />
            </div>
          ) : (
            <BriefForm topics={briefTopics} copy={contact.form} />
          )
        }
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

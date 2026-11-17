import { ActionLink } from "@/components/kit/ActionLink";
import { Container } from "@/components/kit/Container";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { getCopy, getLang } from "@/content/copy";
import { pathOf } from "@/content/routes";
import { BookedDetails } from "./BookedDetails";

/** Where the booking calendar lands: the call is booked, the invitation is on its way. */
export async function BookedPage() {
  const [lang, { pages }] = await Promise.all([getLang(), getCopy()]);
  const { booked } = pages;
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center gap-6 py-16 md:py-24">
      <MonoLabel size="md">{booked.label}</MonoLabel>
      <h1 className="text-5xl font-medium text-balance">
        <span className="block">{booked.title.lead}</span>
        <span className="block text-haze">{booked.title.rest}</span>
      </h1>
      <div className="max-w-[560px]">
        <BookedDetails copy={booked} lang={lang} />
      </div>
      <ActionLink href={pathOf("home", lang)} tone="soft" className="self-start">
        {booked.back}
      </ActionLink>
    </Container>
  );
}

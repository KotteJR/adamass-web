import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of use | ${SITE_NAME}`,
  description:
    "Terms for using adamass.se, the public website of Adamass AB.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <LegalArticle title="Terms of use" updated="17 August 2026">
      <p>
        These terms apply to adamass.se, the public website of Adamass AB in
        Malmö, Sweden. By using the site you agree to them. They cover the
        website only. An engagement with Adamass starts only when both sides
        have agreed it in writing.
      </p>

      <h2>What this site is</h2>
      <p>
        The site describes our practice and how to reach us. Nothing on it is
        an offer, a quote, or professional advice you may rely on for a
        decision. Availability, scope, and fees are confirmed in a written
        engagement if we take the work.
      </p>

      <h2>Contact</h2>
      <p>
        You can write to{" "}
        <a href="mailto:hello@adamass.se">hello@adamass.se</a> or to a named
        person listed on the site. Sending a brief does not create a contract
        or an obligation for us to reply with a proposal. Do not send
        confidential client files, passwords, or personal data you are not
        allowed to share until we have agreed how that material will be
        handled.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Text, film, images, and marks on this site belong to Adamass AB or
        their licensors. You may not copy the site or its assets for a
        commercial purpose without our written consent. Client names and marks
        remain those clients’ property and appear only as public references.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not misuse the site: no scraping that burdens the service, no
        attempt to break security, and no use of the content to misrepresent
        an association with Adamass.
      </p>

      <h2>Liability</h2>
      <p>
        The site is provided as it stands. We take care to keep it accurate,
        but we do not warrant that it is complete, current, or uninterrupted.
        To the extent Swedish law allows, Adamass AB is not liable for loss
        that comes only from using or being unable to use this website. That
        limit does not affect liability that cannot be excluded by law.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal data is set out in the{" "}
        <a href="/privacy">privacy policy</a>.
      </p>

      <h2>Law</h2>
      <p>
        These terms are governed by Swedish law. Courts in Sweden have
        jurisdiction, with Malmö as the first venue where that choice is
        allowed. If a part of these terms cannot be enforced, the rest still
        applies.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms when the site or the practice changes. The
        date at the top is the version that applies.
      </p>
    </LegalArticle>
  );
}

import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy policy | ${SITE_NAME}`,
  description:
    "How Adamass AB handles personal data on adamass.se and in email correspondence.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalArticle title="Privacy policy" updated="17 August 2026">
      <p>
        This policy explains how Adamass AB (“Adamass”, “we”) handles personal
        data when you use adamass.se or write to us. We are a boutique IT
        consultancy based in Malmö, Sweden. We do not run advertising, and this
        website does not use marketing or analytics cookies.
      </p>

      <h2>Who is responsible</h2>
      <p>
        Adamass AB is the controller for personal data described here. Contact
        us at{" "}
        <a href="mailto:hello@adamass.se">hello@adamass.se</a> if you have a
        question about this policy or your data.
      </p>

      <h2>What we collect</h2>
      <p>
        If you email hello@adamass.se or a named person at Adamass, we receive
        the address you send from, the message, and any files you attach. We
        use that only to reply, assess fit, and keep a record of the
        conversation.
      </p>
      <p>
        Our hosting provider may store ordinary technical logs for a short
        time: IP address, browser type, requested page, and time of the
        request. Those logs are used to run and secure the site, not to
        profile you.
      </p>
      <p>
        We do not place tracking cookies, do not use third-party analytics on
        this site, and do not sell personal data.
      </p>

      <h2>Why we process it</h2>
      <p>
        We process enquiry data to take steps at your request before a possible
        engagement, and to respond to messages (GDPR article 6(1)(b)). We
        process hosting logs as a legitimate interest in keeping the site
        available and secure (article 6(1)(f)).
      </p>

      <h2>How long we keep it</h2>
      <p>
        Email is kept for as long as the conversation is active and for a
        reasonable period afterwards, or longer if we must keep it for
        accounting, a contract, or a legal claim. Technical logs are kept only
        as long as the host needs them for operations and security.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We use a website host and email infrastructure to operate adamass.se
        and receive mail. They process data on our instructions. We do not
        share enquiry data with other parties unless you ask us to, a contract
        requires it, or the law does.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask for access to the personal data we hold about you, ask us
        to correct or delete it, restrict or object to certain processing, and
        request portability where that right applies. Write to{" "}
        <a href="mailto:hello@adamass.se">hello@adamass.se</a>. You may also
        lodge a complaint with Integritetsskyddsmyndigheten (IMY), the Swedish
        supervisory authority.
      </p>

      <h2>Changes</h2>
      <p>
        If we change how this site collects data, we will update this page and
        the date above.
      </p>
    </LegalArticle>
  );
}

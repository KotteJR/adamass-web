import type { Metadata } from "next";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import LegalArticle from "@/components/LegalArticle";
import { faqDescription, faqPath, faqTitle, faqUpdated } from "@/lib/faq";
import { faqPageGraph } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: faqTitle,
  description: faqDescription,
  alternates: { canonical: `${SITE_URL}${faqPath}` },
  openGraph: {
    title: `${faqTitle} | ${SITE_NAME}`,
    description: faqDescription,
    url: `${SITE_URL}${faqPath}`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${faqTitle} | ${SITE_NAME}`,
    description: faqDescription,
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqPageGraph()} />
      <LegalArticle title={faqTitle} updated={faqUpdated}>
        <p>
          Plain answers about the practice in Malmö. If the brief is larger
          than these, write to{" "}
          <a href="mailto:hello@adamass.se">hello@adamass.se</a>.
        </p>
        <FaqList />
      </LegalArticle>
    </>
  );
}

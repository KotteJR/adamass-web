import Link from "next/link";
import Header from "@/components/Header";
import { SITE_EMAIL } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="legal-page" tabIndex={-1}>
        <div className="page-shell">
          <div className="missing-page">
            <h1>This page is not here.</h1>
            <p>
              The address may have moved. Go back to the homepage, read the{" "}
              <Link href="/faq">FAQ</Link>, or write to{" "}
              <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.
            </p>
            <Link href="/">Back to Adamass</Link>
          </div>
        </div>
      </main>
    </>
  );
}

import type { ReactNode } from "react";
import Header from "./Header";

type LegalArticleProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export default function LegalArticle({
  title,
  updated,
  children,
}: LegalArticleProps) {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="page-shell">
          <h1>{title}</h1>
          <p className="legal-updated">Last updated {updated}</p>
          <div className="legal-copy">{children}</div>
        </div>
      </main>
    </>
  );
}

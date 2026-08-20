import AdamassLogo from "./AdamassLogo";
import UiLabel from "./UiLabel";
import {
  SITE_LINKEDIN,
  SITE_LOCALITY,
  SITE_COUNTRY_NAME,
  SITE_NAME,
  people,
} from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <AdamassLogo />
          <p>
            {SITE_NAME} is a boutique IT consultancy in {SITE_LOCALITY},{" "}
            {SITE_COUNTRY_NAME}. Senior delivery with a named owner on every
            engagement.
          </p>
        </div>

        <div className="site-footer-links">
          <div>
            <UiLabel>On this page</UiLabel>
            <a href="/#practice">Practice</a>
            <a href="/#work">Work</a>
            <a href="/#contact">Contact</a>
          </div>
          <div>
            <UiLabel>People</UiLabel>
            {people.map((person) => (
              <a key={person.email} href={`mailto:${person.email}`}>
                {person.name}
              </a>
            ))}
            <a
              href={SITE_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
          <div>
            <UiLabel>Legal</UiLabel>
            <a href="/privacy">Privacy policy</a>
            <a href="/terms">Terms of use</a>
          </div>
        </div>
      </div>

      <div className="site-footer-line">
        <span>© {new Date().getFullYear()} {SITE_NAME}</span>
        <span>
          {SITE_LOCALITY}, {SITE_COUNTRY_NAME}
        </span>
      </div>
    </footer>
  );
}

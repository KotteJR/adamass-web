import UiButton from "./UiButton";
import UiLabel from "./UiLabel";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <img
            src="/logo.svg"
            alt="Adamass"
            width={370}
            height={80}
          />
          <p>
            Boutique IT consultancy in Malmö. Senior delivery with a named
            owner on every engagement.
          </p>
          <UiButton href="mailto:hello@adamass.se">Write to us</UiButton>
        </div>

        <div className="site-footer-links">
          <div>
            <UiLabel>On this page</UiLabel>
            <a href="/#practice">Practice</a>
            <a href="/#work">Work</a>
            <a href="/#contact">Contact</a>
          </div>
          <div>
            <UiLabel>Find us</UiLabel>
            <a
              href="https://www.linkedin.com/company/adamass-ab"
              target="_blank"
              rel="noreferrer"
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
        <span>© {new Date().getFullYear()} Adamass AB · 559151-2388</span>
        <span>Malmö, Sweden</span>
      </div>
    </footer>
  );
}

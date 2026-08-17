import ContactBlock from "./ContactBlock";
import SiteFooter from "./SiteFooter";

export default function ContactSection() {
  return (
    <div className="site-end">
      <section
        id="contact"
        className="contact-section"
        aria-labelledby="contact-email"
      >
        <ContactBlock />
      </section>
      <div className="page-shell">
        <SiteFooter />
      </div>
    </div>
  );
}

import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/kit/Container";
import { getCopy } from "@/content/copy";

/** The thin white footer under the end screen. No rules, just space. */
export async function SiteFooter() {
  const { footer, footerNav, site, ui } = await getCopy();
  const { address } = site;
  return (
    <footer className="text-sm text-slate">
      <Container
        className="grid gap-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))] md:min-h-[120px] md:py-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center xl:grid-cols-[1.2fr_1fr_1fr]"
      >
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
          <Logo className="h-4 w-auto" />
          <span>{footer.blurb}</span>
        </div>
        <address className="not-italic">
          <span className="block sm:inline sm:whitespace-nowrap">
            {address.building}, {address.street}, {address.postalCode} {address.city}
          </span>
          <span className="hidden sm:inline"> · </span>
          <span className="block whitespace-nowrap sm:inline">{ui.orgNumber} {site.orgNumber}</span>
        </address>
        <nav aria-label={ui.footerNav}>
          <ul className="flex flex-wrap gap-x-6 lg:justify-end lg:gap-x-[22px] lg:gap-y-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 min-w-11 items-center text-ink-2 transition-colors hover:text-ink lg:min-h-0 lg:min-w-0"
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

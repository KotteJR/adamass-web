import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/kit/Container";
import { getCopy, getLang } from "@/content/copy";
import { pathOf } from "@/content/routes";

/**
 * The white footer under the end screen, in two quiet rows: the mark and the
 * studio's mail, then the legal line with the address and the policies.
 */
export async function SiteFooter() {
  const [lang, { footer, site, ui, pages }] = await Promise.all([getLang(), getCopy()]);
  const { address } = site;
  const link = "inline-flex min-h-11 items-center transition-colors hover:text-ink md:min-h-0";

  return (
    <footer className="text-sm text-slate">
      <Container className="flex flex-col gap-5 pt-10 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:gap-6 md:pt-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Logo className="h-4 w-auto" />
            <span>{footer.blurb}</span>
          </div>
          <a href={`mailto:${site.email}`} className={`self-start text-ink-2 md:self-auto ${link}`}>
            {site.email}
          </a>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/[0.06] pt-5 text-xs md:flex-row md:items-center md:justify-between">
          <address className="not-italic">
            {site.name} · {ui.orgNumber} {site.orgNumber}
            <span className="block md:inline">
              <span aria-hidden className="hidden md:inline"> · </span>
              {address.building}, {address.street}, {address.postalCode} {address.city}
            </span>
          </address>
          <nav aria-label={ui.footerNav} className="flex gap-x-5">
            <a href={pathOf("privacy", lang)} className={link}>
              {pages.footer.privacy}
            </a>
            <a href={pathOf("terms", lang)} className={link}>
              {pages.footer.terms}
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

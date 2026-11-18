import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/kit/Container";
import { getCopy, getLang } from "@/content/copy";
import { homePath } from "@/content/languages";
import { anchors } from "@/content/site";
import { cn } from "@/lib/utils";
import { HeaderShell } from "./HeaderShell";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileNav } from "./MobileNav";
import { SettingsMenu } from "./SettingsMenu";
import { ThemeSwitch } from "./ThemeSwitch";

/**
 * Logo left; on the right the four links as quiet buttons, the settings menu
 * (language) and Contact as an ink one. On phones: a compact bar, the links and the
 * switch in a sheet. It hides as you scroll down and comes back when you
 * scroll up.
 */
export async function SiteHeader() {
  const [lang, { mainNav: sectionNav, contactNav, ui }] = await Promise.all([getLang(), getCopy()]);
  // "#work" becomes "/#work" ("/sv#work"), so the links work from every page, not only the home page.
  const mainNav = sectionNav.map((item) => ({ ...item, href: `${lang === "en" ? "/" : "/sv"}${item.href}` }));
  return (
    <>
      {/* The top of the page, for links back up. The bar itself sticks, so it cannot be the anchor. */}
      <div id={anchors.top} />
      <HeaderShell>
        <Container className="flex h-16 items-center justify-between md:h-[76px]">
          <Link href={homePath[lang]} aria-label={ui.home} className="-mx-2 inline-flex h-11 items-center rounded-md px-2">
            <Logo title={null} className="h-[17px] w-auto" />
          </Link>
          <nav aria-label={ui.mainNav} className="hidden md:block">
            {/* Buttons in the same language as the topic chips in the brief form, and the brief itself in ink. */}
            <ul className="flex items-center gap-1 text-[0.8125rem]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "inline-flex h-9 items-center rounded-sm px-3 transition-colors",
                      item.marked ? "bg-soft font-medium text-ink hover:bg-soft-2" : "text-slate hover:bg-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="ml-1">
                <SettingsMenu current={lang} label={ui.settings} language={ui.language} theme={ui.theme} />
              </li>
              <li className="ml-2">
                <a
                  href={contactNav.href}
                  className="inline-flex h-9 items-center rounded-sm bg-ink px-3.5 font-medium text-canvas transition-colors hover:bg-graphite"
                >
                  {contactNav.label}
                </a>
              </li>
            </ul>
          </nav>
          <MobileNav
            items={mainNav}
            action={contactNav}
            labels={{ openMenu: ui.openMenu, close: ui.closeMenu, navigation: ui.siteNavigation, nav: ui.mainNav }}
            languageSwitch={
              <>
                <LanguageSwitch current={lang} labels={ui.language} size="full" />
                <ThemeSwitch labels={ui.theme} />
              </>
            }
            className="md:hidden"
          />
        </Container>
      </HeaderShell>
    </>
  );
}

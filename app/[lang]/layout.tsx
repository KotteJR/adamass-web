import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ContactModal } from "@/components/contact/ContactModal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { copies, homePath, isLang, languages, ogLocale } from "@/content/languages";
import { anchors } from "@/content/site";
import { serializeJsonLd, siteJsonLd } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
import "../globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Product wordmarks only (Murmur, morrow): not worth a preload.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  preload: false,
});

/** English at /, Swedish at /sv. Both are built ahead of time. */
export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const { site } = copies[lang];
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: `%s · ${site.shortName}` },
    description: site.description,
    applicationName: site.shortName,
    // Each language names the other, so search engines send Swedish searches to /sv.
    alternates: {
      canonical: homePath[lang],
      languages: { en: homePath.en, sv: homePath.sv, "x-default": homePath.en },
    },
    openGraph: {
      type: "website",
      url: homePath[lang],
      siteName: site.shortName,
      title: site.title,
      description: site.description,
      locale: ogLocale[lang],
      alternateLocale: languages.filter((other) => other !== lang).map((other) => ogLocale[other]),
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
    },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  // Lets the page use the whole screen on notched phones; the gutters and
  // fixed bars pad themselves with env(safe-area-inset-*).
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { ui } = copies[lang];

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(geist.variable, geistMono.variable, instrumentSerif.variable, bricolage.variable)}
    >
      {/* A column at least the screen's height: on short pages the footer still sits at the bottom. */}
      <body className="flex min-h-svh flex-col">
        {/* Light is the designed mode. Dark tokens are prepared in globals.css; drop
            forcedTheme (and add a toggle) once a dark design exists. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipLink href={`#${anchors.main}`} label={ui.skipToContent} />
          <SiteHeader />
          <main id={anchors.main} tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <ContactModal />
        </ThemeProvider>
        {/* Page views for the Vercel dashboard: no cookies, nothing stored in the browser (see the privacy policy). */}
        <Analytics />
        {/* Site-wide, and outside <main>: modal dialogs leave the parents of scripts un-hidden. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd(lang)) }} />
      </body>
    </html>
  );
}

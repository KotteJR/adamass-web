import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ContactModal } from "@/components/contact/ContactModal";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SkipLink } from "@/components/site/SkipLink";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { anchors, site } from "@/content/site";
import { organizationJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.shortName}` },
  description: site.description,
  applicationName: site.shortName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.shortName,
    title: site.title,
    description: site.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  // Lets the page use the whole screen on notched phones; the gutters and
  // fixed bars pad themselves with env(safe-area-inset-*).
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(geist.variable, geistMono.variable, instrumentSerif.variable, bricolage.variable)}
    >
      <body>
        {/* Light is the designed mode. Dark tokens are prepared in globals.css; drop
            forcedTheme (and add a toggle) once a dark design exists. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SkipLink href={`#${anchors.main}`} />
          <SiteHeader />
          <main id={anchors.main} tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <ContactModal />
        </ThemeProvider>
        {/* Site-wide, and outside <main>: modal dialogs leave the parents of scripts un-hidden. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd()) }} />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import LenisProvider from "@/components/LenisProvider";
import { defaultDescription, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "dark light",
};

const titleDefault = `${SITE_NAME} | Boutique IT & software consultancy, Malmö`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: titleDefault,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  applicationName: "Adamass",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "software consultancy",
    "IT consultancy Malmö",
    "Sweden software engineering",
    "technical due diligence",
    "legacy modernisation",
    "embedded software team",
    "boutique consultancy",
    "software delivery",
    "generative AI consultancy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: SITE_NAME,
    title: titleDefault,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans antialiased text-[var(--ink)]">
        <OrganizationJsonLd />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

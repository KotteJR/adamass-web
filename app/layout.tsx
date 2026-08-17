import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import { defaultDescription, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Martian_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const title = `${SITE_NAME} | Boutique IT consultancy, Malmö`;

export const viewport: Viewport = {
  themeColor: "#050b16",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: defaultDescription,
  applicationName: "Adamass",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "IT consultancy Malmö",
    "software consultancy Sweden",
    "embedded software delivery",
    "legacy modernisation",
    "technical due diligence",
    "strategic IT advisory",
    "generative AI consultancy",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title,
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <OrganizationJsonLd />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

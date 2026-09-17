import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import JsonLd from "@/components/JsonLd";
import LenisProvider from "@/components/LenisProvider";
import SkipLink from "@/components/SkipLink";
import { organizationGraph } from "@/lib/schema";
import {
  defaultDescription,
  defaultTitle,
  keywords,
  SITE_GEO,
  SITE_LANGUAGE,
  SITE_LOCALE,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_SHORT_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const sans = localFont({
  src: [
    {
      path: "./fonts/familjen-grotesk-latin-wght-normal.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "./fonts/familjen-grotesk-latin-wght-italic.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const mono = localFont({
  src: [
    {
      path: "./fonts/martian-mono-latin-wght-normal.woff2",
      weight: "100 800",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050b16",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  applicationName: SITE_SHORT_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  keywords: [...keywords],
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  appleWebApp: {
    capable: true,
    title: SITE_SHORT_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
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
  other: {
    "geo.region": "SE-M",
    "geo.placename": SITE_LOCALITY,
    "geo.position": `${SITE_GEO.latitude};${SITE_GEO.longitude}`,
    ICBM: `${SITE_GEO.latitude}, ${SITE_GEO.longitude}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE_LANGUAGE} className={`${sans.variable} ${mono.variable}`}>
      <head>
        {/* Runs before first paint: a restored offset would drop the visitor
            into the middle of a scroll-scrubbed film. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual'}if(!location.hash){window.scrollTo(0,0)}",
          }}
        />
      </head>
      <body>
        <SkipLink />
        <JsonLd data={organizationGraph()} />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
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

export const metadata: Metadata = {
  title: "Adamass — AI & ML consultancy, Malmö",
  description:
    "Boutique AI and machine learning consultancy. Generative AI, ML engineering, legacy modernisation, technical due diligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${ibmPlexMono.variable}`}>
      <body className="font-sans antialiased text-[var(--ink)]">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

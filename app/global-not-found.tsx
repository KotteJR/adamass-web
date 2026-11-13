import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Logo } from "@/components/brand/Logo";
import { homePath } from "@/content/languages";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page not found · Adamass",
  robots: { index: false },
};

/** A URL that matches nothing. The layout is per language, so this page says it in both. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-svh flex-col items-start justify-center gap-6 px-6 sm:px-12">
        <Logo className="h-[17px] w-auto" />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium tracking-[-0.03em]">This page does not exist.</h1>
          <p lang="sv" className="text-lg text-slate">
            Sidan finns inte.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <a href={homePath.en} className="inline-flex h-10 items-center rounded-sm bg-ink px-4 font-medium text-white">
            Adamass home
          </a>
          <a
            href={homePath.sv}
            lang="sv"
            className="inline-flex h-10 items-center rounded-sm bg-soft px-4 font-medium text-ink"
          >
            Till startsidan
          </a>
        </div>
      </body>
    </html>
  );
}

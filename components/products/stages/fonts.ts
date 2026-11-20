import { Hanken_Grotesk, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { cn } from "@/lib/utils";

// The products' own type, scoped to their stages. None preload: the stages sit
// below the fold. Morrow's Geist is already on the page (layout, loaded only where used).

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  preload: false,
});

const hanken = Hanken_Grotesk({ variable: "--font-hanken-grotesk", subsets: ["latin"], preload: false });

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  preload: false,
});

/** Newsreader, Hanken Grotesk and IBM Plex Mono, for Murmur. */
export const murmurFonts = cn(newsreader.variable, hanken.variable, plexMono.variable);

// Copy for the home page sections that are not services, work or contact.
// Source: design/handoff/boards (HeroA, Statement, Closing).

import { anchors } from "./site";
import type { Headline, LinkAction } from "./types";

export type HeroContent = {
  headline: Headline;
  action: LinkAction;
  intro: string;
  clientsLabel: string;
};

export const hero: HeroContent = {
  headline: {
    lead: "Come with the work that feels heavy.",
    rest: "We will make it light.",
  },
  action: { label: "Send a short brief", href: `#${anchors.contact}` },
  intro: "A software and AI company in Malmö since 2019. Data scientists, engineers and architects who join your team or deliver the whole project.",
  clientsLabel: "Clients we have worked with",
};

/** A paragraph, in one colour throughout, with the one action that follows from it. */
export type StatementColumn = {
  text: string;
  action: LinkAction;
  tone: "ink" | "soft";
};

export type StatementContent = {
  headline: Headline;
  columns: StatementColumn[];
};

export const statement: StatementContent = {
  headline: { lead: "A full team,", rest: "working inside yours." },
  columns: [
    {
      text: "Data scientists, ML engineers, software and cloud engineers, and architects, all in one company. We add people to your team where you need more hands, work inside it as one of your own, or take on the whole project with a team of ours, and we grow or shrink with the work.",
      action: { label: "Book a call", href: `#${anchors.contact}` },
      tone: "ink",
    },
    {
      text: "We build and run our own products on the same stack we use for client work, so we only recommend what we would put in production ourselves. Source, configuration and notes move to your team as we go, and when we leave, the keys stay with you.",
      action: { label: "How we work", href: `#${anchors.process}` },
      tone: "soft",
    },
  ],
};

export type DayPhase = "dawn" | "day" | "dusk" | "night";

export type EndScreenContent = {
  name: string;
  tagline: string;
  primary: LinkAction;
  backToTop: LinkAction;
  place: string;
  greetings: Record<DayPhase, string>;
};

export const endScreen: EndScreenContent = {
  name: "Adamass",
  tagline: "Come with the work that feels heavy. We will make it light.",
  primary: { label: "Send a short brief", href: `#${anchors.contact}` },
  backToTop: { label: "Back to top", href: `#${anchors.top}` },
  place: "Malmö",
  greetings: {
    dawn: "Good morning",
    day: "Hello",
    dusk: "Good evening",
    night: "Good night",
  },
};

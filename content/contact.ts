// The brief modal, opened by every call to action (any link to #contact):
// "Reach out" (brief form) and "How it works". Source: design/handoff/boards/More.dc.html.

import { site } from "./site";
import type { Headline, LinkAction, Step } from "./types";

/** What a brief can be about. The server check uses these; the form shows briefTopics. */
export const briefTopicValues = ["embedded", "modernisation", "diligence", "genai", "aws"] as const;

export type BriefTopic = (typeof briefTopicValues)[number];

export type BriefTopicOption = { value: BriefTopic; label: string };

/** The form's topic chips. */
export const briefTopics: BriefTopicOption[] = [
  { value: "embedded", label: "Embedded delivery" },
  { value: "modernisation", label: "Modernisation" },
  { value: "diligence", label: "Diligence" },
  { value: "genai", label: "GenAI" },
  { value: "aws", label: "AWS" },
];

/** What can be wrong with a field. The server returns these; the form shows the words. */
export type BriefError = "topic" | "name" | "nameLong" | "email" | "briefShort" | "briefLong";

export type ContactContent = {
  label: string;
  headline: Headline;
  body: string;
  email: LinkAction;
  closeLabel: string;
  tabs: { label: string; reachOut: string; howItWorks: string };
  form: {
    topicLegend: string;
    name: string;
    email: string;
    brief: string;
    briefPlaceholder: string;
    note: string;
    submit: string;
    pending: string;
    success: { title: string; body: string };
    failed: string;
    invalid: string;
    errors: Record<BriefError, string>;
  };
  steps: Step[];
};

export const contact: ContactContent = {
  label: "Get in touch",
  headline: {
    lead: "Tell us what is in the way.",
    rest: "We will say if we are the right team.",
  },
  body: "Write a few lines about the product and what feels heavy. The people who would do the work read it, not a sales desk.",
  email: { label: site.email, href: `mailto:${site.email}` },
  closeLabel: "Close",
  tabs: { label: "Get in touch", reachOut: "Reach out", howItWorks: "How it works" },
  form: {
    topicLegend: "What is it about?",
    name: "Name",
    email: "Work email",
    brief: "Brief",
    briefPlaceholder: "What feels heavy right now? A few lines is enough.",
    note: "We reply with availability, then a short intro call.",
    submit: "Send brief",
    pending: "Sending",
    success: {
      title: "Thank you. Your brief is with us.",
      body: "The people who would do the work read it, then we reply with availability and a short intro call.",
    },
    failed: `Something went wrong on our side and the brief did not go through. Your text is still here: try again, or write to ${site.email}.`,
    invalid: "A few fields need another look.",
    errors: {
      topic: "Pick what the brief is about.",
      name: "Tell us who you are.",
      nameLong: "That name is longer than we can store.",
      email: "We need an email address we can reply to.",
      briefShort: "A few lines is enough, but we need a few.",
      briefLong: "Keep it under 4,000 characters; we will ask for more.",
    },
  },
  steps: [
    {
      title: "Write a short brief",
      body: `A few lines to ${site.email} is enough. What feels heavy, and by when.`,
    },
    {
      title: "A short call",
      body: "We reply with availability, then thirty minutes to confirm fit, scope and timing.",
    },
    {
      title: "The right people",
      body: "Data scientists, engineers or architects, as many as the work needs, inside your team or alongside it. One named lead stays accountable.",
    },
    {
      title: "Buying through AWS",
      body: "Three services are on AWS Marketplace as private offers, billed to the AWS account you already have.",
    },
  ],
};

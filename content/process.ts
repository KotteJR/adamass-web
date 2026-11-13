// How we work: one engagement you can scrub through. Pick a way in and the bar
// shows its four steps at their real lengths; drag along it (or use the arrow
// keys) and the panel tells what happens at that point. Nothing moves on its own.
// Source: design/handoff/boards/Process.dc.html.

import type { Headline } from "./types";

export type Phase = {
  title: string;
  body: string;
};

/** Something that happens at a point in an engagement. */
export type Moment = {
  /** Weeks from the start. */
  week: number;
  /** How it reads: "Day 1", "Week 6", "Month 6". */
  when: string;
  text: string;
  /** Its short name, on its marker inside the step's box: one or two words, taken from the text. */
  label: string;
};

export type WayIn = {
  id: string;
  label: string;
  /** On the picker, under the label. */
  short: string;
  /** How long it runs in all. */
  length: string;
  /** The engagement drawn on the bar, when the length is a range. */
  shown: string;
  /** How the bar counts: in weeks, or in months for the long ones. */
  unit: "week" | "month";
  /** How long each of the four steps runs here, in weeks. */
  phases: [number, number, number, number];
  moments: Moment[];
  /** Where the handle starts, in weeks. */
  start: number;
};

/** How the timeline names its weeks and months: "Week 6", "Months 1–12". */
export type TimeUnits = { week: string; weeks: string; month: string; months: string };

export type ProcessContent = {
  label: string;
  title: Headline;
  intro: string;
  /** The intro on phones, where the way in is a list to read rather than a line to drag. */
  introPhone: string;
  waysLabel: string;
  lengthLabel: string;
  scrubLabel: string;
  previous: string;
  next: string;
  units: TimeUnits;
  phases: [Phase, Phase, Phase, Phase];
  ways: WayIn[];
  defaultWay: string;
};

export const howWeWork: ProcessContent = {
  label: "How we work",
  title: { lead: "Same four steps,", rest: "a week or two years." },
  intro:
    "A three-week review and two years inside your team run the same way. Pick a way in and drag along the line to see what happens when.",
  introPhone: "A three-week review and two years inside your team run the same way. Pick a way in to see what happens when.",
  waysLabel: "Ways in",
  lengthLabel: "In all",
  scrubLabel: "Where in the engagement",
  previous: "Earlier",
  next: "Later",
  units: { week: "Week", weeks: "Weeks", month: "Month", months: "Months" },
  phases: [
    { title: "Frame", body: "We agree the goal, what is in the way and how we will both know it worked, and write it down." },
    { title: "Join", body: "Our people get access and start inside your team, your tools and your routines." },
    { title: "Deliver", body: "The work lands in small pieces you can see and use. When the evidence changes, so does the plan." },
    { title: "Handover", body: "Code, setup and know-how move to your team, so it all runs without us." },
  ],
  // TODO founders: confirm the step lengths and moments for each way in.
  ways: [
    {
      id: "diligence",
      label: "Diligence and advisory",
      short: "3–5 wk",
      length: "3–5 weeks",
      shown: "4 weeks shown",
      unit: "week",
      phases: [0.5, 0.5, 2.5, 0.5],
      start: 1.5,
      moments: [
        { week: 0, when: "Day 1", text: "We agree the questions with you, or with your investors.", label: "Questions" },
        { week: 0.6, when: "Week 1", text: "Read access to code, cloud and documents, and interviews with your team are booked.", label: "Access" },
        { week: 1.5, when: "Week 2", text: "Architecture, data and delivery are reviewed, with the costs and risks priced.", label: "Review" },
        { week: 2.6, when: "Week 3", text: "Findings are checked with your engineers, so nothing in the report is a surprise.", label: "Check" },
        { week: 3.6, when: "Week 4", text: "A written report: the red flags, what they cost to fix and a 90-day plan, then a read-out.", label: "Report" },
      ],
    },
    {
      id: "architect",
      label: "Architect as a Service",
      short: "40 h",
      length: "40 hours, over up to 2 months",
      shown: "One 40-hour block shown",
      unit: "week",
      phases: [1, 0.5, 5.5, 1],
      start: 2.5,
      moments: [
        { week: 0, when: "Day 1", text: "We agree what the first 40 hours should answer.", label: "Questions" },
        { week: 1.1, when: "Week 2", text: "Read-only access to your AWS accounts and diagrams.", label: "Access" },
        { week: 2.5, when: "Week 3", text: "An architecture review: what holds, what will not, and what it costs to change.", label: "Review" },
        { week: 4.5, when: "Week 5", text: "Decision records for the open choices, ready for your team to sign off.", label: "Decisions" },
        { week: 7.2, when: "Week 8", text: "A roadmap you can act on. Draw down the next block only if you need it.", label: "Roadmap" },
      ],
    },
    {
      id: "genai",
      label: "GenAI development",
      short: "8–14 wk",
      length: "8–14 weeks",
      shown: "12 weeks shown",
      unit: "week",
      phases: [2, 1, 8, 1],
      start: 5,
      moments: [
        { week: 0, when: "Day 1", text: "We pick the use case together and agree what a good answer looks like.", label: "Use case" },
        { week: 1.5, when: "Week 2", text: "A test set of real questions from your team, to score every version against.", label: "Test set" },
        { week: 2.2, when: "Week 3", text: "Access to your AWS account and data. The first prototype runs on your own documents.", label: "Prototype" },
        { week: 5, when: "Week 6", text: "The first version answers in staging, scored against the test set.", label: "Staging" },
        { week: 8, when: "Week 9", text: "Connected to your systems, with guardrails on and the running cost measured.", label: "Connected" },
        { week: 10.4, when: "Week 11", text: "Live for the first users, with a trace behind every answer.", label: "Live" },
        { week: 11.3, when: "Week 12", text: "Code, evaluations and runbooks handed to your team.", label: "Handed off" },
      ],
    },
    {
      id: "soc2",
      label: "SOC 2 readiness",
      short: "6–12 mo",
      length: "6–12 months to a Type II report",
      shown: "One year shown",
      unit: "month",
      phases: [4, 2, 18, 28],
      start: 19,
      moments: [
        { week: 0, when: "Week 1", text: "We agree what is in scope and which criteria apply. Security always does.", label: "Scope" },
        { week: 2.5, when: "Week 3", text: "A gap list in priority order, and a first draft of your system description.", label: "Gap list" },
        { week: 4.4, when: "Week 5", text: "We start in your AWS accounts and tools, next to the people who will own the controls.", label: "In your tools" },
        { week: 8, when: "Month 2", text: "Policies written, controls on your landing zone, and evidence collected automatically.", label: "Controls" },
        { week: 14, when: "Month 4", text: "A mock audit, tested the way an auditor would. We close what is left and shortlist auditors.", label: "Mock audit" },
        { week: 19, when: "Month 5", text: "Type I: an independent auditor checks the design of your controls on one date.", label: "Type I" },
        { week: 24, when: "Month 6", text: "The Type II window opens. Your team runs the controls, and we check in every month.", label: "Window opens" },
        { week: 48.5, when: "Month 12", text: "The window closes. The auditor tests it and issues your Type II report.", label: "Type II" },
      ],
    },
    {
      id: "embedded",
      label: "Embedded delivery",
      short: "3 mo–2 yr",
      length: "3 months to 2 years",
      shown: "One year shown",
      unit: "month",
      phases: [2, 2, 44, 4],
      start: 8,
      moments: [
        { week: 0, when: "Week 1", text: "We agree the goals, the shape of the team and how we work with yours.", label: "Goals" },
        { week: 2.2, when: "Week 3", text: "Our people join your stand-ups, your repositories and your on-call rota.", label: "Joined" },
        { week: 8, when: "Month 2", text: "The first releases from the joint team reach your users.", label: "First release" },
        { week: 24, when: "Month 6", text: "A review together: grow the team, shrink it, or keep it as it is.", label: "Review" },
        { week: 48.5, when: "Month 12", text: "What we know has moved to your own people, and we step out.", label: "Step out" },
      ],
    },
  ],
  defaultWay: "genai",
};

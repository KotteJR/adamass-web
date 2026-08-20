"use client";

import { useState } from "react";
import { AdamassBracketMark } from "./AdamassLogo";
import BentoDots from "./BentoDots";
import UiIconButton from "./UiIconButton";
import UiTag from "./UiTag";

type Tone = "signal" | "ochre" | "muted";

type WorkCase = {
  id: "diligence" | "diagnosis";
  pill: string;
  kicker: string;
  title: string;
  body: string;
  tags: { label: string; signal?: boolean }[];
  corpus: string[];
  statKicker: string;
  statFigure: string;
  statCaption: string;
  graphKicker: string;
  tuned: number;
  total: number;
  graphLabel: string;
  graphLegend: { label: string; tone: "signal" | "mist" }[];
  actions: { task: string; status: string; tone: Tone }[];
  cta: string;
};

const cases: WorkCase[] = [
  {
    id: "diligence",
    pill: "European M&A",
    kicker: "Most recent",
    title: "A fine-tuned model for European M&A.",
    body: "Post-trained on a closed corpus of investment files. It reads the data room, drafts the note, and stays inside the mandate. A partner still signs.",
    tags: [
      { label: "M&A" },
      { label: "EU" },
      { label: "On-prem", signal: true },
    ],
    corpus: [
      "Data rooms",
      "SPAs",
      "Side letters",
      "Board packs",
      "Disclosure letters",
      "Warranty schedules",
      "CIMs",
      "Q&A logs",
    ],
    statKicker: "First pass",
    statFigure: "75%",
    statCaption: "faster than a senior reviewer",
    graphKicker: "Fine-tuned weights",
    tuned: 22,
    total: 72,
    graphLabel: "22 billion of 72 billion parameters fine-tuned",
    graphLegend: [
      { label: "22B tuned", tone: "signal" },
      { label: "72B total", tone: "mist" },
    ],
    actions: [
      { task: "Flags material findings in the data room", status: "grounded", tone: "signal" },
      { task: "Cites the clause it applied", status: "cited", tone: "signal" },
      { task: "Drafts the first-pass note", status: "drafted", tone: "signal" },
      { task: "Ranks findings by materiality", status: "ranked", tone: "signal" },
      { task: "Refuses outside the mandate", status: "guardrail", tone: "ochre" },
      { task: "Leaves the closed corpus", status: "never", tone: "muted" },
      { task: "Signs the opinion", status: "never", tone: "muted" },
    ],
    cta: "Ask about a similar engagement.",
  },
  {
    id: "diagnosis",
    pill: "Diagnosis stack",
    kicker: "Modernisation",
    title: "A paediatric diagnosis stack, taken off MATLAB.",
    body: "Scoring left a MATLAB runtime for a Python inference service. Retrieval-augmented chat reads the closed report. A second model emits level specs into a web game engine for intervention.",
    tags: [
      { label: "Diagnosis" },
      { label: "Paediatric" },
      { label: "SFT", signal: true },
    ],
    corpus: [
      "Item banks",
      "Norm tables",
      "IRT parameters",
      "Response vectors",
      "Clinician reports",
      "Error profiles",
      "Session traces",
      "Level specs",
    ],
    statKicker: "Runtime",
    statFigure: "1",
    statCaption: "scoring service, off MATLAB",
    graphKicker: "Exercise model",
    tuned: 1,
    total: 4,
    graphLabel: "Instruction-tuned generator for on-construct exercises",
    graphLegend: [
      { label: "SFT on the item bank", tone: "signal" },
      { label: "Schema-constrained decode", tone: "mist" },
    ],
    actions: [
      { task: "Retrieves the closed report pack", status: "grounded", tone: "signal" },
      { task: "Answers only from scored items", status: "cited", tone: "signal" },
      { task: "Emits a level spec for the engine", status: "generated", tone: "signal" },
      { task: "Keeps items on the construct", status: "schema", tone: "signal" },
      { task: "Adapts difficulty to the error profile", status: "adaptive", tone: "signal" },
      { task: "Revises the diagnosis", status: "never", tone: "muted" },
      { task: "Signs the clinical opinion", status: "never", tone: "muted" },
    ],
    cta: "Ask about a similar modernisation.",
  },
];

export default function DiligenceBento() {
  const [activeId, setActiveId] = useState<WorkCase["id"]>("diligence");
  const work = cases.find((entry) => entry.id === activeId) ?? cases[0];

  return (
    <div className="bento-board">
      <div className="bento-switch" role="tablist" aria-label="Selected work cases">
        {cases.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === work.id}
            aria-controls={`work-case-${entry.id}`}
            className={entry.id === work.id ? "is-active" : undefined}
            onClick={() => setActiveId(entry.id)}
          >
            {entry.pill}
          </button>
        ))}
      </div>

      {cases.map((entry) => {
        const isActive = entry.id === work.id;
        const actionSplit = Math.ceil(entry.actions.length / 2);
        const actionColumns = [
          entry.actions.slice(0, actionSplit),
          entry.actions.slice(actionSplit),
        ];

        return (
          <div
            key={entry.id}
            id={`work-case-${entry.id}`}
            className="diligence-bento"
            role="tabpanel"
            hidden={!isActive}
          >
            <article className="bento-tile bento-hero">
              <AdamassBracketMark className="bento-hero-mark" />
              <p className="case-kicker">{entry.kicker}</p>
              <div>
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
              </div>
              <div className="bento-pills">
                {entry.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={tag.signal ? "is-signal" : undefined}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </article>

            <article className="bento-tile bento-rail">
              <p className="case-kicker">The corpus</p>
              <div className="bento-rail-pills">
                {entry.corpus.map((item) => (
                  <UiTag key={item}>{item}</UiTag>
                ))}
              </div>
            </article>

            <article className="bento-tile bento-stat">
              <p className="case-kicker">{entry.statKicker}</p>
              <div>
                <p className="bento-figure">{entry.statFigure}</p>
                <p>{entry.statCaption}</p>
              </div>
            </article>

            <article className="bento-tile bento-graph">
              <p className="case-kicker">{entry.graphKicker}</p>
              <div className="bento-graph-body">
                <BentoDots
                  tuned={entry.tuned}
                  total={entry.total}
                  label={entry.graphLabel}
                />
                <p className="bento-legend">
                  {entry.graphLegend.map((item) => (
                    <span key={item.label}>
                      <i className={`is-${item.tone}`} />
                      {item.label}
                    </span>
                  ))}
                </p>
              </div>
            </article>

            <article className="bento-tile bento-does">
              <p className="case-kicker">What the model does</p>
              <div className="bento-does-cols">
                {actionColumns.map((column) => (
                  <ul key={column[0]?.task}>
                    {column.map((action) => (
                      <li key={action.task}>
                        <span>{action.task}</span>
                        <em className={`is-${action.tone}`}>{action.status}</em>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </article>

            <a className="bento-tile bento-cta" href="mailto:hello@adamass.se">
              <p className="case-kicker">Next step</p>
              <div className="bento-cta-row">
                <strong>{entry.cta}</strong>
                <UiIconButton
                  className="bento-cta-mark"
                  icon="arrow"
                  tone="on-signal"
                  decorative
                />
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}

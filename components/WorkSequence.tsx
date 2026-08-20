"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

const moves = [
  {
    name: "Frame",
    tone: "wash",
    start: 1,
    span: 1,
    level: -1.5,
    tag: "Write the brief first",
    body: "Objectives, constraints, assumptions, and success criteria are written down before delivery gets expensive.",
  },
  {
    name: "Join",
    tone: "mist",
    start: 2,
    span: 1,
    level: -0.5,
    tag: "Same systems, one owner",
    body: "We work in your systems with your people. One named lead owns the relationship and the technical direction.",
  },
  {
    name: "Deliver",
    tone: "signal",
    start: 3,
    span: 8,
    level: 0.5,
    tag: "Work stays visible",
    body: "Progress, decisions, and changes stay visible. We adjust when the evidence changes, without losing accountability.",
  },
  {
    name: "Handover",
    tone: "page",
    start: 11,
    span: 2,
    level: 1.5,
    tag: "Leave it in their hands",
    body: "Source, configuration, operating notes, and context move to your team. Ownership should not depend on us staying.",
  },
] as const;

export default function WorkSequence() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="work-road">
      <div className="work-track">
        <div className="work-scale" aria-hidden>
          <span className="work-scale-mark is-start">W0</span>
          <span className="work-scale-mark is-line" style={{ "--work-week": "33.333%" } as CSSProperties}>
            W4
          </span>
          <span className="work-scale-mark is-line" style={{ "--work-week": "66.666%" } as CSSProperties}>
            W8
          </span>
          <span className="work-scale-mark is-end">W12</span>
        </div>

        <ol className="work-graph">
          {moves.map((move, index) => (
            <li
              key={move.name}
              className={index === activeIndex ? "is-active" : undefined}
              style={
                {
                  gridColumn: `${move.start} / span ${move.span}`,
                  "--work-level": move.level,
                } as CSSProperties
              }
            >
              <button
                className={`work-bar is-${move.tone}`}
                type="button"
                aria-controls="work-detail"
                aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onMouseEnter={() => {
                if (index !== activeIndex) setActiveIndex(index);
              }}
              >
                <span className="work-name">{move.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <aside id="work-detail" className="work-detail" aria-live="polite">
        {moves.map((move, index) => (
          <div
            key={move.name}
            className={`work-detail-copy${index === activeIndex ? " is-active" : ""}`}
            aria-hidden={index !== activeIndex}
          >
            <p className="work-detail-index">
              {String(index + 1).padStart(2, "0")} / 04
            </p>
            <strong>{move.name}</strong>
            <p className="work-detail-tag">{move.tag}</p>
            <p>{move.body}</p>
          </div>
        ))}
      </aside>
    </article>
  );
}

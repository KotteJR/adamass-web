import BentoDots from "./BentoDots";

const corpus = [
  "Data rooms",
  "SPAs",
  "Side letters",
  "Board packs",
  "Disclosure letters",
  "Warranty schedules",
  "CIMs",
  "Q&A logs",
] as const;

const actions = [
  { task: "Flags material findings in the data room", status: "grounded", tone: "signal" },
  { task: "Cites the clause it applied", status: "cited", tone: "signal" },
  { task: "Drafts the first-pass note", status: "drafted", tone: "signal" },
  { task: "Ranks findings by materiality", status: "ranked", tone: "signal" },
  { task: "Refuses outside the mandate", status: "guardrail", tone: "ochre" },
  { task: "Leaves the closed corpus", status: "never", tone: "muted" },
  { task: "Signs the opinion", status: "never", tone: "muted" },
] as const;

export default function DiligenceBento() {
  return (
    <div className="diligence-bento">
      <article className="bento-tile bento-hero">
        <p className="case-kicker">Most recent</p>
        <h3>A fine-tuned model for European M&A.</h3>
        <p>
          Post-trained on a closed corpus of investment files. It reads the
          data room, drafts the note, and stays inside the mandate. A partner
          still signs.
        </p>
        <div className="bento-pills">
          <span>M&A</span>
          <span>EU</span>
          <span className="is-signal">On-prem</span>
        </div>
      </article>

      <article className="bento-tile bento-does">
        <p className="case-kicker">What the model does</p>
        <ul>
          {actions.map((action) => (
            <li key={action.task}>
              <span>{action.task}</span>
              <em className={`is-${action.tone}`}>{action.status}</em>
            </li>
          ))}
        </ul>
      </article>

      <article className="bento-tile bento-stat">
        <p className="case-kicker">First pass</p>
        <p className="bento-figure">75%</p>
        <p>faster than a senior reviewer</p>
      </article>

      <article className="bento-tile bento-graph">
        <p className="case-kicker">Fine-tuned weights</p>
        <BentoDots
          tuned={22}
          total={72}
          label="22 billion of 72 billion parameters fine-tuned"
        />
        <div className="bento-legend">
          <span>
            <i className="is-signal" />
            22B tuned
          </span>
          <span>
            <i className="is-mist" />
            72B total
          </span>
        </div>
      </article>

      <article className="bento-tile bento-rail">
        <p className="case-kicker">The corpus</p>
        <div className="bento-rail-pills">
          {corpus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </article>

      <a className="bento-tile bento-cta" href="mailto:hello@adamass.se">
        <p className="case-kicker">Next step</p>
        <div className="bento-cta-row">
          <strong>Ask about a similar engagement.</strong>
          <i aria-hidden>→</i>
        </div>
      </a>
    </div>
  );
}

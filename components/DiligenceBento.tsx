import { AdamassBracketMark } from "./AdamassLogo";
import BentoDots from "./BentoDots";
import UiIconButton from "./UiIconButton";
import UiTag from "./UiTag";

const architecture = [
  "Control Tower",
  "Organisations",
  "IAM",
  "Amazon S3",
  "SageMaker",
  "Amazon VPC",
  "CloudWatch",
  "Budgets",
];

const actions: { task: string; status: string; tone: "signal" | "ochre" | "muted" }[] = [
  { task: "Returns the risks a regulatory article creates", status: "94% match", tone: "signal" },
  { task: "Maps every risk to the control that answers it", status: "93% match", tone: "signal" },
  { task: "Emits output the downstream system can parse", status: "100%", tone: "signal" },
  { task: "Covers rare labels through synthetic data", status: "synthetic", tone: "signal" },
  { task: "Returns nothing when the text does not bind", status: "guardrail", tone: "ochre" },
  { task: "Leaves the client's own AWS account", status: "never", tone: "muted" },
  { task: "Signs the compliance opinion", status: "never", tone: "muted" },
];

export default function DiligenceBento() {
  const split = Math.ceil(actions.length / 2);
  const columns = [actions.slice(0, split), actions.slice(split)];

  return (
    <div className="diligence-bento">
      <article className="bento-tile bento-hero">
        <AdamassBracketMark className="bento-hero-mark" />
        <p className="case-kicker">Regulatory model</p>
        <div>
          <h3>A first-pass regulatory auditor, private to the client&apos;s cloud.</h3>
          <p>
            It reads one regulatory article and returns the risks and controls
            that bind, or nothing when the text does not. Built with supervised
            fine-tuning and reinforcement learning. A reviewer still signs.
          </p>
        </div>
        <div className="bento-pills">
          <span>Compliance</span>
          <span>Synthetic data</span>
          <span className="is-signal">Private cloud</span>
        </div>
      </article>

      <article className="bento-tile bento-rail">
        <p className="case-kicker">The architecture</p>
        <div className="bento-rail-pills">
          {architecture.map((service) => (
            <UiTag key={service}>{service}</UiTag>
          ))}
        </div>
      </article>

      <article className="bento-tile bento-stat">
        <p className="case-kicker">The model</p>
        <div>
          <p className="bento-figure">27B</p>
          <p>parameter specialist model</p>
        </div>
      </article>

      <article className="bento-tile bento-graph">
        <p className="case-kicker">Held-out evaluation</p>
        <div className="bento-graph-body">
          <BentoDots
            tuned={94}
            total={100}
            label="Of every 100 risks the model returns, 94 match the reviewer's own answer"
          />
          <p className="bento-legend">
            <span>
              <i className="is-signal" />
              94 in 100 match the reviewer
            </span>
            <span>
              <i className="is-mist" />
              6 the reviewer corrects
            </span>
          </p>
          <p className="bento-note">
            Scored on a held-out gold set — expert labels withheld from training.
          </p>
        </div>
      </article>

      <article className="bento-tile bento-does">
        <p className="case-kicker">What the model does</p>
        <div className="bento-does-cols">
          {columns.map((column) => (
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
          <strong>Ask about a similar model.</strong>
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
}

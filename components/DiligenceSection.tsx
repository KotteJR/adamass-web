import DiligenceBento from "./DiligenceBento";

export default function DiligenceSection() {
  return (
    <section id="diligence" className="diligence-section" aria-labelledby="diligence-title">
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="diligence-title">Selected work.</h2>
          <p>
            One public engagement. A specialist regulatory model developed
            from an expert-labelled workflow, evaluated on held-out work, and
            deployed inside the client&apos;s AWS account.
          </p>
        </div>

        <DiligenceBento />
      </div>
    </section>
  );
}

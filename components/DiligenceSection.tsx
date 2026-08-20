import DiligenceBento from "./DiligenceBento";

export default function DiligenceSection() {
  return (
    <section id="diligence" className="diligence-section" aria-labelledby="diligence-title">
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="diligence-title">Selected work.</h2>
          <p>
            Two public engagements. A closed-corpus, on-prem model for
            European M&A that reads the data room and drafts a first-pass
            note a partner still signs. And a paediatric diagnosis stack
            taken off MATLAB onto a Python inference service.
          </p>
        </div>

        <DiligenceBento />
      </div>
    </section>
  );
}

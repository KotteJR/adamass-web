import DiligenceBento from "./DiligenceBento";

export default function DiligenceSection() {
  return (
    <section id="diligence" className="diligence-section" aria-labelledby="diligence-title">
      <div className="page-shell">
        <div className="diligence-intro">
          <h2 id="diligence-title">Selected work.</h2>
          <p>
            One engagement shown in full: what we built, what it does on its
            own, and where it stops and a partner takes over.
          </p>
        </div>

        <DiligenceBento />
      </div>
    </section>
  );
}

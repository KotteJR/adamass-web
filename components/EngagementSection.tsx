import WorkSequence from "./WorkSequence";

export default function EngagementSection() {
  return (
    <section className="engagement-section" aria-labelledby="engagement-title">
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="engagement-title">Structure without the consultancy theatre.</h2>
          <p>
            The exact shape changes with the assignment. The principles do not:
            visible scope, senior ownership, useful documentation, and a clear
            transfer of responsibility.
          </p>
        </div>

        <WorkSequence />
      </div>
    </section>
  );
}

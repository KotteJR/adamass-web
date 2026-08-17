import ClientLogos from "./ClientLogos";

export default function PracticeSection() {
  return (
    <section id="practice" className="practice-section">
      <div className="page-shell">
        <div className="practice-statement">
          <h2 id="practice-title" className="ui-display">
            Senior people. Clear ownership.
            <span> Work that holds up.</span>
          </h2>
        </div>

        <p className="practice-lead">
          Small roster. Named owners. Shipped outcomes.
        </p>

        <div className="practice-grid">
          <div className="practice-copy">
            <p className="ui-body ui-body--secondary">
              Adamass AB, Malmö, Sweden (est. 2019). Boutique practice: generative AI, machine learning engineering, legacy modernisation, and technical due diligence for investors as well as preparation for founders. Mostly team augmentation with written scope and milestones — engagements have run from a few months to about three years.
            </p>
            <p className="ui-body ui-body--secondary">
              Most problems arrive between strategy and engineering, prototype and production, or documentation and operations. We structure the work, deliver it with your team, and keep one person accountable.
            </p>
          </div>

          <div className="practice-principles">
            <article>
              <span>1</span>
              <p className="ui-body ui-body--secondary">
                We augment our team into yours, using the same repositories,
                tools, and ceremonies. The aim is a family-style way of working
                built on trust, shared contexts, and pace.
              </p>
            </article>
            <article>
              <span>2</span>
              <p className="ui-body ui-body--secondary">
                We do not add process for its own sake. Decisions, assumptions,
                and changes are written down so the work remains understandable
                after we leave.
              </p>
            </article>
            <article>
              <span>3</span>
              <p className="ui-body ui-body--secondary">
                Engagements close with source, configuration, deployment notes,
                and operational documentation transferred as agreed in scope.
              </p>
            </article>
          </div>
        </div>

        <ClientLogos />
      </div>
    </section>
  );
}

export default function BelowFold() {
  return (
    <div className="bg-[var(--white)] text-[var(--ink)]">
      <section
        id="studio"
        className="scroll-mt-28 border-b border-[rgba(10,10,10,0.08)] md:scroll-mt-32"
        aria-labelledby="studio-heading"
      >
        <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-20 md:px-10 md:pb-28 md:pt-28">
          <p className="text-label">Studio</p>
          <h2
            id="studio-heading"
            className="font-sans mt-6 max-w-[min(100%,20ch)] text-[clamp(2.35rem,6.5vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.042em] text-[var(--black)]"
          >
            Senior AI &amp; ML delivery
          </h2>
          <p className="mt-8 max-w-xl text-[15px] leading-[1.75] text-[var(--gray-dark)] md:text-base">
            Embedded teams, clear ownership, shipped systems — not slide debt.
            Below the reel, everything stays flat: type, dividers, no boxes.
          </p>
        </div>
      </section>

      <section
        id="work"
        className="border-b border-[rgba(10,10,10,0.08)]"
        aria-labelledby="work-heading"
      >
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
          <p className="text-label">Proof</p>
          <h2
            id="work-heading"
            className="font-sans mt-4 max-w-2xl text-[clamp(1.65rem,3.2vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-[var(--black)]"
          >
            We&apos;ve worked with AI platforms, EdTech teams, and investors
            evaluating AI assets.
          </h2>

          <p className="font-sans mt-14 max-w-[min(100%,38rem)] text-[clamp(1.35rem,2.4vw,1.85rem)] font-medium leading-snug tracking-[-0.025em] text-[var(--black)]">
            Small roster, senior hands — every engagement has a named owner on
            our side.
          </p>

          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-16">
            <p className="text-[15px] leading-[1.8] text-[var(--gray-dark)]">
              Adamass exists because most AI consulting is either too strategic
              (slides, no code) or too junior (hours, no outcomes). We sit in
              the middle — senior people who build.
            </p>
            <div className="border-l-2 border-[var(--electric)] pl-6 md:pl-8">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--electric)]">
                Model
              </p>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--black)]">
                Small roster of concurrent engagements. You always know who owns
                delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="engage" className="mx-auto max-w-[1200px] px-5 py-20 md:px-10 md:py-28">
        <p className="text-label">Engagement types</p>
        <div className="mt-2 divide-y divide-[rgba(10,10,10,0.1)]">
          <article className="py-10 md:py-12">
            <h3 className="font-sans text-lg font-semibold tracking-[-0.02em] text-[var(--black)]">
              Embedded delivery
            </h3>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[var(--gray-dark)]">
              We join your team for 4–12 weeks. Own a problem. Ship it.
            </p>
          </article>
          <article className="py-10 md:py-12">
            <h3 className="font-sans text-lg font-semibold tracking-[-0.02em] text-[var(--black)]">
              Technical due diligence
            </h3>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[var(--gray-dark)]">
              AI/ML assessment for investors: architecture, team, risk, moat —
              structured report.
            </p>
          </article>
          <article className="py-10 md:py-12">
            <h3 className="font-sans text-lg font-semibold tracking-[-0.02em] text-[var(--black)]">
              Advisory
            </h3>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-[var(--gray-dark)]">
              Strategic and technical guidance for founders navigating AI
              decisions.
            </p>
          </article>
        </div>

        <p className="mt-16 font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--gray-mid)]">
          Stockholm · Skopje
        </p>
      </section>
    </div>
  );
}

import ClientLogoBand from "./ClientLogoBand";

export default function StaticSection() {
  return (
    <div className="relative z-10 rounded-t-[28px] bg-white text-[var(--ink)] shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
      {/* Studio hero — oversized type + accent bar */}
      <section id="studio" className="scroll-mt-24">
        <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-24 md:px-10 md:pb-32 md:pt-32">
          <h2 className="max-w-[22ch] font-sans text-[clamp(2.5rem,7vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-[var(--black)]">
            Boutique AI and ML delivery
          </h2>
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1fr_1fr] md:gap-20">
            <div className="max-w-lg space-y-6 text-[16px] leading-[1.8] text-[var(--gray-dark)]">
              <p className="font-sans text-[17px] font-medium leading-snug text-[var(--black)]">
                Small roster. Named owners. Shipped outcomes.
              </p>
              <p>
                Adamass AB, Malmö, Sweden (est. 2019). Boutique practice:
                generative AI, machine learning engineering, legacy
                modernisation, and technical due diligence for investors.
                Mostly team augmentation with written scope and milestones —
                engagements have run from a few months to about two years.
              </p>
              <p>
                Most failures happen at handoff: between strategy and
                engineering, prototype and production, or documentation and
                operations. We close that gap with explicit scope, written
                artefacts, and a single accountable lead. We do not introduce
                process for its own sake.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--electric)] font-mono text-[11px] font-bold text-white">
                  01
                </span>
                <p className="text-[15px] font-medium leading-relaxed text-[var(--black)]">
                  We usually augment your team in your repos, tools, and
                  ceremonies — not as a separate vendor silo. One named
                  technical lead per engagement.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--electric)] font-mono text-[11px] font-bold text-white">
                  02
                </span>
                <p className="text-[15px] font-medium leading-relaxed text-[var(--black)]">
                  Engagements close with transfer of source, configuration,
                  deployment notes, and operational documentation as agreed in
                  scope.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientLogoBand />

      {/* Proof — big quote + stats-like callout */}
      <section
        id="work"
        className="border-y border-[rgba(10,10,10,0.06)] bg-[#f8fafc]"
      >
        <div className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-32">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]">
            Context
          </p>
          <h2 className="mt-5 max-w-[min(100%,36ch)] font-sans text-[clamp(1.75rem,3.6vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--black)]">
            Clients include AI product companies, teams modernising legacy
            platforms, and investors requiring technical review of ML and
            software assets.
          </h2>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.06)] md:grid-cols-3">
            {[
              {
                value: "3–24",
                unit: "months",
                label: "Typical engagement span",
              },
              {
                value: "Embedded",
                unit: "",
                label: "Augmented with client engineering teams",
              },
              { value: "100%", unit: "", label: "Senior delivery" },
            ].map((s) => (
              <div key={s.label} className="bg-white px-7 py-8 md:px-8 md:py-10">
                <p className="font-sans text-[clamp(2rem,4vw,2.75rem)] font-medium tracking-[-0.04em] text-[var(--black)]">
                  {s.value}
                  {s.unit && (
                    <span className="ml-1.5 text-[clamp(0.85rem,1.4vw,1rem)] font-normal tracking-normal text-[var(--gray-mid)]">
                      {s.unit}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-[13px] font-medium text-[var(--gray-dark)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capability types — numbered list with accent left border */}
      <section className="mx-auto max-w-[1200px] px-5 py-24 md:px-10 md:py-32">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--electric)]">
          Capability types
        </p>
        <h2 className="mt-4 max-w-xl font-sans text-[clamp(1.5rem,2.8vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-[var(--black)]">
          Three standard models
        </h2>

        <div className="mt-14 space-y-0 divide-y divide-[rgba(10,10,10,0.08)]">
          {[
            {
              num: "01",
              title: "Embedded delivery",
              body: "Embedded with your engineers on site or remote. Typical duration from roughly three months to two years: shared backlog, agreed milestones, and artefacts in your systems. Formal handover when the assignment ends.",
            },
            {
              num: "02",
              title: "Technical due diligence",
              body: "Structured report for investors or boards: architecture, team, data and model practices, risk register. Typical turnaround two to three weeks.",
            },
            {
              num: "03",
              title: "Strategic advisory",
              body: "Fixed cadence calls for leadership teams without a full-time ML lead. Agenda-driven; minutes and action items issued after each session.",
            },
          ].map((e) => (
            <article
              key={e.num}
              className="grid gap-4 py-10 md:grid-cols-[4rem_1fr_1.5fr] md:items-start md:gap-8 md:py-12"
            >
              <span className="font-mono text-[13px] font-medium text-[var(--electric)]">
                {e.num}
              </span>
              <h3 className="font-sans text-[clamp(1.15rem,2vw,1.4rem)] font-semibold tracking-[-0.02em] text-[var(--black)]">
                {e.title}
              </h3>
              <p className="max-w-lg text-[15px] leading-[1.75] text-[var(--gray-dark)]">
                {e.body}
              </p>
            </article>
          ))}
        </div>

      </section>
    </div>
  );
}

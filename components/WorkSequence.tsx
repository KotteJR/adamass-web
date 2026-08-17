const moves = [
  {
    name: "Frame",
    tone: "wash",
    left: "0%",
    span: "34%",
    body: "Objectives, constraints, assumptions, and success criteria are written down before delivery gets expensive.",
  },
  {
    name: "Join",
    tone: "mist",
    left: "22%",
    span: "34%",
    body: "We work in your systems with your people. One named lead owns the relationship and the technical direction.",
  },
  {
    name: "Deliver",
    tone: "signal",
    left: "44%",
    span: "34%",
    body: "Progress, decisions, and changes stay visible. We adjust when the evidence changes, without losing accountability.",
  },
  {
    name: "Handover",
    tone: "page",
    left: "66%",
    span: "34%",
    body: "Source, configuration, operating notes, and context move to your team. Ownership should not depend on us staying.",
  },
] as const;

export default function WorkSequence() {
  return (
    <article className="work-road">
      <div className="work-grid" aria-hidden />

      <ol className="work-graph">
        {moves.map((move) => (
          <li
            key={move.name}
            aria-label={move.name}
            style={{ "--work-left": move.left, "--work-span": move.span }}
          >
            <p>
              <strong>{move.name}</strong>
              {move.body}
            </p>
            <b className={`work-bar is-${move.tone}`} aria-hidden />
          </li>
        ))}
      </ol>
    </article>
  );
}

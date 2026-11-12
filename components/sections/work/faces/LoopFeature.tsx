/** A waveform wrapped into a ring, so its end meets its start at the top: Murmur's seamless loop. */
const CX = 300;
const CY = 390;
const R0 = 112;
const COUNT = 90;

const round = (value: number) => Math.round(value * 10) / 10;

const BARS = Array.from({ length: COUNT }, (_, i) => {
  const t = (2 * Math.PI * i) / COUNT;
  const level = 0.5 + 0.28 * Math.sin(5 * t + 0.7) + 0.16 * Math.sin(11 * t + 2.1) + 0.06 * Math.sin(23 * t);
  const length = 10 + 58 * Math.max(0.08, Math.min(1, level));
  const [x, y] = [Math.sin(t), -Math.cos(t)];
  return {
    x1: round(CX + R0 * x),
    y1: round(CY + R0 * y),
    x2: round(CX + (R0 + length) * x),
    y2: round(CY + (R0 + length) * y),
  };
});

export function LoopFeature() {
  return (
    <svg width="600" height="780" viewBox="0 0 600 780" className="absolute inset-0">
      <g stroke="#ffffff" strokeWidth={3.4} strokeLinecap="round">
        {BARS.map((bar, i) => (
          <line key={i} {...bar} />
        ))}
      </g>
      <circle cx={CX} cy={CY} r={R0 - 16} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1.5} />
      <circle cx={CX} cy={CY - R0 + 16} r={5} fill="#ffffff" />
    </svg>
  );
}

/** The held-out score as a 10 x 10 grid: filled dots matched the reviewer, rings did not. */
const STEP = 32;
const R = 8.5;

export function DotsFeature({ filled, total }: { filled: number; total: number }) {
  const x0 = 300 - 4.5 * STEP;
  const y0 = 390 - 4.5 * STEP;
  return (
    <svg width="600" height="780" viewBox="0 0 600 780" className="absolute inset-0">
      {Array.from({ length: total }, (_, i) => {
        const cx = x0 + (i % 10) * STEP;
        const cy = y0 + Math.floor(i / 10) * STEP;
        return i < filled ? (
          <circle key={i} cx={cx} cy={cy} r={R} fill="#ffffff" />
        ) : (
          <circle key={i} cx={cx} cy={cy} r={R - 0.75} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={1.5} />
        );
      })}
    </svg>
  );
}

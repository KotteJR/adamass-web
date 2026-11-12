/** Morrow's mark: eleven rays, one per daily puzzle, round a sun. From design/handoff/assets/morrow-mark.svg. */
export function MorrowMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} strokeWidth="3.8" strokeLinecap="round">
      <line x1="24" y1="10.5" x2="24" y2="3" stroke="#4B63E6" />
      <line x1="31.3" y1="12.64" x2="35.35" y2="6.33" stroke="#24A26A" />
      <line x1="36.28" y1="18.39" x2="43.1" y2="15.28" stroke="#EE8A2C" />
      <line x1="37.36" y1="25.92" x2="44.79" y2="26.99" stroke="#7A5DE8" />
      <line x1="34.2" y1="32.84" x2="39.87" y2="37.75" stroke="#E9B12A" />
      <line x1="27.8" y1="36.95" x2="29.92" y2="44.15" stroke="#E0577D" />
      <line x1="20.2" y1="36.95" x2="18.08" y2="44.15" stroke="#1B9E93" />
      <line x1="13.8" y1="32.84" x2="8.13" y2="37.75" stroke="#3A90DA" />
      <line x1="10.64" y1="25.92" x2="3.21" y2="26.99" stroke="#BE56D4" />
      <line x1="11.72" y1="18.39" x2="4.9" y2="15.28" stroke="#76AE34" />
      <line x1="16.7" y1="12.64" x2="12.65" y2="6.33" stroke="#EC6753" />
      <circle cx="24" cy="24" r="8" fill="#FF6A2B" />
    </svg>
  );
}

const cells = [
  "is-white",
  "is-white",
  "",
  "is-white",
  "",
  "",
  "",
  "",
  "",
] as const;

export default function MarketMosaic() {
  return (
    <div className="market-cta-mosaic" aria-hidden>
      {cells.map((tone, index) => (
        <span key={index} className={tone || undefined} />
      ))}
    </div>
  );
}

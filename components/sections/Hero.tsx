import { ClientLogos } from "@/components/brand/ClientLogos";
import { Painting } from "@/components/brand/Painting";
import { Container } from "@/components/kit/Container";
import { clientLogos } from "@/content/clients";
import { getCopy } from "@/content/copy";

/** Logos shown at once, by viewport width (widest first). Matches the hidden slots in the row below. */
const LOGO_SLOTS = [
  { minWidth: 1280, slots: 5 },
  { minWidth: 1024, slots: 4 },
  { minWidth: 768, slots: 5 },
  { minWidth: 0, slots: 3 },
] as const;

/** Hero A: two-line headline, the brief button, a full-bleed painting, the studio line and clients. */
export async function Hero() {
  const { hero } = await getCopy();
  return (
    <section aria-labelledby="hero-title">
      <Container
        className="flex flex-col gap-6 pt-3 md:flex-row md:items-end md:justify-between md:gap-10 md:pt-[29px]"
      >
        <h1 id="hero-title" className="text-6xl font-[450] text-balance">
          <span className="block text-mute">{hero.headline.lead}</span>
          <span className="block">{hero.headline.rest}</span>
        </h1>
        <a
          href={hero.action.href}
          className="group flex w-full shrink-0 gap-1.5 rounded-xs sm:w-auto sm:self-start md:self-auto md:pb-1.5"
        >
          <span className="inline-flex h-12 flex-1 items-center justify-center rounded-xs bg-ink px-5 text-md font-medium text-canvas transition-colors group-hover:bg-graphite sm:h-11 sm:flex-none">
            {hero.action.label}
          </span>
          <span
            aria-hidden
            className="inline-flex size-12 items-center justify-center rounded-xs bg-soft text-ink transition-colors group-hover:bg-soft-2 sm:size-11"
          >
            <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 11L11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </Container>

      <div className="relative mt-7 h-[clamp(220px,58vw,320px)] md:mt-11 md:h-[clamp(320px,34.75vw,500px)]">
        <Painting preload />
      </div>

      {/* The studio line and the logos sit on the Statement's grid, so the logo row starts and
          ends exactly where the two paragraphs below do: from 1024 px in the right-hand
          column (split-cols), narrower across the full width under the line. The first
          logo hugs the left edge, the last the right edge. */}
      <Container className="grid items-center gap-7 pt-7 pb-10 md:gap-8 md:pt-8 md:pb-12 lg:split-cols xl:pt-[41px]">
        <p className="max-w-[420px] text-md leading-normal text-mute">{hero.intro}</p>
        <ClientLogos
          logos={clientLogos}
          label={hero.clientsLabel}
          // 3 logos on phones, 5 across the full width from 768 px, 4 in the right-hand column from 1024, 5 from 1280.
          // CSS hides the extra slots on first paint; the component rotates only the visible ones.
          slotSteps={LOGO_SLOTS}
          className={[
            "grid grid-cols-3 items-center gap-x-4 text-slate [--logo-h:22px] md:flex md:justify-between md:gap-x-4 xl:[--logo-h:24px]",
            "max-md:[&>div:nth-of-type(n+4)]:hidden lg:max-xl:[&>div:nth-of-type(n+5)]:hidden",
            "[&>div:first-of-type]:justify-items-start max-md:[&>div:nth-of-type(3)]:justify-items-end",
            "md:max-lg:[&>div:nth-of-type(5)]:justify-items-end lg:max-xl:[&>div:nth-of-type(4)]:justify-items-end xl:[&>div:nth-of-type(5)]:justify-items-end",
          ].join(" ")}
          slotClassName="h-11 md:w-[104px] xl:w-[120px] 2xl:w-[132px]"
        />
      </Container>
    </section>
  );
}

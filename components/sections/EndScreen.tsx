import { ClientLogos } from "@/components/brand/ClientLogos";
import { MalmoClock } from "@/components/brand/MalmoClock";
import { SketchMark } from "@/components/brand/SketchMark";
import { ActionLink } from "@/components/kit/ActionLink";
import { Container } from "@/components/kit/Container";
import { RevealOnce } from "@/components/motion/RevealOnce";
import { clientLogos } from "@/content/clients";
import { getCopy } from "@/content/copy";

/**
 * The light end screen: the painting under a Malmö sky, the mark drawing itself, one last way in.
 * The painting is ClosingBackdrop's, shared with How we work above, which dissolves into it.
 */
export async function EndScreen() {
  const { endScreen, hero, site, ui } = await getCopy();
  return (
    <section
      aria-labelledby="end-title"
      className="keep-light relative isolate flex min-h-[min(100svh,760px)] flex-col items-center overflow-hidden pt-16 pb-24 text-center text-white md:h-[780px] md:min-h-0 md:pt-[120px] md:pb-20"
    >
      <MalmoClock
        timeZone={site.timeZone}
        place={endScreen.place}
        greetings={endScreen.greetings}
        from={ui.greetingFrom}
        className="absolute inset-x-0 bottom-7 z-10"
      />

      <Container className="relative z-10 flex flex-col items-center gap-[22px]">
        <RevealOnce threshold={0.5}>
          <SketchMark className="w-[min(220px,58vw)] sm:w-[300px]" />
        </RevealOnce>
        <h2 id="end-title" className="font-display text-[1.375rem] font-normal tracking-[-0.01em]">
          {endScreen.name}
        </h2>
        <p className="-mt-2.5 max-w-[460px] text-[1rem] leading-normal text-white/86">{endScreen.tagline}</p>
        <div className="mt-1 flex w-full max-w-[360px] flex-col gap-2 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
          <ActionLink href={endScreen.primary.href} tone="white" className="h-12 w-full text-md sm:w-auto lg:h-[42px]">
            {endScreen.primary.label}
          </ActionLink>
          <ActionLink href={endScreen.backToTop.href} tone="glass" className="h-12 w-full text-md sm:w-auto lg:h-[42px]">
            {endScreen.backToTop.label} <span aria-hidden>↑</span>
          </ActionLink>
        </div>
        <ClientLogos
          logos={clientLogos}
          label={hero.clientsLabel}
          className="mt-[26px] grid w-full max-w-[360px] grid-cols-3 items-center gap-x-4 text-white/86 [--logo-h:20px] max-md:[&>div:nth-of-type(n+4)]:hidden md:flex md:w-auto md:max-w-none md:gap-x-9"
          slotClassName="h-10 md:w-[104px]"
        />
      </Container>
    </section>
  );
}

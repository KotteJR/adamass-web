import { Container } from "@/components/kit/Container";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { howWeWork } from "@/content/process";
import { anchors } from "@/content/site";
import { ProcessTimeline } from "./process/ProcessTimeline";

/**
 * How we work: the heading with its intro under it, then one engagement you
 * can scrub through: pick a way in, drag along its four steps at their real
 * lengths, and read what happens when. On phones the way in is a list to read
 * instead. Nothing moves on its own. The section sits on the painting it
 * shares with the end screen (ClosingBackdrop): dark at the top, and over its
 * last 20rem the dark fades out into the end screen.
 */
export function Process() {
  return (
    <section id={anchors.process} aria-labelledby="process-title" className="relative isolate overflow-x-clip text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_20_33/0.92)_0%,rgb(11_20_33/0.86)_calc(100%_-_20rem),rgb(11_20_33/0)_100%)]"
      />
      <Container className="flex flex-col gap-14 pt-20 pb-60 lg:gap-20 lg:pt-28 lg:pb-[clamp(15rem,6rem+12vw,18rem)]">
        <div className="flex max-w-[720px] flex-col gap-5">
          <MonoLabel size="md" className="text-white/60">
            {howWeWork.label}
          </MonoLabel>
          <h2
            id="process-title"
            className="text-[clamp(2.125rem,1.3rem+2.6vw,3.5rem)] leading-[1.04] font-medium tracking-[-0.045em] text-balance"
          >
            <span className="block">{howWeWork.title.lead}</span>
            <span className="block text-white/45">{howWeWork.title.rest}</span>
          </h2>
          <p className="max-w-[560px] text-lg leading-[1.55] text-white/75 max-sm:hidden">{howWeWork.intro}</p>
          <p className="text-lg leading-[1.55] text-white/75 sm:hidden">{howWeWork.introPhone}</p>
        </div>

        <ProcessTimeline
          phases={howWeWork.phases}
          ways={howWeWork.ways}
          defaultWay={howWeWork.defaultWay}
          waysLabel={howWeWork.waysLabel}
          lengthLabel={howWeWork.lengthLabel}
          scrubLabel={howWeWork.scrubLabel}
          previous={howWeWork.previous}
          next={howWeWork.next}
        />

      </Container>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from "react";
import cabinet from "@/components/brand/figures/aws-cabinet.module.css";
import { ActionLink } from "@/components/kit/ActionLink";
import { SpecList } from "@/components/kit/SpecList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AwsOffer, AwsSectionContent } from "@/content/services";
import { useInView } from "@/hooks/use-in-view";
import { usePageVisible } from "@/hooks/use-page-visible";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type AwsExplorerProps = {
  offers: AwsOffer[];
  labels: Pick<AwsSectionContent, "tabsLabel" | "legend" | "listed" | "direct">;
  /** The server-rendered cabinet. Its motion follows the m-<mode> class set here. */
  figure: ReactNode;
};

/**
 * Five AWS services as tabs over one cabinet drawing. The active tab's
 * background slides and joins the panel. Each service is a 9 s story in three
 * steps, named above the drawing and lit in time. The explorer moves to the
 * next service when a story ends, until the visitor picks a tab; it rests while
 * pointed at, offscreen or for reduced motion.
 *
 * The tabs look the same at every width. Where five do not fit (each needs
 * 208 px), the row scrolls sideways and snaps, keeping the active tab in view.
 */
export function AwsExplorer({ offers, labels, figure }: AwsExplorerProps) {
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [viewRef, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const pageVisible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const playing = inView && pageVisible;
  const offer = offers[index];
  const first = index === 0;
  const last = index === offers.length - 1;

  // Advance when the story's first step comes round again: the step row runs on
  // the same 9 s clock as the drawing and pauses with it, so a switch always
  // lands at the end of a story. With reduced motion nothing animates, so nothing advances.
  const onStoryLoop = (event: AnimationEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.dataset.step !== "1" || touched || engaged || reducedMotion) return;
    setIndex((i) => (i + 1) % offers.length);
  };

  // Where the tab row scrolls, keep the active tab in it (sideways only, never the page).
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>('[data-state="active"]');
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
  }, [index, reducedMotion]);

  return (
    <div
      ref={viewRef}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false);
      }}
    >
      <Tabs
        value={offer.id}
        onValueChange={(value) => {
          setTouched(true);
          setIndex(Math.max(0, offers.findIndex((o) => o.id === value)));
        }}
        className="gap-0"
      >
        <TabsList
          ref={listRef}
          variant="line"
          aria-label={labels.tabsLabel}
          className={cn(
            "type-fixed relative grid h-auto w-full snap-x snap-mandatory grid-cols-[repeat(5,minmax(208px,1fr))] items-stretch justify-stretch gap-0 overflow-x-auto rounded-none p-0 group-data-horizontal/tabs:h-auto",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* Sized by the first grid cell, so it matches a tab whether or not the row scrolls. */}
          <span
            aria-hidden
            className="absolute inset-0 col-[1/2] row-[1/2] rounded-t-xl bg-paper transition-transform duration-[550ms] ease-out-soft motion-reduce:transition-none"
            style={{ transform: `translateX(${index * 100}%)` }}
          />
          {offers.map((o) => (
            <TabsTrigger
              key={o.id}
              value={o.id}
              className={cn(
                "group/tab z-10 h-auto snap-start flex-col items-start justify-start gap-1.5 rounded-none rounded-t-xl border-0 px-[22px] pt-[18px] pb-5 text-left font-normal whitespace-normal",
                "after:hidden focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lit",
              )}
            >
              <span className="flex min-h-[18px] items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.06em] text-haze">
                {o.marketplaceUrl ? (
                  <span className="inline-flex h-[18px] items-center rounded-xs bg-soft px-1.5 text-3xs text-mute uppercase transition-colors group-data-[state=active]/tab:bg-canvas">
                    Marketplace
                  </span>
                ) : null}
              </span>
              <span className="text-[1rem] font-medium tracking-[-0.015em] text-balance text-mute transition-colors group-hover/tab:text-ink group-data-[state=active]/tab:text-ink">
                {o.title}
              </span>
              <span className="text-sm leading-[1.4] text-balance text-[#b4b8bf] transition-colors dark:text-haze group-data-[state=active]/tab:text-slate">
                {o.short}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div
          className={cn(
            "grid overflow-hidden rounded-xl bg-paper transition-[border-radius] duration-300",
            "md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_400px]",
            first && "rounded-tl-none",
            last && "rounded-tr-none",
          )}
        >
          {/* The plate: the cabinet, then the story's three steps. */}
          <div
            data-playing={playing || undefined}
            className={cn(cabinet.plate, "@container relative flex flex-col md:justify-between lg:h-[740px] lg:justify-start")}
          >
            {/* Only the drawing, and under it the story's three steps lit in time. No corner labels. */}
            <div
              className={cn(
                "flex items-center justify-center px-2 pt-6 pb-3 sm:px-6 lg:min-h-0 lg:flex-1 lg:px-3 lg:pt-8 lg:pb-4",
                `m-${offer.mode}`,
              )}
            >
              {figure}
            </div>
            <div
              onAnimationIteration={onStoryLoop}
              className={cn(
                cabinet[`bm-${offer.mode}` as keyof typeof cabinet],
                // Phones: one step per line, instead of two and a straggler.
                "flex flex-wrap gap-x-[22px] gap-y-2 px-5 pb-5 font-mono text-[0.6875rem] tracking-[0.06em] uppercase max-sm:flex-col sm:px-7 lg:pb-7",
              )}
            >
              {offer.steps.map((step, k) => (
                <span
                  key={`${offer.mode}-${step}`}
                  data-step={k + 1}
                  className={cn(cabinet.bt, cabinet[`b${k + 1}` as keyof typeof cabinet])}
                >
                  <i>{k + 1}</i>
                  {step}
                </span>
              ))}
            </div>
          </div>

          {offers.map((o) => (
            <TabsContent
              key={o.id}
              value={o.id}
              className="flex animate-slide-in flex-col gap-6 px-5 pt-6 pb-6 text-base motion-reduce:animate-none sm:gap-7 sm:px-9 sm:pt-11 sm:pb-9 md:px-7 lg:px-9"
            >
              <h3 className="text-2xl font-medium text-balance">{o.title}</h3>
              <p className="text-lg leading-[1.55] tracking-[-0.01em] text-[#3b3f46] dark:text-ink-2">{o.body}</p>
              <SpecList specs={o.specs} labelWidth={96} density="loose" className="mt-auto" />
              {o.marketplaceUrl ? (
                <ActionLink href={o.marketplaceUrl} size="wide" className="justify-center">
                  {labels.listed.action} <span aria-hidden>↗</span>
                  <span className="sr-only">
                    : {o.title} {labels.listed.newTab}
                  </span>
                </ActionLink>
              ) : (
                <ActionLink href={labels.direct.action.href} size="wide" className="justify-center">
                  {labels.direct.action.label} <span aria-hidden>→</span>
                  <span className="sr-only">: {o.title}</span>
                </ActionLink>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

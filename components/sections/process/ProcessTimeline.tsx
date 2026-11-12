"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProcessContent } from "@/content/process";
import { cn } from "@/lib/utils";
import { EngagementTimeline } from "./EngagementTimeline";
import { StepList } from "./StepList";

type ProcessTimelineProps = Pick<
  ProcessContent,
  "phases" | "ways" | "defaultWay" | "waysLabel" | "lengthLabel" | "scrubLabel" | "previous" | "next"
>;

/**
 * One engagement you can scrub through. The ways in are a row of buttons, like
 * the topic chips in the brief form; picking one redraws the rail below, and
 * moving its knob shows what happens there. On phones the rail is a list of the
 * four steps instead, with no knob to drag. Nothing moves on its own.
 */
export function ProcessTimeline(props: ProcessTimelineProps) {
  const { phases, ways, defaultWay, waysLabel, lengthLabel, scrubLabel } = props;
  const [wayId, setWayId] = useState(defaultWay);
  const way = ways.find((w) => w.id === wayId) ?? ways[0];
  const [week, setWeek] = useState(way.start);
  const list = useRef<HTMLDivElement>(null);
  const pick = (id: string) => {
    const next = ways.find((w) => w.id === id) ?? ways[0];
    setWayId(next.id);
    setWeek(next.start);
  };

  // Where the tab row scrolls (phones), keep the chosen way in in view: sideways only, never the page.
  useEffect(() => {
    const row = list.current;
    const tab = row?.querySelector<HTMLElement>('[data-state="active"]');
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: Math.max(0, tab.offsetLeft - row.offsetLeft) });
  }, [wayId]);

  return (
    <div className="flex flex-col gap-7 sm:gap-10">
      {/* The ways in, as buttons in one row: where they do not fit, the row scrolls sideways, never wraps. */}
      <Tabs value={way.id} onValueChange={pick} className="min-w-0">
        <TabsList
          ref={list}
          aria-label={waysLabel}
          className={cn(
            "flex h-auto w-full justify-start gap-1.5 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto",
            "snap-x overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {ways.map((w) => (
            <TabsTrigger
              key={w.id}
              value={w.id}
              className={cn(
                "h-9 flex-none snap-start rounded-sm border-0 bg-white/[0.07] px-3 text-[0.8125rem] font-normal whitespace-nowrap text-white/70 shadow-none transition-colors sm:px-3.5 sm:text-sm",
                "hover:bg-white/[0.13] hover:text-white",
                "data-[state=active]:bg-white data-[state=active]:text-ink data-active:bg-white data-active:text-ink group-data-[variant=default]/tabs-list:data-active:shadow-none",
                // Focus moves with the selection (automatic tabs), so the white chosen button is the focus mark.
                "after:hidden focus-visible:ring-0 focus-visible:outline-none",
              )}
            >
              {w.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* From 640 px: the timeline you drag. Phones: the same way in as a list you read. */}
      <EngagementTimeline
        way={way}
        ways={ways}
        phases={phases}
        week={week}
        onWeek={setWeek}
        label={scrubLabel}
        summary={`${lengthLabel} ${way.length}. ${way.shown}.`}
        labels={{ previous: props.previous, next: props.next }}
        className="max-sm:hidden"
      />
      <StepList way={way} phases={phases} className="sm:hidden" />
    </div>
  );
}

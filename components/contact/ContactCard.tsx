"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ContactCardProps = {
  labels: { list: string; book: string; reachOut: string; howItWorks: string };
  /** The booking calendar, when it is set up. It then comes first and opens by default. */
  booking?: ReactNode;
  reachOut: ReactNode;
  howItWorks: ReactNode;
  footer: ReactNode;
};

const PANE = cn(
  "[grid-area:1/1] flex flex-col transition-[opacity,transform,visibility] duration-[400ms] ease-out-soft",
  "data-[state=inactive]:invisible data-[state=inactive]:translate-y-1.5 data-[state=inactive]:opacity-0",
  "motion-reduce:transition-none",
);

/**
 * With the calendar, the panes differ a lot in height (a month grid against a form), so the
 * card follows the open tab instead of the tallest one, and the new pane fades in.
 */
const PANE_FIT = cn(
  "[grid-area:1/1] flex flex-col data-[state=inactive]:hidden",
  "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-300 motion-reduce:animate-none",
);

/**
 * "Book a call" (when set up), "Reach out" and "How it works" as a segmented control, then the founders.
 * Both panes stay mounted in one grid cell, so the card keeps its height and
 * the switch is a crossfade.
 */
export function ContactCard({ labels, booking, reachOut, howItWorks, footer }: ContactCardProps) {
  const tabs = [
    ...(booking ? ([["book", labels.book]] as const) : []),
    ["reach-out", labels.reachOut],
    ["how-it-works", labels.howItWorks],
  ] as const;
  const [tab, setTab] = useState<string>(booking ? "book" : "reach-out");
  return (
    <div className="flex flex-col gap-4">
      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList aria-label={labels.list} className="h-auto w-full gap-0.5 rounded-lg bg-soft p-[3px] group-data-horizontal/tabs:h-auto sm:w-fit sm:self-start">
          {tabs.map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              // Three tabs on a phone: a little tighter, so the Swedish labels fit the width.
              className={cn(
                "h-11 flex-1 rounded-sm border-0 px-3.5 text-sm font-medium text-slate data-active:text-ink sm:flex-none lg:h-[34px]",
                booking && "max-sm:px-1.5 max-sm:text-[0.8125rem]",
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="grid">
          {booking ? (
            <TabsContent value="book" forceMount className={booking ? PANE_FIT : PANE}>
              {booking}
            </TabsContent>
          ) : null}
          <TabsContent value="reach-out" forceMount className={booking ? PANE_FIT : PANE}>
            {reachOut}
          </TabsContent>
          <TabsContent value="how-it-works" forceMount className={booking ? PANE_FIT : PANE}>
            {howItWorks}
          </TabsContent>
        </div>
      </Tabs>
      {/* The calendar says who you meet when you pick a time; the founders show on the other tabs. */}
      {tab === "book" ? null : <div className="pt-3.5">{footer}</div>}
    </div>
  );
}

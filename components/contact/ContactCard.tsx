"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ContactCardProps = {
  labels: { list: string; reachOut: string; howItWorks: string };
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
 * "Reach out" and "How it works" as a segmented control, then the founders.
 * Both panes stay mounted in one grid cell, so the card keeps its height and
 * the switch is a crossfade.
 */
export function ContactCard({ labels, reachOut, howItWorks, footer }: ContactCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="reach-out" className="gap-4">
        <TabsList aria-label={labels.list} className="h-auto w-full gap-0.5 rounded-lg bg-soft p-[3px] group-data-horizontal/tabs:h-auto sm:w-fit sm:self-start">
          {(
            [
              ["reach-out", labels.reachOut],
              ["how-it-works", labels.howItWorks],
            ] as const
          ).map(([value, label]) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-11 flex-1 rounded-sm border-0 px-3.5 text-sm font-medium text-slate data-active:text-ink sm:flex-none lg:h-[34px]"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="grid">
          <TabsContent value="reach-out" forceMount className={PANE}>
            {reachOut}
          </TabsContent>
          <TabsContent value="how-it-works" forceMount className={PANE}>
            {howItWorks}
          </TabsContent>
        </div>
      </Tabs>
      <div className="pt-3.5">{footer}</div>
    </div>
  );
}

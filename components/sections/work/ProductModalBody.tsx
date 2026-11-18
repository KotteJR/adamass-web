"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { XIcon } from "lucide-react";
import { ActionLink } from "@/components/kit/ActionLink";
import { FitStage } from "@/components/products/stages/FitStage";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Headline, LinkAction } from "@/content/types";
import type { ProductSlug, WorkSectionContent } from "@/content/work";
import { cn } from "@/lib/utils";
import { PanelLabel } from "./PanelLabel";
import { modalIconButton, ProductPager } from "./ProductPager";
import styles from "./work-modal.module.css";

export type ModalTab = "overview" | "model" | "stack";

const TABS: ModalTab[] = ["overview", "model", "stack"];

export type ProductView = {
  slug: ProductSlug;
  name: string;
  label: string;
  title: Headline;
  cta: LinkAction;
  /** The modal stage, for the left half from 1024 px. */
  stage: { node: ReactNode; width: number; height: number; minWidth: number };
  /** The sheet's stage, on top below 1024 px: the card, or Morrow's top half. */
  stageSheet: { node: ReactNode; width: number; height: number };
  panels: Record<ModalTab, ReactNode>;
};

type ProductModalBodyProps = {
  product: ProductView;
  index: number;
  count: number;
  previousName: string;
  nextName: string;
  onPrevious: () => void;
  onNext: () => void;
  labels: WorkSectionContent["modal"];
};

/** Staggers the right side in: --i is the item's place, top to bottom. */
const order = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * One product in the modal: the live stage on the left, and on the right its
 * label, heading, tabs (Overview, The model, Stack), a scrolling panel and the
 * buttons. Keyed by product, so switching product starts on Overview again.
 */
export function ProductModalBody({
  product,
  index,
  count,
  previousName,
  nextName,
  onPrevious,
  onNext,
  labels,
}: ProductModalBodyProps) {
  const [tab, setTab] = useState<ModalTab>("overview");
  const pager = {
    index,
    count,
    previous: { label: `${labels.previous}: ${previousName}`, onClick: onPrevious },
    next: { label: `${labels.next}: ${nextName}`, onClick: onNext },
  };

  return (
    <>
      {/* Below 1024 px the sheet scrolls: the close button floats over it. */}
      <div className="sticky top-0 z-20 h-0 lg:hidden">
        <DialogClose
          aria-label={labels.close}
          className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 inline-flex size-11 items-center justify-center keep-light rounded-full bg-white/90 text-ink shadow-[0_6px_20px_-8px_rgba(10,20,40,0.45)] backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lit"
        >
          <XIcon className="size-4" aria-hidden />
        </DialogClose>
      </div>

      <div className={cn("relative overflow-hidden", styles.stage)}>
        <FitStage
          width={product.stage.width}
          height={product.stage.height}
          minWidth={product.stage.minWidth}
          fit="height"
          className="hidden h-full lg:block"
        >
          {product.stage.node}
        </FitStage>
        <FitStage
          width={product.stageSheet.width}
          height={product.stageSheet.height}
          initialScale={390 / product.stageSheet.width}
          className="lg:hidden"
          style={{ aspectRatio: `${product.stageSheet.width} / ${product.stageSheet.height}` }}
        >
          {product.stageSheet.node}
        </FitStage>
      </div>

      <div className="flex min-h-0 flex-col px-5 pt-5 sm:px-8 lg:py-10 xl:px-12">
        <div className={cn("flex h-9 items-center justify-between gap-3", styles.item)} style={order(0)}>
          <PanelLabel>{product.label}</PanelLabel>
          <span className="hidden items-center gap-2.5 lg:inline-flex">
            {/* 1024 to 1279 px the bottom row is too narrow for both buttons and the pager: it moves up here. */}
            <ProductPager {...pager} showCount={false} className="mr-2 hidden lg:max-xl:flex" />
            <span aria-hidden className="font-mono text-[10px] tracking-[0.08em] text-mute">
              {labels.escapeHint}
            </span>
            <DialogClose aria-label={labels.close} className={modalIconButton}>
              <XIcon className="size-4" aria-hidden />
            </DialogClose>
          </span>
        </div>

        <DialogTitle
          className={cn(
            "mt-5 font-display text-[30px] leading-[1.05] font-medium tracking-[-0.02em] text-balance lg:mt-[26px] lg:text-[38px]",
            styles.item,
          )}
          style={order(1)}
        >
          <span className="block">{product.title.lead}</span>
          <span className="block text-haze">{product.title.rest}</span>
        </DialogTitle>

        <Tabs value={tab} onValueChange={(value) => setTab(value as ModalTab)} className="mt-6 min-h-0 flex-1 gap-0">
          <TabsList
            variant="line"
            aria-label={product.name}
            className={cn(
              // Phones: three equal tabs across the width. From 640 px: the board's 112 px tabs.
              "relative flex h-auto w-full gap-0 rounded-[9px] bg-soft p-1 group-data-horizontal/tabs:h-auto data-[variant=line]:rounded-[9px] sm:w-fit sm:self-start",
              styles.item,
            )}
            style={order(2)}
          >
            <span
              aria-hidden
              className="absolute top-1 left-1 h-11 w-[calc((100%-8px)/3)] rounded-md bg-canvas sm:w-28 shadow-[0_1px_2px_rgba(17,18,20,0.06)] transition-transform duration-400 ease-out-soft motion-reduce:transition-none lg:h-[34px]"
              style={{ transform: `translateX(${TABS.indexOf(tab) * 100}%)` }}
            />
            {TABS.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="z-10 h-11 min-w-0 flex-1 rounded-md border-0 px-0 sm:w-28 sm:flex-none text-[14px] font-medium text-slate after:hidden hover:text-ink focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lit data-active:text-ink lg:h-[34px]"
              >
                {labels.tabs[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* From 1024 px the panel scrolls on its own and fades at the bottom; below, the sheet scrolls. */}
          <div
            className={cn(
              "mt-6 pb-8 lg:-mr-2 lg:mb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-2 lg:pb-5",
              styles.item,
              styles.scroll,
            )}
            style={order(3)}
          >
            {TABS.map((key) => (
              <TabsContent key={key} value={key} className={cn("text-base", styles.tab)}>
                {product.panels[key]}
              </TabsContent>
            ))}
          </div>
        </Tabs>

        <div
          className={cn(
            // Below 1024 px: a sticky footer with full-width buttons and the pager.
            "sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-line bg-canvas px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-8 sm:px-8",
            "lg:static lg:mx-0 lg:h-11 lg:flex-row lg:items-center lg:justify-between lg:border-0 lg:p-0",
            // 1024 to 1279 px the half is 488 px wide: the buttons tighten and the pager drops its count.
            styles.item,
          )}
          style={order(4)}
        >
          {/* The buttons wrap only when both do not fit on one line (the SLM's longer CTA on phones). */}
          <div className="flex flex-wrap gap-2 lg:flex-none lg:flex-nowrap">
            <ActionLink
              href={product.cta.href}
              size="lg"
              className="flex-[1_1_auto] px-[18px] text-[15px] lg:flex-none lg:px-4 lg:text-[14px] xl:px-[18px] xl:text-[15px]"
            >
              {product.cta.label}
            </ActionLink>
            <ActionLink
              href={labels.write.href}
              tone="soft"
              size="lg"
              className="flex-[1_1_auto] px-[18px] text-[15px] lg:flex-none lg:px-4 lg:text-[14px] xl:px-[18px] xl:text-[15px]"
            >
              {labels.write.label}
            </ActionLink>
          </div>
          <ProductPager
            {...pager}
            className="self-center lg:min-w-0 lg:flex-[0_1_122px] lg:self-auto lg:justify-end lg:@container lg:max-xl:hidden"
          />
        </div>
      </div>
    </>
  );
}

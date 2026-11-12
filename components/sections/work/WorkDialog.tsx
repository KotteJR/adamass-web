"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { workHash, type WorkSectionContent } from "@/content/work";
import { cn } from "@/lib/utils";
import { ProductModalBody, type ProductView } from "./ProductModalBody";
import styles from "./work-modal.module.css";

/** Fired after the dialog changes the hash itself (replaceState fires no hashchange). */
const CHANGED = "work-dialog:changed";
const PREFIX = "#work/";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(CHANGED, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(CHANGED, onChange);
  };
}

const readSlug = () => {
  const { hash } = window.location;
  return hash.startsWith(PREFIX) ? decodeURIComponent(hash.slice(PREFIX.length)) : null;
};

function setHash(hash: string) {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", `${pathname}${search}${hash}`);
  window.dispatchEvent(new Event(CHANGED));
}

type WorkDialogProps = {
  products: ProductView[];
  labels: WorkSectionContent["modal"];
};

/**
 * The "Learn more" modal. It follows the URL hash, like the brief: every
 * product has its own (#work/murmur, #work/morrow, #work/compliance-slm), so a
 * modal can be linked to, and Escape, ✕, a click outside or Back closes it.
 * From 1024 px it is a 1200 x 780 panel in two halves; below, a full-screen sheet.
 */
export function WorkDialog({ products, labels }: WorkDialogProps) {
  const slug = useSyncExternalStore(subscribe, readSlug, () => null);
  const index = products.findIndex((product) => product.slug === slug);
  const product = index >= 0 ? products[index] : null;

  // Keep the last product on screen while the dialog animates closed.
  const [shown, setShown] = useState<ProductView | null>(null);
  if (product && product !== shown) setShown(product);
  const view = product ?? shown;
  const viewIndex = view ? products.indexOf(view) : 0;

  // Hand focus back to the link that opened the modal; browsers move it to <body> on a hash change.
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const remember = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest(`a[href^="${PREFIX}"]`) : null;
      if (link instanceof HTMLElement) opener.current = link;
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, []);

  const step = (by: number) => {
    const next = products[(viewIndex + by + products.length) % products.length];
    setHash(`#${workHash(next.slug)}`);
  };

  return (
    <Dialog open={product !== null} onOpenChange={(open) => (open ? undefined : setHash(""))}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        overlayClassName="bg-[rgba(17,18,20,0.36)] supports-backdrop-filter:backdrop-blur-[14px] supports-backdrop-filter:backdrop-saturate-[1.05]"
        onCloseAutoFocus={(event) => {
          if (!opener.current) return;
          event.preventDefault();
          opener.current.focus({ preventScroll: true });
          opener.current = null;
        }}
        className={cn(
          styles.panel,
          "gap-0 overflow-hidden bg-white p-0 text-ink ring-0",
          // Below 1024 px: a full-screen sheet that scrolls.
          "max-lg:top-0 max-lg:left-0 max-lg:block max-lg:h-dvh max-lg:max-w-none sm:max-w-none max-lg:translate-x-0 max-lg:translate-y-0 max-lg:overflow-y-auto max-lg:overscroll-contain max-lg:rounded-none",
          // From 1024 px: 1200 x 780, two equal halves.
          "lg:grid lg:h-[min(780px,calc(100dvh-3rem))] lg:w-[min(1200px,calc(100vw-3rem))] lg:max-w-none lg:grid-cols-2 lg:rounded-xl lg:shadow-[0_60px_120px_-40px_rgba(10,20,40,0.55)]",
        )}
      >
        {view ? (
          <ProductModalBody
            key={view.slug}
            product={view}
            index={viewIndex}
            count={products.length}
            previousName={products[(viewIndex + products.length - 1) % products.length].name}
            nextName={products[(viewIndex + 1) % products.length].name}
            onPrevious={() => step(-1)}
            onNext={() => step(1)}
            labels={labels}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

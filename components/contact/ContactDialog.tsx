"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { XIcon } from "lucide-react";
import { MonoLabel } from "@/components/kit/MonoLabel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Headline, LinkAction } from "@/content/types";
import { cn } from "@/lib/utils";

/** Fired after the dialog clears the hash itself (replaceState fires no hashchange). */
const CLEARED = "contact-dialog:cleared";

/** Closes the dialog from anywhere: drops the hash without a history entry. */
export function closeContactDialog() {
  const { pathname, search } = window.location;
  window.history.replaceState(window.history.state, "", `${pathname}${search}`);
  window.dispatchEvent(new Event(CLEARED));
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(CLEARED, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(CLEARED, onChange);
  };
}

type ContactDialogProps = {
  /** The hash that opens the dialog, without "#". Every CTA links to it. */
  hash: string;
  label: string;
  title: Headline;
  /** The line under the title. Left out when the tabs carry their own (the booking layout). */
  description?: string;
  email?: LinkAction;
  closeLabel: string;
  /** Room for the booking calendar beside the form on large screens. */
  wide?: boolean;
  /** The card body (tabs, form, founders), rendered on the server. */
  children: ReactNode;
};

/**
 * The brief, as a modal. It follows the URL hash: any link to #contact opens
 * it, Back or Escape closes it, and /#contact can be shared. No CTA needs to
 * be a client component.
 */
export function ContactDialog({
  hash,
  label,
  title,
  description,
  email,
  closeLabel,
  wide = false,
  children,
}: ContactDialogProps) {
  const target = `#${hash}`;
  const open = useSyncExternalStore(
    subscribe,
    () => window.location.hash === target,
    () => false,
  );

  // Remember the link that opened the dialog, to hand focus back on close.
  // Taken from the click itself: browsers move focus to <body> on a hash change.
  const opener = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const remember = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest(`a[href="${target}"]`) : null;
      if (link instanceof HTMLElement) opener.current = link;
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, [target]);

  const close = closeContactDialog;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : close())}>
      <DialogContent
        ref={content}
        showCloseButton={false}
        {...(description ? {} : { "aria-describedby": undefined })}
        // Behind it, the page itself: dimmed a little and blurred well out of focus. Phones get a plain
        // dim: the sheet covers the whole screen, and a full-page blur there only costs frames as it opens.
        overlayClassName="bg-[#0b1421]/25 supports-backdrop-filter:backdrop-blur-xl max-sm:supports-backdrop-filter:backdrop-blur-none"
        // Focus starts on the dialog itself, not its first button: the close button then shows no
        // focus ring on a tap, and Tab still reaches it first.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          content.current?.focus({ preventScroll: true });
        }}
        onCloseAutoFocus={(event) => {
          if (!opener.current) return;
          event.preventDefault();
          opener.current.focus({ preventScroll: true });
          opener.current = null;
        }}
        className={cn(
          "block max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-canvas p-0 text-ink ring-1 ring-black/5 shadow-[0_40px_100px_-30px_rgba(10,24,44,0.55)] sm:max-w-[600px]",
          wide && "md:max-w-[720px] lg:max-w-[880px]",
          // Phones: a full-screen sheet that slides up from the bottom and back down, solid all the way
          // (a fade would show the page's text through the form while it opens).
          "max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:bg-canvas",
          "max-sm:duration-300 max-sm:ease-out-soft max-sm:data-open:fade-in-100 max-sm:data-open:zoom-in-100 max-sm:data-open:slide-in-from-bottom max-sm:data-closed:fade-out-100 max-sm:data-closed:zoom-out-100 max-sm:data-closed:slide-out-to-bottom",
        )}
      >
        <div className="relative">
          <div className="relative flex min-h-dvh flex-col gap-5 bg-canvas px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:min-h-0 sm:px-[26px] sm:pt-6 sm:pb-[22px]">
            {/* Phones: a sticky bar keeps the close button in reach while the form scrolls. Solid white:
                Safari draws a frosted bar inside a scrolling sheet see-through, with the form showing under it. */}
            <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-canvas px-5 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1 sm:static sm:m-0 sm:-mt-1 sm:bg-transparent sm:p-0">
              <MonoLabel>{label}</MonoLabel>
              <DialogClose asChild>
                <Button variant="ghost" className="-mr-2.5 size-11 shrink-0 rounded-lg p-0 text-slate hover:text-ink">
                  <XIcon aria-hidden className="size-5" />
                  <span className="sr-only">{closeLabel}</span>
                </Button>
              </DialogClose>
            </div>
            <div className="-mt-2 flex flex-col gap-2.5 sm:-mt-3">
              <DialogTitle className="text-2xl leading-[1.15] font-medium tracking-[-0.025em] text-balance">
                <span className="block">{title.lead}</span>
                <span className="block text-haze">{title.rest}</span>
              </DialogTitle>
              {description ? (
                <DialogDescription className="max-w-[460px] text-sm text-slate">
                  {description}{" "}
                  {/* Inline padding grows the tap area to 44 px without moving the lines. */}
                  {email ? (
                    <a href={email.href} className="py-3.5 font-medium text-ink no-underline hover:text-lit">
                      {email.label}
                    </a>
                  ) : null}
                </DialogDescription>
              ) : null}
            </div>
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

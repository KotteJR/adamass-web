"use client";

import { useState, type ReactNode } from "react";
import { MenuIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavItem } from "@/content/site";
import type { LinkAction } from "@/content/types";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  items: readonly NavItem[];
  /** The brief, at the foot of the sheet where a thumb reaches it. */
  action: LinkAction;
  labels: { openMenu: string; close: string; navigation: string; nav: string };
  /** The language switch, above the brief. */
  languageSwitch?: ReactNode;
  className?: string;
};

/** The phone menu: a sheet from the right with large rows, the language switch and the brief at the bottom. */
export function MobileNav({ items, action, labels, languageSwitch, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={cn("-mr-2.5 size-11 rounded-lg p-0 text-ink", className)}>
          <MenuIcon aria-hidden className="size-6" strokeWidth={1.5} />
          <span className="sr-only">{labels.openMenu}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        closeLabel={labels.close}
        className={cn(
          "w-[min(340px,88vw)] gap-0 border-0 bg-canvas p-0",
          "pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          "[&>[data-slot=sheet-close]]:top-[calc(env(safe-area-inset-top)+0.625rem)] [&>[data-slot=sheet-close]]:right-3 [&>[data-slot=sheet-close]]:size-11",
        )}
      >
        <SheetHeader className="flex h-16 justify-center px-5 py-0">
          <SheetTitle>
            <Logo title="Adamass AB" className="h-[17px] w-auto" />
          </SheetTitle>
          <SheetDescription className="sr-only">{labels.navigation}</SheetDescription>
        </SheetHeader>
        <nav aria-label={labels.nav} className="flex-1 overflow-y-auto">
          <ul className="flex flex-col px-3 pt-2">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center rounded-lg px-2 text-2xl font-medium text-ink transition-colors active:bg-soft"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-3 px-5 pt-4">
          {languageSwitch}
          <a
            href={action.href}
            onClick={() => setOpen(false)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-base font-medium text-canvas transition-colors active:bg-graphite"
          >
            {action.label}
            <span aria-hidden>→</span>
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}

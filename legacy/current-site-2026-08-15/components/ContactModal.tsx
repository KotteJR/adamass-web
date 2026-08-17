"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const contacts = [
  {
    name: "Aleksandar Kotevski",
    email: "aleksandar.kotevski@adamass.se",
    phone: "+46 70 626 40 85",
    tel: "+46706264085",
  },
  {
    name: "Vlatko Kotevski",
    email: "vlatko.kotevski@adamass.se",
    phone: "+46 70 917 94 98",
    tel: "+46709179498",
  },
] as const;

export function ContactModalTrigger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--black)] transition-[transform,opacity] hover:opacity-95 active:scale-[0.98] md:h-9 md:px-5 md:text-[11px]"
      >
        Contact
      </button>

      {open && mounted
        ? createPortal(
            <div className="pointer-events-auto fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6">
              <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                aria-label="Close contact"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-[1] w-full max-w-[min(calc(100vw-2rem),22rem)] rounded-[var(--radius-md)] bg-white p-6 text-[var(--black)] shadow-[0_24px_80px_rgba(0,0,0,0.4)] md:p-7"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <h2
                    id={titleId}
                    className="font-sans text-lg font-semibold leading-tight tracking-[-0.02em]"
                  >
                    Contact
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--gray-mid)] transition-colors hover:bg-[var(--gray-light)] hover:text-[var(--black)]"
                    aria-label="Close"
                  >
                    <span className="text-xl leading-none" aria-hidden>
                      ×
                    </span>
                  </button>
                </div>

                <p className="font-sans text-sm leading-relaxed text-[var(--gray-dark)]">
                  <a
                    href="mailto:hello@adamass.se"
                    className="font-medium text-[var(--black)] underline decoration-black/20 underline-offset-2 transition-colors hover:decoration-[var(--electric)]"
                  >
                    hello@adamass.se
                  </a>
                </p>

                <ul className="mt-6 space-y-6 border-t border-black/[0.08] pt-6">
                  {contacts.map((c) => (
                    <li key={c.email}>
                      <p className="font-sans text-sm font-semibold tracking-[-0.02em] text-[var(--black)]">
                        {c.name}
                      </p>
                      <a
                        href={`mailto:${c.email}`}
                        className="mt-1 block font-sans text-sm text-[var(--electric)] underline decoration-[var(--electric-muted)] underline-offset-2 transition-opacity hover:opacity-80"
                      >
                        {c.email}
                      </a>
                      <a
                        href={`tel:${c.tel}`}
                        className="mt-1 block font-mono text-[13px] text-[var(--gray-dark)] transition-colors hover:text-[var(--black)]"
                      >
                        {c.phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

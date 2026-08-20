"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { people } from "@/lib/site";
import { setLenisPaused } from "@/lib/lenis-bridge";
import UiButton from "./UiButton";
import UiIconButton from "./UiIconButton";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  variant?: "contact" | "people";
};

export function ContactModal({
  open,
  onClose,
  variant = "contact",
}: ContactModalProps) {
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(open);
  const [transitionState, setTransitionState] = useState<
    "opening" | "open" | "closing"
  >(open ? "open" : "opening");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const peopleOnly = variant === "people";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setRendered(true);
      setTransitionState("opening");
      const frame = window.requestAnimationFrame(() => {
        setTransitionState("open");
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (!rendered) return;

    setTransitionState("closing");
    const closeDelay = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? 0
      : 360;
    const timeout = window.setTimeout(() => setRendered(false), closeDelay);
    return () => window.clearTimeout(timeout);
  }, [open, rendered]);

  useEffect(() => {
    if (!rendered) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.documentElement.dataset.modal = "open";
    setLenisPaused(true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.documentElement.dataset.modal;
      setLenisPaused(false);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, rendered]);

  useEffect(() => {
    if (!open || !rendered) return;
    closeRef.current?.focus();
  }, [open, rendered]);

  if (!rendered || !mounted) return null;

  return createPortal(
    <div className="contact-modal-shell" data-state={transitionState}>
      <button
        type="button"
        className="contact-modal-backdrop"
        aria-label="Close contact details"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="contact-modal-card"
      >
        <div className="contact-modal-heading">
          <div>
            <h2 id={titleId}>{peopleOnly ? "People" : "Contact Adamass"}</h2>
          </div>
          <UiIconButton
            ref={closeRef}
            className="contact-modal-close"
            icon="close"
            label="Close"
            onClick={onClose}
          />
        </div>

        {peopleOnly ? null : (
          <>
            <a className="contact-modal-general" href="mailto:hello@adamass.se">
              hello@adamass.se
            </a>
            <p className="contact-modal-copy ui-body ui-body--secondary">
              Send a short brief. We reply with availability; a call confirms
              fit, scope, and timing.
            </p>
            <UiButton href="mailto:hello@adamass.se">Write to us</UiButton>
          </>
        )}

        <ul className="contact-modal-list">
          {people.map((person) => (
            <li key={person.email}>
              <p>{person.name}</p>
              <p className="contact-role">{person.role}</p>
              <a href={`mailto:${person.email}`}>{person.email}</a>
              <a href={`tel:${person.tel}`}>{person.phone}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>,
    document.body,
  );
}

export default function ContactModalTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="site-nav-link"
      >
        Contact
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

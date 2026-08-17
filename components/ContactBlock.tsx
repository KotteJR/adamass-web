"use client";

import { useState } from "react";
import { ContactModal } from "./ContactModal";
import UiButton from "./UiButton";

export default function ContactBlock() {
  const [open, setOpen] = useState(false);

  return (
    <div className="contact-lead">
      <a id="contact-email" className="contact-email" href="mailto:hello@adamass.se">
        hello@adamass.se
      </a>
      <p className="contact-intro">
        Send a short brief. We reply with availability, then use an intro call
        to confirm fit, scope, and timing.
      </p>
      <UiButton variant="secondary" onClick={() => setOpen(true)}>
        See people
      </UiButton>
      <ContactModal
        open={open}
        onClose={() => setOpen(false)}
        variant="people"
      />
    </div>
  );
}

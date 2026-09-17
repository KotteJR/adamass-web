"use client";

import { useState } from "react";
import {
  ArrowsClockwise,
  MagnifyingGlass,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";

const services = [
  {
    id: "01",
    Icon: UsersThree,
    title: "Embedded software delivery",
    blurb:
      "We join an existing engineering team and work in its repositories, tools, and ceremonies. One named lead stays accountable.",
    span: "Typically 3 months to 2 years",
    tags: ["Applications", "Platforms", "Delivery"],
    items: [
      "Named lead inside your team",
      "Work in your repositories and ceremonies",
      "Applications, platforms, data, or production AI",
      "Accountability that stays with one person",
    ],
  },
  {
    id: "02",
    Icon: ArrowsClockwise,
    title: "Modernisation",
    blurb:
      "We assess ageing applications and data platforms, find the expensive constraints, and replace them in phases.",
    span: "Phased, not a rewrite",
    tags: ["Applications", "Platforms", "Data"],
    items: [
      "Assessment of the current estate",
      "Constraints ranked by cost to change",
      "Replacement in phases, not a rewrite",
      "The current system stays operable while we work",
    ],
  },
  {
    id: "03",
    Icon: MagnifyingGlass,
    title: "Diligence and strategic advisory",
    blurb:
      "A verdict on a software asset, written for the people who are paying for it. The report is the judgement we would act on ourselves.",
    span: "Typically 3–5 weeks",
    tags: ["Architecture", "Risk", "Team"],
    items: [
      "Architecture and model provenance review",
      "Data rights and licensing position",
      "Team and delivery capacity assessment",
      "Verdict memo, conditions stated",
    ],
  },
  {
    id: "04",
    Icon: Sparkle,
    title: "GenAI Development",
    blurb:
      "Custom platforms, interfaces, and the software generative AI lives in. We also put models into the applications you already run.",
    span: "Typically 8–14 weeks",
    tags: ["Platforms", "Interfaces", "Integration"],
    items: [
      "Custom platforms where the model lives",
      "Interfaces people can operate",
      "Models wired into the systems you already run",
      "Handover your team can keep running",
    ],
  },
] as const;

export default function ServiceStack() {
  const [openId, setOpenId] = useState<string | null>(services[0].id);

  return (
    <section id="work" className="services-section" aria-labelledby="work-title">
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="work-title">What we take on.</h2>
          <p>
            Four ways in. The closed row already carries the sentence that
            matters, so a visitor who never clicks still leaves knowing what we
            do.
          </p>
        </div>

        <div className="service-tray">
          {services.map((service) => {
            const open = openId === service.id;

            return (
              <article
                key={service.id}
                className={open ? "service-row is-open" : "service-row"}
              >
                <button
                  type="button"
                  className="service-row-head"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenId((current) =>
                      current === service.id ? null : service.id,
                    )
                  }
                >
                  <span className="service-row-icon" aria-hidden>
                    <service.Icon size={20} weight="regular" />
                  </span>
                  <div className="service-row-copy">
                    <h3>{service.title}</h3>
                    <p>{service.blurb}</p>
                  </div>
                  <span className="service-row-mark" aria-hidden>
                    <svg
                      className="service-row-plus"
                      viewBox="0 0 12 12"
                      width="12"
                      height="12"
                    >
                      <rect
                        className="service-row-plus-h"
                        x="1.75"
                        y="5.25"
                        width="8.5"
                        height="1.5"
                        rx="0.75"
                      />
                      <rect
                        className="service-row-plus-v"
                        x="5.25"
                        y="1.75"
                        width="1.5"
                        height="8.5"
                        rx="0.75"
                      />
                    </svg>
                  </span>
                </button>

                <div className="service-row-panel" aria-hidden={!open}>
                  <div className="service-row-panel-inner">
                    <div className="service-row-items">
                      {service.items.map((item) => (
                        <div key={item} className="service-row-item">
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="service-row-pills">
                      <span className="service-row-pill is-span">{service.span}</span>
                      {service.tags.map((tag) => (
                        <span key={tag} className="service-row-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

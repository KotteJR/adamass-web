import type { ComponentType } from "react";
import { DiligenceFigure } from "@/components/brand/figures/DiligenceFigure";
import { EmbeddedDeliveryFigure } from "@/components/brand/figures/EmbeddedDeliveryFigure";
import { GenAiFigure } from "@/components/brand/figures/GenAiFigure";
import { ModernisationFigure } from "@/components/brand/figures/ModernisationFigure";
import { Soc2Figure } from "@/components/brand/figures/Soc2Figure";
import { ArrowLink } from "@/components/kit/ArrowLink";
import { Container } from "@/components/kit/Container";
import { SpecList } from "@/components/kit/SpecList";
import { Tag } from "@/components/kit/Tag";
import { anchors } from "@/content/site";
import { getCopy } from "@/content/copy";
import type { ServiceId } from "@/content/services";
import { ServiceFigurePanel } from "./four-ways/ServiceFigurePanel";
import { StepObserver } from "./four-ways/StepObserver";
import styles from "./four-ways/four-ways.module.css";

const FIGURES: Record<ServiceId, ComponentType<{ label?: string }>> = {
  embedded: EmbeddedDeliveryFigure,
  modernisation: ModernisationFigure,
  diligence: DiligenceFigure,
  genai: GenAiFigure,
  soc2: Soc2Figure,
};

/** Five ways in: the services as a sticky scroll, one animated figure each. */
export async function FourWays() {
  const { services, servicesSection } = await getCopy();
  return (
    <section id={anchors.services} aria-labelledby="services-title" className="pt-[72px] pb-16 lg:pb-[72px]">
      <Container>
        <h2 id="services-title" className="sr-only">
          {servicesSection.label}
        </h2>
        <StepObserver className={styles.steps}>
          <div aria-hidden className={styles.backdrop} />
          {services.map((service, index) => {
            const Figure = FIGURES[service.id];
            return (
              <article key={service.id} aria-labelledby={`service-${service.id}`} className={styles.step}>
                <ServiceFigurePanel service={service} index={index} className={styles.panel}>
                  <Figure label={service.figureLabel} />
                </ServiceFigurePanel>
                <div data-step={index} data-step-text className={styles.text}>
                  <Tag className="self-start">{service.tag}</Tag>
                  <h3 id={`service-${service.id}`} className="text-4xl font-medium text-balance">
                    {service.title}
                  </h3>
                  <p className="max-w-[460px] text-lg text-ink-2">{service.summary}</p>
                  <SpecList specs={service.specs} className="max-w-[460px]" />
                  <ArrowLink href={servicesSection.askHref} className="self-start">
                    {servicesSection.askLabel}
                    <span className="sr-only">: {service.title}</span>
                  </ArrowLink>
                </div>
              </article>
            );
          })}
        </StepObserver>
      </Container>
    </section>
  );
}

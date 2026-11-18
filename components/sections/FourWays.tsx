import { ArrowLink } from "@/components/kit/ArrowLink";
import { Container } from "@/components/kit/Container";
import { SpecList } from "@/components/kit/SpecList";
import { Tag } from "@/components/kit/Tag";
import { anchors } from "@/content/site";
import { getCopy, getLang } from "@/content/copy";
import { pathOf, serviceKey } from "@/content/routes";
import { SERVICE_FIGURES } from "@/components/brand/figures/serviceFigures";
import { ServiceFigurePanel } from "./four-ways/ServiceFigurePanel";
import { StepObserver } from "./four-ways/StepObserver";
import styles from "./four-ways/four-ways.module.css";

const FIGURES = SERVICE_FIGURES;

/** Five ways in: the services as a sticky scroll, one animated figure each. */
export async function FourWays() {
  const [lang, { services, servicesSection }] = await Promise.all([getLang(), getCopy()]);
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
                  <h3 id={`service-${service.id}`} className="font-display text-4xl font-medium text-balance">
                    <a href={pathOf(serviceKey(service.id), lang)} className="transition-colors hover:text-lit">
                      {service.title}
                    </a>
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

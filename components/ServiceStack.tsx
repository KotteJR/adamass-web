import Image from "next/image";

const services = [
  {
    title: "Embedded software delivery",
    image: "/media/service-embedded-v3.png",
    alt: "An open book releasing a column of blue data, standing for work inside a client's own material",
    body: "We join an existing engineering team and work in its repositories, tools, and ceremonies. One named lead stays accountable. The work can cover applications, platforms, data, or production AI where it is genuinely useful.",
  },
  {
    title: "Modernisation and AI integration",
    image: "/media/service-modernisation-v3.png",
    alt: "A blue topographic mesh rising from a white field, standing for a system being reshaped",
    body: "We assess ageing applications and data platforms, find the expensive constraints, and replace them in phases. When AI belongs, we design it around acceptance criteria, existing systems, and the people who will operate it.",
  },
  {
    title: "Diligence and strategic advisory",
    image: "/media/service-diligence-v3.png",
    alt: "A surveying instrument in motion blur, standing for technical inspection",
    body: "We examine software assets for acquisitions, investment, or internal decisions. The written report is the judgement we would act on ourselves. We do not recommend a path we would not stand behind.",
  },
] as const;

export default function ServiceStack() {
  return (
    <section id="work" className="services-section" aria-labelledby="work-title">
      <div className="page-shell">
        <div className="service-intro">
          <h2 id="work-title">What we take on.</h2>
          <p>
            Three ways in: inside your team, through a system that needs
            replacing, or as written judgement before a decision.
          </p>
        </div>

        <div className="service-board">
          {services.map((service, index) => (
            <article
              key={service.title}
              className={
                index === 1 ? "service-card is-copy-first" : "service-card"
              }
            >
              <div className="service-media">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 32vw"
                />
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p className="ui-body ui-body--secondary">{service.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { AwsCabinetFigure } from "@/components/brand/figures/AwsCabinetFigure";
import { ArrowLink } from "@/components/kit/ArrowLink";
import { Container } from "@/components/kit/Container";
import { SectionHeading } from "@/components/kit/SectionHeading";
import { awsOffers, awsSection } from "@/content/services";
import { anchors } from "@/content/site";
import { AwsExplorer } from "./aws/AwsExplorer";

/** AWS, from the first account up: the explorer, then how buying works. */
export function Aws() {
  const { tabsLabel, legend, listed, direct } = awsSection;
  return (
    <section id={anchors.aws} aria-labelledby="aws-title" className="pt-16 pb-20 lg:pt-[72px] lg:pb-28">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <SectionHeading id="aws-title" headline={awsSection.headline} />
          <p className="max-w-[400px] text-base text-slate">{awsSection.intro}</p>
        </div>

        <AwsExplorer
          offers={awsOffers}
          labels={{ tabsLabel, legend, listed, direct }}
          figure={<AwsCabinetFigure />}
        />

        <div className="grid gap-8 pt-1 md:grid-cols-3">
          {awsSection.notes.map((note) => (
            <div key={note.title} className="flex flex-col gap-2">
              <h3 className="text-base font-medium">{note.title}</h3>
              <p className="text-md leading-[1.55] text-slate">{note.body}</p>
              {note.link ? <ArrowLink href={note.link.href}>{note.link.label}</ArrowLink> : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

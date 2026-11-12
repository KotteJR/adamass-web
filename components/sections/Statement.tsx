import { ActionLink } from "@/components/kit/ActionLink";
import { Container } from "@/components/kit/Container";
import { SectionHeading } from "@/components/kit/SectionHeading";
import { statement } from "@/content/home";
import { anchors } from "@/content/site";

/**
 * "A full team, working inside yours." One row of three from 1024 px: the heading,
 * then the two paragraphs in the right-hand column that lines up with the Four
 * ways figure below. As the screen narrows the paragraphs get narrower and
 * taller instead of breaking the row. On tablets the heading sits above the two
 * paragraphs; on phones everything stacks. Each paragraph carries its own
 * button; margin-top auto puts both buttons on one baseline.
 */
export function Statement() {
  return (
    <section id={anchors.studio} aria-labelledby="statement-title" className="pt-14 lg:pt-[72px]">
      <Container className="grid items-start gap-8 md:gap-12 lg:split-cols">
        <SectionHeading id="statement-title" headline={statement.headline} />
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:gap-x-8">
          {statement.columns.map((column) => (
            <div key={column.action.label} className="flex flex-col gap-5 md:gap-7">
              <p className="max-w-[560px] text-base text-slate">{column.text}</p>
              <ActionLink href={column.action.href} tone={column.tone} className="self-start md:mt-auto">
                {column.action.label}
              </ActionLink>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

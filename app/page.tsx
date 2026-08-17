import ContactSection from "@/components/ContactSection";
import DiligenceSection from "@/components/DiligenceSection";
import EngagementSection from "@/components/EngagementSection";
import Header from "@/components/Header";
import PracticeSection from "@/components/PracticeSection";
import ScrollFilm from "@/components/ScrollFilm";
import ServiceStack from "@/components/ServiceStack";

const capabilityChapters = [
  {
    label: "Adamass · Malmö",
    title: "Senior delivery. Fixed accountability.",
    heading: "Boutique consultancy",
    body: "A boutique IT consultancy for embedded software delivery, modernisation, technical diligence, and strategic advisory.",
    facts: [
      {
        icon: "pin",
        value: "Malmö",
        detail:
          "Based in Sweden since 2019, working with founders, investors, and engineering leaders who want a clear owner.",
      },
      {
        icon: "user",
        value: "One lead",
        detail:
          "One named technical lead stays accountable for the engagement, from the first brief through handover.",
      },
      {
        icon: "users",
        value: "Senior roster",
        detail:
          "Senior people do the work. Decisions stay written down so the assignment remains understandable after we leave.",
      },
    ],
  },
  {
    label: "Embedded delivery",
    title: "Work as one team.",
    heading: "Inside your systems",
    body: "We join your repositories, tools, and ceremonies with one named technical lead accountable for the engagement.",
    facts: [
      {
        icon: "code",
        value: "Same repos",
        detail:
          "We join your repositories, tools, and ceremonies instead of running a parallel vendor process beside the team.",
      },
      {
        icon: "user",
        value: "Named lead",
        detail:
          "One technical lead owns the relationship and the technical direction for the length of the assignment.",
      },
      {
        icon: "users",
        value: "Shared work",
        detail:
          "The aim is a family-style way of working: trust, shared context, and pace, because that is how the work holds up.",
      },
    ],
  },
  {
    label: "Modernisation",
    title: "Modernise without losing control.",
    heading: "Practical phases",
    body: "We improve applications, platforms, and data systems in practical phases, adding AI only where it earns its place.",
    facts: [
      {
        icon: "layers",
        value: "Phased change",
        detail:
          "We improve applications, platforms, and data systems in practical phases rather than betting everything on a rewrite.",
      },
      {
        icon: "shield",
        value: "Keep control",
        detail:
          "The current system stays operable while the work is in progress, so ownership and delivery never go dark.",
      },
      {
        icon: "flow",
        value: "AI when useful",
        detail:
          "We add AI only where it earns its place against real acceptance criteria and the people who will operate it.",
      },
    ],
  },
  {
    label: "Technical advisory",
    title: "Make the decision with evidence.",
    heading: "Diligence and advice",
    body: "Technical diligence and strategic advice based on architecture, operations, team capability, security, and delivery risk.",
    facts: [
      {
        icon: "search",
        value: "Architecture",
        detail:
          "We examine how the system actually works: structure, interfaces, data, and the constraints that shape the next decision.",
      },
      {
        icon: "shield",
        value: "Risk",
        detail:
          "Operations, security, team capability, and delivery risk sit in the same written view, not in separate conversations.",
      },
      {
        icon: "list",
        value: "Written judgement",
        detail:
          "The report reflects the judgement we would act on ourselves. We do not recommend a path we would not stand behind.",
      },
    ],
  },
] as const;

const deliveryChapters = [
  {
    label: "How we work",
    title: "Write the problem down first.",
    heading: "Scope",
    body: "We write down objectives, constraints, assumptions, and success criteria before delivery begins.",
    facts: [
      {
        icon: "list",
        value: "Objectives",
        detail:
          "Objectives, success criteria, and the shape of the outcome are written down before delivery gets expensive.",
      },
      {
        icon: "shield",
        value: "Constraints",
        detail:
          "Assumptions, limits, and open questions stay explicit so later changes can be judged against the original brief.",
      },
      {
        icon: "user",
        value: "Named owner",
        detail:
          "One lead is named at the start and remains accountable for scope, decisions, and the quality of the write-up.",
      },
    ],
  },
  {
    label: "How we work",
    title: "Deliver in the open.",
    heading: "Delivery",
    body: "We work in your systems, keep decisions visible, and adjust against evidence without losing ownership.",
    facts: [
      {
        icon: "code",
        value: "Your systems",
        detail:
          "We work in your repositories, tools, and ceremonies so the work lives where your team already operates.",
      },
      {
        icon: "flow",
        value: "Visible decisions",
        detail:
          "Progress, decisions, and changes stay written and traceable. Nothing important lives only in a call.",
      },
      {
        icon: "search",
        value: "Evidence",
        detail:
          "We adjust when the evidence changes, without losing ownership or turning the assignment into open-ended theatre.",
      },
    ],
  },
  {
    label: "How we work",
    title: "Leave the work in their hands.",
    heading: "Handover",
    body: "Source, configuration, operating notes, and context move to your team when the assignment closes.",
    facts: [
      {
        icon: "key",
        value: "Source",
        detail:
          "Source, configuration, and deployment notes move to your team when the assignment closes, as agreed in scope.",
      },
      {
        icon: "list",
        value: "Operating notes",
        detail:
          "Context, decisions, and how to run the work are written so the next person does not have to reconstruct them.",
      },
      {
        icon: "users",
        value: "Your team",
        detail:
          "Ownership should not depend on us staying. The engagement closes when the work is demonstrably yours.",
      },
    ],
  },
] as const;

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <ScrollFilm
          id="home"
          desktopClip="/media/film-01.mp4?v=41"
          mobileClip="/media/film-01-mobile.mp4?v=41"
          desktopPoster="/media/film-01-poster-end.jpg?v=41"
          mobilePoster="/media/film-01-mobile-poster-end.jpg?v=41"
          chapters={capabilityChapters}
          firstHeading
          intro
          reverse
          washOutLines={[
            "We structure unclear technical work, deliver it with your team, and leave ownership behind.",
          ]}
        />

        <PracticeSection />
        <ServiceStack />
        <EngagementSection />
        <DiligenceSection />

        <ScrollFilm
          id="approach"
          desktopClip="/media/film-02.mp4"
          mobileClip="/media/film-02-mobile.mp4"
          desktopPoster="/media/film-02-poster.jpg"
          mobilePoster="/media/film-02-mobile-poster.jpg"
          chapters={deliveryChapters}
          blendTop
          introLines={[
            "Now that you've seen the work,",
            "see how we actually run it.",
          ]}
        />

        <ContactSection />
      </main>
    </>
  );
}

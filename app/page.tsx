import ContactSection from "@/components/ContactSection";
import DiligenceSection from "@/components/DiligenceSection";
import EngagementSection from "@/components/EngagementSection";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import PracticeSection from "@/components/PracticeSection";
import ScrollFilm from "@/components/ScrollFilm";
import ServiceStack from "@/components/ServiceStack";
import { capabilityChapters, deliveryChapters } from "@/lib/film";
import { homePageGraph } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <JsonLd data={homePageGraph()} />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <ScrollFilm
          id="home"
          ariaLabel="Adamass AB, boutique IT consultancy in Malmö"
          desktopClip="/media/film-01.mp4?v=42"
          mobileClip="/media/film-01-mobile.mp4?v=42"
          desktopPoster="/media/film-01-poster-end.jpg?v=42"
          mobilePoster="/media/film-01-mobile-poster-end.jpg?v=42"
          chapters={capabilityChapters}
          firstHeading
          intro
          introLines={[
            "Come with the work that feels heavy.",
            "We are happy to make it feel light.",
          ]}
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
          ariaLabel="How Adamass runs an engagement"
          desktopClip="/media/film-02.mp4?v=42"
          mobileClip="/media/film-02-mobile.mp4?v=42"
          desktopPoster="/media/film-02-poster.jpg?v=42"
          mobilePoster="/media/film-02-mobile-poster.jpg?v=42"
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

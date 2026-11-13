// Svenska: texterna för startsidans sektioner som inte är tjänster, arbeten eller kontakt.

import { anchors } from "../site";
import type { EndScreenContent, HeroContent, StatementContent } from "../home";

export * from "../home";

export const hero: HeroContent = {
  headline: {
    lead: "Kom till oss med det som känns tungt.",
    rest: "Vi gör det lätt.",
  },
  action: { label: "Skicka en kort förfrågan", href: `#${anchors.contact}` },
  intro:
    "Ett mjukvaru- och AI-företag i Malmö sedan 2019. Data scientists, utvecklare och arkitekter som går in i ert team eller levererar hela projektet.",
  clientsLabel: "Kunder vi har arbetat med",
};

export const statement: StatementContent = {
  headline: { lead: "Ett komplett team,", rest: "som arbetar i ert eget." },
  columns: [
    {
      text: "Data scientists, ML-ingenjörer, mjukvaru- och molnutvecklare samt arkitekter, samlade i ett företag. Vi förstärker ert team där ni behöver fler händer, arbetar i det som en av era egna eller tar ansvar för hela projektet med ett eget team, och vi växer eller krymper i takt med arbetet.",
      action: { label: "Boka ett samtal", href: `#${anchors.contact}` },
      tone: "ink",
    },
    {
      text: "Vi bygger och driver egna produkter på samma teknik som vi använder i kunduppdrag, så vi rekommenderar bara det vi själva skulle sätta i produktion. Källkod, konfiguration och dokumentation överlämnas till ert team löpande, och när vi lämnar uppdraget stannar nycklarna hos er.",
      action: { label: "Så arbetar vi", href: `#${anchors.process}` },
      tone: "soft",
    },
  ],
};

export const endScreen: EndScreenContent = {
  name: "Adamass",
  tagline: "Kom till oss med det som känns tungt. Vi gör det lätt.",
  primary: { label: "Skicka en kort förfrågan", href: `#${anchors.contact}` },
  backToTop: { label: "Till toppen", href: `#${anchors.top}` },
  place: "Malmö",
  greetings: {
    dawn: "God morgon",
    day: "Hej",
    dusk: "God kväll",
    night: "God natt",
  },
};

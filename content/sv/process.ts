// Svenska: "Så arbetar vi". Tidslinjens längder och punkter är desamma som i engelskan; bara orden skiljer.

import * as en from "../process";
import type { Moment, ProcessContent, WayIn } from "../process";

export * from "../process";

/** Each way in's words, keyed by id; the weeks and lengths come from the English. */
const ways: Record<string, Pick<WayIn, "label" | "short" | "length" | "shown"> & { moments: Pick<Moment, "when" | "text" | "label">[] }> = {
  diligence: {
    label: "Due diligence och rådgivning",
    short: "3–5 v",
    length: "3–5 veckor",
    shown: "4 veckor visas",
    moments: [
      { when: "Dag 1", text: "Vi kommer överens om frågorna med er, eller med era investerare.", label: "Frågor" },
      { when: "Vecka 1", text: "Läsåtkomst till kod, molnmiljö och dokument, och intervjuer med ert team bokas.", label: "Åtkomst" },
      { when: "Vecka 2", text: "Arkitektur, data och leverans granskas, med kostnader och risker prissatta.", label: "Granskning" },
      { when: "Vecka 3", text: "Slutsatserna stäms av med era utvecklare, så att inget i rapporten kommer som en överraskning.", label: "Avstämning" },
      { when: "Vecka 4", text: "En skriftlig rapport: varningssignalerna, vad de kostar att åtgärda och en 90-dagarsplan, följt av en genomgång.", label: "Rapport" },
    ],
  },
  architect: {
    label: "Architect as a Service",
    short: "40 h",
    length: "40 timmar, under upp till 2 månader",
    shown: "Ett block om 40 timmar visas",
    moments: [
      { when: "Dag 1", text: "Vi kommer överens om vad de första 40 timmarna ska besvara.", label: "Frågor" },
      { when: "Vecka 2", text: "Läsåtkomst till era AWS-konton och arkitekturskisser.", label: "Åtkomst" },
      { when: "Vecka 3", text: "En arkitekturgranskning: vad som håller, vad som inte gör det och vad det kostar att ändra.", label: "Granskning" },
      { when: "Vecka 5", text: "Beslutsunderlag för de öppna vägvalen, klara för ert team att godkänna.", label: "Beslut" },
      { when: "Vecka 8", text: "En färdplan som går att agera på. Använd nästa block endast om ni behöver det.", label: "Färdplan" },
    ],
  },
  genai: {
    label: "Utveckling av generativ AI",
    short: "8–14 v",
    length: "8–14 veckor",
    shown: "12 veckor visas",
    moments: [
      { when: "Dag 1", text: "Vi väljer användningsfallet tillsammans och kommer överens om hur ett bra svar ser ut.", label: "Användningsfall" },
      { when: "Vecka 2", text: "En testsvit med verkliga frågor från ert team, som varje version poängsätts mot.", label: "Testsvit" },
      { when: "Vecka 3", text: "Åtkomst till ert AWS-konto och era data. Den första prototypen körs på era egna dokument.", label: "Prototyp" },
      { when: "Vecka 6", text: "Den första versionen svarar i testmiljön, poängsatt mot testsviten.", label: "Testmiljö" },
      { when: "Vecka 9", text: "Ansluten till era system, med skyddsräcken på och driftkostnaden uppmätt.", label: "Ansluten" },
      { when: "Vecka 11", text: "I drift för de första användarna, med en spårning bakom varje svar.", label: "I drift" },
      { when: "Vecka 12", text: "Kod, utvärderingar och driftinstruktioner överlämnas till ert team.", label: "Överlämnad" },
    ],
  },
  soc2: {
    label: "SOC 2-beredskap",
    short: "6–12 mån",
    length: "6–12 månader till en Typ II-rapport",
    shown: "Ett år visas",
    moments: [
      { when: "Vecka 1", text: "Vi kommer överens om omfattningen och vilka kriterier som gäller. Säkerhet ingår alltid.", label: "Omfattning" },
      { when: "Vecka 3", text: "En gaplista i prioritetsordning och ett första utkast till er systembeskrivning.", label: "Gaplista" },
      { when: "Vecka 5", text: "Vi börjar i era AWS-konton och verktyg, bredvid dem som ska äga kontrollerna.", label: "I era verktyg" },
      { when: "Månad 2", text: "Policyer skrivna, kontroller på plats i er landing zone och underlag som samlas in automatiskt.", label: "Kontroller" },
      { when: "Månad 4", text: "En provrevision, genomförd som en revisor skulle göra den. Vi åtgärdar det som återstår och tar fram förslag på revisorer.", label: "Provrevision" },
      { when: "Månad 5", text: "Typ I: en oberoende revisor granskar utformningen av era kontroller vid ett givet datum.", label: "Typ I" },
      { when: "Månad 6", text: "Granskningsperioden för Typ II börjar. Ert team driver kontrollerna och vi stämmer av varje månad.", label: "Perioden börjar" },
      { when: "Månad 12", text: "Perioden avslutas. Revisorn testar den och utfärdar er Typ II-rapport.", label: "Typ II" },
    ],
  },
  embedded: {
    label: "Inbäddad leverans",
    short: "3 mån–2 år",
    length: "3 månader till 2 år",
    shown: "Ett år visas",
    moments: [
      { when: "Vecka 1", text: "Vi kommer överens om målen, teamets sammansättning och hur vi arbetar med ert.", label: "Mål" },
      { when: "Vecka 3", text: "Våra medarbetare går in i era stand-ups, era kodförråd och ert jourschema.", label: "På plats" },
      { when: "Månad 2", text: "De första releaserna från det gemensamma teamet når era användare.", label: "Första release" },
      { when: "Månad 6", text: "En gemensam avstämning: utöka teamet, minska det eller behåll det som det är.", label: "Avstämning" },
      { when: "Månad 12", text: "Vår kunskap har förts över till era egna medarbetare, och vi kliver av.", label: "Kliva av" },
    ],
  },
};

export const howWeWork: ProcessContent = {
  ...en.howWeWork,
  label: "Så arbetar vi",
  title: { lead: "Samma fyra steg,", rest: "en vecka eller två år." },
  intro:
    "En granskning på tre veckor och två år i ert team genomförs på samma sätt. Välj en väg in och dra längs linjen för att se vad som händer när.",
  introPhone: "En granskning på tre veckor och två år i ert team genomförs på samma sätt. Välj en väg in för att se vad som händer när.",
  waysLabel: "Vägar in",
  lengthLabel: "Totalt",
  scrubLabel: "Var i uppdraget",
  previous: "Tidigare",
  next: "Senare",
  units: { week: "Vecka", weeks: "Veckor", month: "Månad", months: "Månader" },
  phases: [
    { title: "Definiera", body: "Vi kommer överens om målet, vad som står i vägen och hur vi båda vet att det fungerade, och skriver ned det." },
    { title: "Ansluta", body: "Våra medarbetare får åtkomst och börjar i ert team, era verktyg och era rutiner." },
    { title: "Leverera", body: "Arbetet levereras i små delar som ni kan se och använda. När underlaget ändras, ändras planen." },
    { title: "Överlämna", body: "Kod, uppsättning och kunskap förs över till ert team, så att allt fungerar utan oss." },
  ],
  ways: en.howWeWork.ways.map((way) => {
    const words = ways[way.id];
    return {
      ...way,
      label: words.label,
      short: words.short,
      length: words.length,
      shown: words.shown,
      moments: way.moments.map((moment, i) => ({ ...moment, ...words.moments[i] })),
    };
  }),
};

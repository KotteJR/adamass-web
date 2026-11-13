// Svenska: tjänsterna ("Fem vägar in") och AWS-erbjudandet. Id, länkar och figurernas rörelser delas med engelskan.

import * as en from "../services";
import type { AwsOffer, AwsSectionContent, Service } from "../services";
import { anchors, site } from "../site";

export * from "../services";

// ─── Fem vägar in ──────────────────────────────────────────────

export const services: Service[] = [
  {
    id: "embedded",
    tag: "Leverans",
    title: "Inbäddad leverans",
    shortTitle: "Inbäddad leverans",
    summary:
      "Vi går in i ert utvecklingsteam och arbetar i era kodförråd, verktyg och rutiner. En namngiven ansvarig håller i arbetet hela vägen.",
    specs: [
      { label: "Börjar med", value: "En namngiven ansvarig i ert team" },
      { label: "Arbetar i", value: "Era kodförråd och rutiner" },
      { label: "Vanligtvis", value: "3 månader till 2 år" },
    ],
    figureLabel: "En rad arbetsstationer med ett transportband; vår station stämplar varje arbetsmoment som passerar.",
    entails: [
      { title: "Ansluta", text: "Våra medarbetare i era stand-ups, kodförråd och jourscheman." },
      { title: "Leverera", text: "Releaser från det gemensamma teamet når era användare." },
      { title: "Kliva av", text: "Vår kunskap förs över till era egna medarbetare." },
    ],
  },
  {
    id: "modernisation",
    tag: "Äldre system",
    title: "Modernisering",
    shortTitle: "Modernisering",
    summary:
      "Vi hittar det som är dyrt att förändra i ett åldrande system och ersätter det i etapper, medan resten fortsätter att fungera.",
    specs: [
      { label: "Börjar med", value: "En genomlysning av systemen" },
      { label: "Arbetssätt", value: "I etapper, inte en omskrivning" },
      { label: "Under tiden", value: "Systemet fortsätter att fungera" },
    ],
    figureLabel:
      "En rörledning i fyra delar mellan en pump och en tank; slitna delar byts mot nya en i taget medan flödet fortsätter.",
    entails: [
      { title: "Analysera", text: "Vad som är dyrt att förändra, och varför." },
      { title: "Ersätta", text: "I etapper, inte en omskrivning." },
      { title: "Hålla igång", text: "Resten av systemet fungerar hela tiden." },
    ],
  },
  {
    id: "diligence",
    tag: "Rådgivning",
    title: "Due diligence och rådgivning",
    shortTitle: "Due diligence",
    summary:
      "Ett utlåtande om en mjukvarutillgång, skrivet för dem som betalar för den. Den bedömning vi själva skulle agera på.",
    specs: [
      { label: "Börjar med", value: "Ett avgränsningssamtal och tillgång till koden" },
      { label: "Omfattar", value: "Arkitektur, data och team" },
      { label: "Vanligtvis", value: "3 till 5 veckor" },
    ],
    figureLabel:
      "En stängd låda åker på ett transportband genom en skannerbåge; inuti blir den genomskinlig och visar tre delar, och sedan kommer en rapport med tre bedömningar ut.",
    entails: [
      { title: "Läsa", text: "Kod, molnmiljö, dokument och intervjuer med teamet." },
      { title: "Granska", text: "Arkitektur, data och leverans, med prissatta risker." },
      { title: "Rapportera", text: "Varningssignaler, kostnaden för åtgärder och en 90-dagarsplan." },
    ],
  },
  {
    id: "genai",
    tag: "AI",
    title: "Utveckling av generativ AI",
    shortTitle: "Generativ AI",
    summary:
      "Plattformar, gränssnitt och den mjukvara en modell lever i, eller en modell som kopplas in i de system ni redan har.",
    specs: [
      { label: "Börjar med", value: "Ett test på era egna data" },
      { label: "Bygger", value: "Plattformar och integrationer" },
      { label: "Vanligtvis", value: "8 till 14 veckor" },
    ],
    figureLabel:
      "Ett kretskort med tre system; en modellmodul sänks ned i sockeln och signaler löper ut längs ledningarna.",
    entails: [
      { title: "Testsvit", text: "Verkliga frågor från ert team poängsätter varje version." },
      { title: "Prototyp", text: "Körs på era egna dokument, i ert AWS-konto." },
      { title: "I drift", text: "Skyddsräcken på, och en spårning bakom varje svar." },
    ],
  },
  {
    id: "soc2",
    tag: "Regelefterlevnad",
    title: "SOC 2-beredskap",
    shortTitle: "SOC 2",
    summary:
      "Vi förbereder er AWS-miljö, era policyer och ert underlag för en SOC 2-revision, först Typ I och sedan Typ II, och hjälper er att hålla dem aktuella. En oberoende revisor genomför revisionen och utfärdar rapporten.",
    specs: [
      { label: "Börjar med", value: "Omfattning och en gaplista" },
      { label: "Bygger", value: "Kontroller, policyer och underlag" },
      { label: "Vanligtvis", value: "Typ I inom 3 till 6 månader" },
    ],
    figureLabel:
      "Kontrollådor tänds en i taget, underlag förs till ett arkiv och en revisors stämpel förseglar rapporten.",
    entails: [
      { title: "Gaplista", text: "Omfattning, kriterier och luckorna i prioritetsordning." },
      { title: "Kontroller", text: "Policyer, kontroller och underlag som samlas in åt er." },
      { title: "Revision", text: "En oberoende revisor testar och utfärdar rapporten." },
    ],
  },
];

export const servicesSection: typeof en.servicesSection = {
  label: "Fem vägar in",
  askLabel: "Fråga oss om detta",
  askHref: `#${anchors.contact}`,
};

// ─── AWS ───────────────────────────────────────────────────────

/** The listings keep their AWS Marketplace names; the rest is in Swedish. */
const swedish: Record<string, Pick<AwsOffer, "title" | "short" | "body" | "readout" | "steps" | "specs">> = {
  "landing-zone": {
    steps: ["Konton öppnas", "Skyddsräcken låses", "Loggar samlas på ett ställe"],
    title: "Landing Zone Foundation",
    short: "En styrd grund med flera konton",
    body: "En styrd molngrund med flera konton, byggd med plattformens egna styrningsverktyg. För nya miljöer, och för team som redan kör i produktion utan kontoseparation eller skyddsräcken.",
    readout: "Sex konton · skyddsräcke låst",
    specs: [
      { label: "Struktur", value: "Kontohierarki, förebyggande skyddsräcken, central identitetshantering" },
      { label: "Grundnivå", value: "Centraliserad loggning, hotdetektering, övervakning av säkerhetsläget" },
      { label: "Överlämning", value: "Dokumentation och en prioriterad åtgärdslista" },
    ],
  },
  architect: {
    steps: ["40-timmarsklockan startar", "Varje konto granskas", "Ett beslutsunderlag tas fram"],
    title: "Architect as a Service",
    short: "Senior bedömning i block om 40 timmar",
    body: "Senior molnarkitektur i block om 40 timmar, som används flexibelt under upp till två månader. Varje block ger skriftliga resultat: beslutsunderlag, granskningsrapporter och en färdplan som går att agera på.",
    readout: "40 timmar in · ett beslutsunderlag ut",
    specs: [
      { label: "Grundenhet", value: "40 timmar, som används under upp till två månader" },
      { label: "Omfattning", value: "Styrning, design av AI-plattformar, kostnader, automation och kompetensöverföring" },
      { label: "Kombinera", value: "Köp flera block, eller lägg till ett i ett genomförandeprojekt" },
    ],
  },
  perimeter: {
    steps: ["Väggar stängs runt ert konto", "Frågor går via en privat kabel", "Publika anrop stoppas vid väggen"],
    title: "Sovereign AI Perimeter",
    short: "En privat assistent i ert konto",
    body: "En privat AI-assistent som körs i ert eget molnkonto, på hanterade grundmodeller. Den nås endast via VPN eller en annan kontrollerad kanal, aldrig via det öppna internet. Ingen ny leverantör hanterar era data.",
    readout: "En privat kabel · inga publika dörrar",
    specs: [
      { label: "Placering", value: "Ert konto, er region, er säkerhetsgräns" },
      { label: "Åtkomst", value: "Endast privat kanal, ingen publik ändpunkt" },
      { label: "Kontroll", value: "Modellåtkomst, kostnadstak och granskningsloggar förblir era" },
    ],
  },
  migration: {
    steps: ["Flyttas till testmiljön", "Kontroller körs tills de stämmer", "Till produktion"],
    title: "Migrering",
    short: "Flytta arbetslaster i etapper",
    body: "Vi flyttar applikationer och data till AWS steg för steg: först till testmiljön, till produktion när siffrorna stämmer.",
    readout: "Testmiljö först · produktion när det håller",
    specs: [
      { label: "Arbetssätt", value: "Etappvis, med steg som går att backa" },
      { label: "Först", value: "En analys som ni behåller" },
      { label: "Mål", value: "Containrar och hanterade databaser" },
    ],
  },
  "genai-bedrock": {
    steps: ["Er produkt frågar", "Rätt kort hittas", "Svaret pekar på sitt kort"],
    title: "Generativ AI på Bedrock",
    short: "Agenter och modeller i er produkt",
    body: "AI inbyggd i er produkt på Amazon Bedrock och SageMaker, med alla typer av modeller: språk, bild, tal eller prognoser. Vi bygger egna agentflöden på Strands Agents, LangGraph och LangChain, tränar eller finjusterar en modell när en färdig inte räcker, och testar allt före lansering. Data stannar i ert konto.",
    readout: "Varje svar pekar på sitt kort",
    specs: [
      { label: "Agenter", value: "Egna flöden på Strands, LangGraph och LangChain" },
      { label: "Modeller", value: "Alla typer, från Bedrock eller tränade på SageMaker" },
      { label: "Bevis", value: "Utvärderingar före lansering, spårning i produktion" },
    ],
  },
};

export const awsOffers: AwsOffer[] = en.awsOffers.map((offer) => ({ ...offer, ...swedish[offer.id] }));

export const awsSection: AwsSectionContent = {
  headline: {
    lead: "AWS, från första kontot och uppåt.",
    rest: "Välj en tjänst för att se vad den sätter upp.",
  },
  figureLabel:
    "Er AWS-organisation som ett utrustningsskåp på en arbetsbänk: lådor för konton, en skyddsräckesstång, en kortlåda, en ratt och en skrivare överst, en vagn, en privat kabel och de delar varje tjänst lägger till.",
  intro:
    "Tre av dessa finns på AWS Marketplace. Ritningen visar er AWS-organisation som ett skåp: varje låda är ett konto, och det blå är det tjänsten sätter på plats.",
  tabsLabel: "AWS-tjänster",
  legend: { setUp: "Sätts upp av tjänsten", tray: "En låda, ett konto" },
  listed: {
    where: "Finns på AWS Marketplace",
    action: "Se erbjudandet",
    newTab: "på AWS Marketplace (öppnas i en ny flik)",
  },
  direct: {
    where: "Levereras av vårt team",
    action: { label: "Fråga oss om detta", href: `#${anchors.contact}` },
  },
  notes: [
    {
      title: "Så fungerar köpet",
      body: "Detta är erbjudanden för professionella tjänster, så det finns inget pris i kassan. Ni efterfrågar tjänsten, vi kommer överens om omfattningen i ett samtal och lämnar ett privat erbjudande som ni godkänner. Fakturan kommer via det molnkonto ni redan har.",
    },
    {
      title: "Vad som inte ingår",
      body: "Molninfrastruktur och modellanvändning faktureras av er leverantör, separat från själva tjänsten. Vi sätter upp budgetar och larm så att förbrukningen syns från första dagen.",
    },
    {
      title: "Alla erbjudanden",
      body: "Landing Zone Foundation, Architect as a Service och Sovereign AI Perimeter finns på AWS Marketplace som privata erbjudanden. Migrering och generativ AI på Bedrock levereras direkt.",
      link: { label: "Vår profil på AWS Marketplace", href: site.awsMarketplace },
    },
  ],
};

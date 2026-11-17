// Svenska: förfrågan i kontaktfönstret, "Kontakta oss" och "Så går det till".

import type { BriefTopicOption, ContactContent } from "../contact";
import { site } from "../site";

export * from "../contact";

export const briefTopics: BriefTopicOption[] = [
  { value: "embedded", label: "Inbäddad leverans" },
  { value: "modernisation", label: "Modernisering" },
  { value: "diligence", label: "Due diligence" },
  { value: "genai", label: "Generativ AI" },
  { value: "aws", label: "AWS" },
];

export const contact: ContactContent = {
  label: "Kontakta oss",
  headline: {
    lead: "Berätta vad som står i vägen.",
    rest: "Vi säger om vi är rätt team.",
  },
  body: "Skriv några rader om produkten och vad som känns tungt. Det är de som skulle göra arbetet som läser det, inte en säljavdelning.",
  email: { label: site.email, href: `mailto:${site.email}` },
  closeLabel: "Stäng",
  tabs: { label: "Kontakta oss", book: "Boka ett samtal", reachOut: "Skriv till oss", howItWorks: "Så går det till" },
  booking: {
    with: "Med",
    loading: "Hämtar lediga tider",
    unavailable: `Kalendern kunde inte laddas. Skriv till oss i stället, eller mejla ${site.email}.`,
    none: "Inga lediga tider de närmaste tre veckorna. Skriv till oss så hittar vi en.",
    previousMonth: "Föregående månad",
    nextMonth: "Nästa månad",
    days: "Dagar med lediga tider",
    times: "Lediga tider",
    footnote: "30 min · tid i {zone}",
    chosen: "Ert samtal",
    change: "Byt tid",
    company: "Företag (valfritt)",
    note: "Något vi bör läsa innan? (valfritt)",
    submit: "Boka samtalet",
    pending: "Bokar",
    confirm: "Ni får en kalenderinbjudan via e-post. Där kan ni flytta eller avboka samtalet.",
    taken: "Någon tog den tiden alldeles nyss. Välj en annan.",
    failed: `Något gick fel hos oss och samtalet bokades inte. Försök igen, eller skriv till ${site.email}.`,
    busy: "För många försök från den här anslutningen. Vänta några minuter, eller skriv till oss.",
    invalid: "Några fält behöver ses över.",
    errors: {
      slot: "Välj en tid igen.",
      name: "Ange ert namn.",
      nameLong: "Namnet är längre än vi kan spara.",
      email: "Vi behöver en e-postadress för inbjudan.",
      companyLong: "Håll företagsnamnet under 120 tecken.",
      topic: "Välj vad samtalet gäller.",
      noteLong: "Håll er under 2 000 tecken; resten tar vi i samtalet.",
    },
    invite: {
      subject: "Introduktionssamtal med Adamass",
      intro: "Trettio minuter med Adamass, bokat via adamass.se.",
      outro: `Vill ni flytta eller avboka samtalet, svara på inbjudan eller skriv till ${site.email}.`,
      name: "Namn",
      email: "E-post",
      company: "Företag",
      topic: "Gäller",
      timeZone: "Er tidszon",
      note: "Meddelande",
    },
  },
  form: {
    topicLegend: "Vad gäller det?",
    name: "Namn",
    email: "E-post i tjänsten",
    brief: "Förfrågan",
    briefPlaceholder: "Vad känns tungt just nu? Några rader räcker.",
    note: "Vi svarar med vår tillgänglighet och föreslår sedan ett kort introduktionssamtal.",
    submit: "Skicka förfrågan",
    pending: "Skickar",
    success: {
      title: "Tack. Vi har tagit emot er förfrågan.",
      body: "De som skulle göra arbetet läser den, och sedan svarar vi med vår tillgänglighet och ett förslag på ett kort introduktionssamtal.",
    },
    failed: `Något gick fel hos oss och förfrågan skickades inte. Er text finns kvar: försök igen, eller skriv till ${site.email}.`,
    invalid: "Några fält behöver ses över.",
    errors: {
      topic: "Välj vad förfrågan gäller.",
      name: "Ange ert namn.",
      nameLong: "Namnet är längre än vi kan spara.",
      email: "Vi behöver en e-postadress som vi kan svara till.",
      briefShort: "Några rader räcker, men vi behöver några.",
      briefLong: "Håll er under 4 000 tecken; vi frågar om vi behöver mer.",
    },
  },
  steps: [
    {
      title: "Skriv en kort förfrågan",
      body: `Några rader till ${site.email} räcker. Vad som känns tungt, och när det behöver vara klart.`,
    },
    {
      title: "Ett kort samtal",
      body: "Vi svarar med vår tillgänglighet, och sedan tar vi trettio minuter för att bekräfta passform, omfattning och tidplan.",
    },
    {
      title: "Rätt personer",
      body: "Data scientists, utvecklare eller arkitekter, så många som arbetet kräver, i ert team eller vid sidan av det. En namngiven ansvarig håller i arbetet.",
    },
    {
      title: "Köp via AWS",
      body: "Tre tjänster finns på AWS Marketplace som privata erbjudanden och faktureras via det AWS-konto ni redan har.",
    },
  ],
};

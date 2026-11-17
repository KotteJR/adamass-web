// Svenska: sidorna utöver startsidan. Titlar och beskrivningar för sökmotorer, etiketter, vanliga frågor och juridisk text.

import type { PagesContent } from "../pages";
import { site } from "../site";

export * from "../pages";

export const pages: PagesContent = {
  meta: {
    services: {
      title: "IT- och AI-konsulttjänster i Malmö",
      description:
        "Fem vägar in: inbäddad leverans, modernisering, teknisk due diligence, generativ AI och SOC 2-beredskap. Seniora utvecklare och data scientists i Malmö sedan 2019.",
    },
    "service:embedded": {
      title: "Inbäddad leverans: seniora utvecklare i ert team",
      description:
        "Våra utvecklare går in i ert team och arbetar i era kodförråd, verktyg och rutiner, med en namngiven ansvarig. Vanligtvis 3 månader till 2 år.",
    },
    "service:modernisation": {
      title: "Modernisering av system i etapper",
      description:
        "Vi hittar det som är dyrt att förändra i ett åldrande system och ersätter det i etapper medan resten fortsätter att fungera. Modernisering från Adamass i Malmö.",
    },
    "service:diligence": {
      title: "Teknisk due diligence och rådgivning",
      description:
        "Ett skriftligt utlåtande om en mjukvarutillgång: arkitektur, data och team, prissatta risker, varningssignaler och en 90-dagarsplan. Vanligtvis 3 till 5 veckor.",
    },
    "service:genai": {
      title: "AI-konsult: generativ AI och finjustering av modeller",
      description:
        "Vi tränar och finjusterar modeller och bygger generativ AI, RAG och AI-agenter på AWS, testade på era egna data och i ert eget konto. Vanligtvis 8 till 14 veckor.",
    },
    "service:soc2": {
      title: "SOC 2-beredskap på AWS",
      description:
        "Vi förbereder er AWS-miljö, era policyer och ert underlag för en SOC 2-revision, först Typ I och sedan Typ II. En oberoende revisor utfärdar rapporten.",
    },
    aws: {
      title: "AWS-konsult i Malmö: landing zones, migrering och Bedrock",
      description:
        "Landing Zone Foundation, Architect as a Service och Sovereign AI Perimeter på AWS Marketplace, samt migrering och generativ AI på Amazon Bedrock. Adamass, Malmö.",
    },
    work: {
      title: "Utvalda arbeten: AI-system och produkter",
      description:
        "Våra egna produkter Murmur och Morrow, och två AI-system byggda för kunder i reglerade verksamheter: en 27B-modell för regelefterlevnad och extraktion mot ett bibliotek.",
    },
    "work:murmur": {
      title: "Murmur: en musikmodell för fokus och sömn",
      description: "Murmur skriver sömlösa loopar för fokus och sömn med en musikmodell med öppen källkod som vi har vidaretränat på lofi och brus.",
    },
    "work:morrow": {
      title: "Morrow: dagliga pussel skrivna av vår egen modell",
      description: "Morrow ger bort elva pussel varje morgon, skrivna av en pusselmodell som vi har tränat själva och kontrollerade av lösare så att varje pussel har ett svar.",
    },
    "work:compliance-slm": {
      title: "Compliance SLM: en 27B-modell i kundens moln",
      description:
        "En specialiserad 27B-modell, finjusterad och förstärkt, som läser en artikel i ett regelverk och returnerar de risker och kontroller som binder. 94 av 100 stämmer med granskaren.",
    },
    "work:library-extraction": {
      title: "Extraktion mot ett bibliotek för regelefterlevnad",
      description: "Två sökvägar, en i dokumentet och en i ett bibliotek av kontroller, så att varje svar är en kontroll som granskarna redan känner igen.",
    },
    faq: {
      title: "Vanliga frågor om Adamass",
      description: "Vilka Adamass är, vad vi arbetar med, hur ett uppdrag går till, hur lång tid arbetet tar, hur köp via AWS Marketplace fungerar och hur ni kommer i gång.",
    },
    privacy: { title: "Integritetspolicy", description: "Hur Adamass AB hanterar personuppgifter på adamass.se, i förfrågningar som skickas via webbplatsen och i e-post." },
    terms: { title: "Användarvillkor", description: "Villkoren för att använda adamass.se, webbplatsen för Adamass AB i Malmö." },
    booked: { title: "Samtalet är bokat", description: "Ert introduktionssamtal med Adamass är bokat. Inbjudan kommer via e-post." },
  },
  crumbs: { label: "Brödsmulor", home: "Startsida", services: "Tjänster", work: "Arbeten" },
  servicesIndex: {
    label: "Tjänster",
    title: { lead: "Fem vägar in.", rest: "Ett sätt att arbeta." },
    intro:
      "Ett mjukvaru- och AI-företag i Malmö sedan 2019. Data scientists, utvecklare och arkitekter som går in i ert team eller levererar hela projektet. Välj den väg in som passar arbetet.",
  },
  service: {
    involves: "Vad det innebär",
    runs: "Så går det till",
    aws: "På AWS",
    work: "Arbeten som detta",
    others: "Andra vägar in",
    more: "Läs mer",
  },
  workPage: { all: "Alla arbeten", label: "Utvalda arbeten" },
  faq: {
    label: "Vanliga frågor",
    title: { lead: "Vanliga frågor,", rest: "raka svar." },
    intro: `Det som många undrar innan de skriver till oss. Allt annat: ${site.email}.`,
    items: [
      {
        q: "Vad är Adamass?",
        a: "Adamass AB är ett mjukvaru- och AI-företag i Malmö som har arbetat sedan 2019. Data scientists, ML-ingenjörer, mjukvaru- och molnutvecklare samt arkitekter går in i kundens team eller levererar hela projektet, och vi bygger egna produkter, Murmur och Morrow, på samma teknik.",
      },
      {
        q: "Vad arbetar ni med?",
        a: "Fem vägar in: inbäddad leverans i ett befintligt team, modernisering av åldrande system, teknisk due diligence och rådgivning, utveckling av generativ AI samt SOC 2-beredskap. På AWS sätter vi även upp landing zones, migrerar arbetslaster och bygger på Amazon Bedrock.",
      },
      {
        q: "Bygger ni AI, eller ger ni råd om det?",
        a: "Vi bygger. Vi tränar och finjusterar modeller när en färdig inte räcker, bygger generativ AI, RAG och AI-agenter på Amazon Bedrock och SageMaker, och testar varje version mot verkliga frågor före lansering. Ett exempel: en 27B-modell för regelefterlevnad, finjusterad och förstärkt, där 94 av 100 svar på reserverad testdata stämmer med granskarens. Data stannar i kundens eget AWS-konto.",
      },
      {
        q: "Är ni ett bemanningsföretag?",
        a: "Nej. Våra medarbetare arbetar i era kodförråd, verktyg och rutiner, men en namngiven ansvarig håller i arbetet. När vi lämnar finns källkod, konfiguration och dokumentation hos ert team.",
      },
      {
        q: "Hur går ett uppdrag till?",
        a: "Definiera, ansluta, leverera, överlämna. Vi kommer överens om målet och hur vi vet att det fungerade, börjar i ert team och era verktyg, levererar i små delar som ni kan se och använda, och överlämnar kod, uppsättning och kunskap så att allt fungerar utan oss.",
      },
      {
        q: "Hur lång tid tar arbetet?",
        a: "Due diligence tar vanligtvis 3 till 5 veckor, utveckling av generativ AI 8 till 14 veckor, och inbäddad leverans pågår från 3 månader till 2 år. SOC 2-beredskap når Typ I inom 3 till 6 månader. Architect as a Service levereras i block om 40 timmar under upp till två månader.",
      },
      {
        q: "Vad finns på AWS Marketplace, och hur fungerar köpet?",
        a: "Tre professionella tjänster: Landing Zone Foundation, Architect as a Service och Sovereign AI Perimeter. Det finns inget pris i kassan: ni efterfrågar tjänsten, vi kommer överens om omfattningen i ett samtal och lämnar ett privat erbjudande, och fakturan kommer via det AWS-konto ni redan har.",
      },
      {
        q: "Var finns ni?",
        a: `I Malmö. Adamass AB har organisationsnummer ${site.orgNumber}. Vi arbetar med team i Sverige och utomlands.`,
      },
      {
        q: "Hur kommer vi i gång?",
        a: `Skicka en kort förfrågan via webbplatsen eller skriv till ${site.email}: några rader om vad som känns tungt och när det behöver vara klart. De som skulle göra arbetet läser den, och vi svarar med vår tillgänglighet och ett förslag på ett kort introduktionssamtal.`,
      },
    ],
  },
  legal: {
    updatedLabel: "Senast uppdaterad",
    updated: "17 november 2026",
    privacy: {
      title: "Integritetspolicy",
      body: [
        { p: "Den här policyn förklarar hur Adamass AB (\"Adamass\", \"vi\") hanterar personuppgifter när ni använder adamass.se, skickar en förfrågan via webbplatsen eller skriver till oss. Vi är ett mjukvaru- och AI-företag i Malmö. Vi annonserar inte, och webbplatsen använder inga cookies för marknadsföring eller analys." },
        { h: "Personuppgiftsansvarig" },
        { p: `Adamass AB, organisationsnummer ${site.orgNumber}, är personuppgiftsansvarig för de uppgifter som beskrivs här. Skriv till ${site.email} om ni har frågor om policyn eller era uppgifter.` },
        { h: "Vilka uppgifter vi samlar in" },
        { p: "När ni skickar en förfrågan via webbplatsen får vi det ni fyller i: ämnet, ert namn, er e-postadress i tjänsten och ert meddelande. När ni mejlar oss får vi er adress, meddelandet och eventuella bilagor. Vi använder uppgifterna endast för att svara, bedöma om vi är rätt team och spara en historik över konversationen." },
        { p: "När ni bokar ett samtal i kalendern på webbplatsen får vi den tid ni väljer, ert namn, er e-postadress i tjänsten, ert företag om ni anger det, ämnet och eventuellt meddelande. Uppgifterna blir ett möte i våra kalendrar i Microsoft 365, och Microsoft skickar inbjudan till er. Vi använder dem för att hålla samtalet och spara en historik över det." },
        { p: "Vår webbhotellsleverantör sparar vanliga tekniska loggar under en kort tid (IP-adress, webbläsare, vilken sida som efterfrågades och när) för att driva och skydda webbplatsen, inte för att profilera er. Webbplatsens typsnitt levereras från vår egen domän, så inga typsnittsanrop går till tredje part." },
        { p: "För att se vilka sidor som läses använder vi Vercel Web Analytics från vår webbhotellsleverantör. Tjänsten sätter inga cookies. För varje sidvisning registreras sidan, webbplatsen ni kom från, webbläsare, operativsystem och typ av enhet samt en ungefärlig plats (land, region, ort) utifrån anropet. En besökare känns endast igen genom en hash av anropet som raderas efter 24 timmar, och vi ser siffrorna endast sammanställda, aldrig kopplade till en person eller en IP-adress." },
        { p: "För att hålla automatiserad trafik borta från bokningskalendern och formuläret för förfrågningar passerar de anropen Vercel BotID, en kontroll som vår webbhotellsleverantör kör i er webbläsare. Den talar bara om för oss om ett anrop ser automatiserat ut." },
        { p: "Vi använder inga spårningscookies, inga annonsspårare och säljer inga personuppgifter." },
        { h: "Varför vi behandlar uppgifterna" },
        { p: "Vi behandlar förfrågningar, bokningar och e-post för att svara och för att vidta åtgärder på er begäran inför ett eventuellt uppdrag (artikel 6.1 b i dataskyddsförordningen), och tekniska loggar och sidstatistik med stöd av vårt berättigade intresse av att hålla webbplatsen tillgänglig och säker och att veta vilka sidor som är till nytta (artikel 6.1 f)." },
        { h: "Hur länge vi sparar uppgifterna" },
        { p: "Förfrågningar, bokningar och e-post sparas så länge konversationen pågår och en rimlig tid därefter, eller längre när bokföringsregler, ett avtal eller ett rättsligt anspråk kräver det. Tekniska loggar sparas endast så länge leverantören behöver dem för drift och säkerhet." },
        { h: "Vem vi delar uppgifterna med" },
        { p: "Vi använder ett webbhotell (Vercel) och Microsoft 365 för e-post och kalendrar för att driva adamass.se, ta emot meddelanden och boka samtal; de behandlar uppgifter enligt våra instruktioner. Vi delar inte era uppgifter med någon annan om inte ni ber oss om det, ett avtal kräver det eller lagen gör det." },
        { h: "Era rättigheter" },
        { p: `Ni kan begära tillgång till de personuppgifter vi har om er, be oss rätta eller radera dem, begränsa eller invända mot viss behandling och begära dataportabilitet där den rätten gäller. Skriv till ${site.email}. Ni kan även klaga hos Integritetsskyddsmyndigheten (IMY).` },
        { h: "Ändringar" },
        { p: "Om vi ändrar hur webbplatsen samlar in uppgifter uppdaterar vi den här sidan och datumet ovan." },
      ],
    },
    terms: {
      title: "Användarvillkor",
      body: [
        { p: "Dessa villkor gäller adamass.se, webbplatsen för Adamass AB i Malmö. Genom att använda webbplatsen godtar ni dem. De gäller endast webbplatsen: ett uppdrag med Adamass börjar först när båda parter har kommit överens om det skriftligen." },
        { h: "Vad webbplatsen är" },
        { p: "Webbplatsen beskriver vårt arbete och hur ni når oss. Inget på den är ett erbjudande, en offert eller professionell rådgivning att grunda ett beslut på. Tillgänglighet, omfattning och arvode bekräftas i ett skriftligt uppdrag om vi tar arbetet." },
        { h: "Förfrågningar och meddelanden" },
        { p: `Ni kan skicka en förfrågan via webbplatsen eller skriva till ${site.email} eller till en namngiven person. En förfrågan skapar inget avtal och ingen skyldighet för oss att svara med ett förslag. Skicka inte konfidentiella kundfiler, lösenord eller personuppgifter som ni inte får dela förrän vi har kommit överens om hur sådant material ska hanteras.` },
        { h: "Immateriella rättigheter" },
        { p: "Text, bilder, figurer, målningar och kännetecken på webbplatsen tillhör Adamass AB eller dess licensgivare. Ni får inte kopiera webbplatsen eller dess innehåll i kommersiellt syfte utan vårt skriftliga medgivande. Kunders namn och kännetecken tillhör kunderna och visas endast som referenser." },
        { h: "Godtagbar användning" },
        { p: "Missbruka inte webbplatsen: ingen insamling som belastar tjänsten, inga försök att kringgå dess säkerhet och ingen användning av innehållet för att antyda ett samarbete med Adamass som inte finns." },
        { h: "Ansvar" },
        { p: "Webbplatsen tillhandahålls i befintligt skick. Vi lägger omsorg på att hålla den korrekt men lovar inte att den är fullständig, aktuell eller alltid tillgänglig. I den utsträckning svensk lag tillåter ansvarar Adamass AB inte för förlust som enbart beror på användning av, eller oförmåga att använda, webbplatsen." },
        { h: "Integritet" },
        { p: "Hur vi hanterar personuppgifter beskrivs i integritetspolicyn." },
        { h: "Tillämplig lag" },
        { p: "Svensk lag gäller för dessa villkor och svensk domstol är behörig, med Malmö tingsrätt som första instans där det valet är tillåtet. Om en del av villkoren inte kan göras gällande gäller resten ändå." },
        { h: "Ändringar" },
        { p: "Vi kan uppdatera villkoren när webbplatsen eller vårt arbete förändras. Datumet ovan visar vilken version som gäller." },
      ],
    },
  },
  footer: { services: "Tjänster", company: "Företaget", faq: "Vanliga frågor", privacy: "Integritet", terms: "Villkor" },
  booked: {
    label: "Bokat",
    title: { lead: "Samtalet är bokat.", rest: "Hörs snart." },
    when: "När",
    sentTo: "Inbjudan är på väg till {email}.",
    sent: "Inbjudan är på väg till er inkorg.",
    move: `Vill ni flytta eller avboka samtalet, använd inbjudan eller skriv till ${site.email}.`,
    back: "Tillbaka till webbplatsen",
  },
};

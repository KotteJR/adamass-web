// Svenska: utvalda arbeten. Kortens bilder, scener och länkar delas med engelskan; kunden namnges aldrig.

import * as en from "../work";
import type { WorkProduct, WorkSectionContent } from "../work";

export * from "../work";

const bySlug = (slug: WorkProduct["slug"]) => {
  const product = en.workProducts.find((p) => p.slug === slug);
  if (!product) throw new Error(`No product ${slug}`);
  return product;
};

const murmur = bySlug("murmur");
const morrow = bySlug("morrow");
const compliance = bySlug("compliance-slm");
const extraction = bySlug("library-extraction");

export const workProducts: WorkProduct[] = [
  {
    ...murmur,
    tags: ["Vår produkt", "Genererat ljud", "Kommer snart"],
    line: "Ljud för fokus och sömn. En musikmodell som vi har vidaretränat på lofi och brus skriver varje loop.",
    cardLine: "Ljud för fokus och sömn. Varje loop skrivs av vår egen musikmodell.",
    modal: {
      ...murmur.modal,
      label: "Vår produkt · Webb · Kommer snart",
      title: { lead: "Ljud som ni beskriver.", rest: "I loop hela natten." },
      overview: {
        body: "Murmur skapar ljud för fokus och sömn. Välj instrument, stämning och textur, eller forma ett brus efter rummet ni befinner er i. Den skriver en loop som binder ihop slut och början utan skarv, så att den kan spelas hela natten.",
        stats: [
          { value: "12", label: "instrument, från piano till harpa" },
          { value: "6", label: "texturer: vinyl, regn, kafé, band, vind, eld" },
          { value: "1 till 4 min", label: "långa loopar som spelas i timmar" },
        ],
      },
      model: {
        // TODO founders: bekräfta "14 000 timmar" och "bedömt på gehör" (samma som i engelskan).
        body: "Vi tog en musikmodell med öppen källkod och byggde om den för en enda uppgift. Omkring 90 % av dess vikter är vidaretränade av oss, på 14 000 timmar lofi och brus som bedömts på gehör utifrån en enda sak: inget i den ska dra till sig uppmärksamheten. Nu skriver den en hel loop i 8 steg, och det sista samplet landar exakt där det första började.",
        figure: {
          key: "murmur",
          steps: ["Lofi och brus in", "~90 % av lagren omtränade", "En loop utan skarv"],
          label:
            "Lofi och brus går in i modellen; nio av dess tio lager tänds när de tränas om; en loop kommer ut och går runt utan skarv",
        },
        stats: [
          { value: "14 000 h", label: "lofi och brus som den har lärt sig av" },
          { value: "8 steg", label: "för att skriva en hel loop" },
          { value: "0", label: "hörbara skarvar, hela natten" },
        ],
      },
      stack: [
        { name: "Modell", items: ["ACE-Step 1.5 Turbo som bas", "Vidareträning på lofi och brus", "Generering i 8 steg"] },
        {
          name: "Ljud",
          items: ["Pedalboard", "NumPy", "SciPy", "Web Audio AudioWorklet", "Sömlös rendering av loopar"],
        },
        {
          name: "Webbapp",
          items: ["Next.js", "React", "TypeScript", "Motion", "GSAP", "PixiJS", "Radix UI", "Zod"],
        },
        { name: "API", items: ["FastAPI", "SQLAlchemy", "Pydantic", "Stripe", "JWT"] },
        { name: "AWS", items: ["ECS Fargate", "RDS Postgres", "S3", "SQS-arbetare", "AWS CDK"] },
      ],
      cta: { label: "Ställ er i kö", href: "#contact" },
    },
  },
  {
    ...morrow,
    tags: ["Vår produkt", "Egen modell", "Kommer snart"],
    line: "De dagliga pussel som andra tar betalt för, gratis varje morgon. En modell vi har tränat själva skriver dem.",
    cardLine: "Pusslen som andra tar betalt för, gratis varje morgon. Skrivna av vår modell.",
    modal: {
      ...morrow.modal,
      label: "Vår produkt · Webb · Kommer snart",
      title: { lead: "Pusslen som andra tar betalt för,", rest: "gratis varje morgon." },
      overview: {
        body: "Morrow har den sortens dagliga pussel som man vanligtvis betalar en prenumeration för: ett korsord och ett minikorsord, ord på fem bokstäver, ordgrupper, ordtrådar, sifferpussel och mer. AI skriver dem, vilket gör dem så billiga att ta fram att de kan ges bort, så vid midnatt kommer samma elva till alla, gratis. Åtta Odds-spel, där man spelar mot en språkmodells gissningar, en onsdagsspecial och en månatlig almanacka finns runt omkring.",
        stats: [
          { value: "11", label: "nya pussel varje dag" },
          { value: "1 svar", label: "per pussel, bevisat av en lösare" },
          { value: "8 Odds", label: "spel mot en modell" },
        ],
      },
      model: {
        // TODO founders: bekräfta "4 000 utkast per natt", "1 av 360" och "under ett öre" (samma som i engelskan).
        body: "Vår pusselmodell är tränad internt för att göra det en pusselredaktör gör. Varje natt tar den fram omkring 4 000 utkast. Lösare spelar sedan igenom vart och ett: pussel med ett andra svar, en återvändsgränd eller en tråkig väg sorteras bort, och resten rangordnas efter hur de känns att lösa. Elva blir kvar. Eftersom modellen är liten och vår egen kostar en hel dag med nya pussel mindre än ett öre att ta fram. Det är poängen: AI ska göra bra underhållning billigare för alla, inte bli ännu en prenumeration.",
        figure: {
          key: "morrow",
          steps: ["4 000 utkast per natt", "Lösare spelar vart och ett", "Elva når morgonen"],
          label:
            "Utkast lämnar en behållare på ett band och passerar en lösargrind; de flesta faller ned i en korg, och hyllan med elva fylls på",
        },
        stats: [
          { value: "4 000", label: "utkast varje natt" },
          { value: "1 av 360", label: "når morgonen" },
          { value: "< 1 öre", label: "för att ta fram en hel dag" },
        ],
      },
      stack: [
        { name: "Modell", items: ["Egen pusselmodell", "Ordsannolikheter från en språkmodell", "Generering varje natt"] },
        {
          name: "Generatorer och lösare",
          items: ["Konstruktörer med backtracking", "Lösare som prövar entydighet", "Bredden-först-bevis", "Validering per spel"],
        },
        {
          name: "Webbapp",
          items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "three.js", "TanStack Query"],
        },
        {
          name: "API",
          items: ["FastAPI", "SQLAlchemy 2, asynkront", "Alembic", "PostgreSQL 17", "Pydantic", "Stripe"],
        },
        { name: "Kvalitet", items: ["Playwright", "Vitest", "pytest", "mypy", "Ruff"] },
        { name: "Drift", items: ["Render"] },
      ],
      cta: { label: "Ställ er i kö", href: "#contact" },
    },
  },
  {
    ...compliance,
    tags: ["Kunduppdrag", "27B-modell", "Privat moln"],
    line: "En första granskare av regelverk, privat i kundens moln. 94 av 100 av dess svar stämmer med granskarens.",
    cardLine: "En första granskare i kundens moln. 94 av 100 stämmer med granskaren.",
    modal: {
      ...compliance.modal,
      label: "Kunduppdrag · Regelverksmodell",
      title: { lead: "En språkmodell för regelefterlevnad,", rest: "privat i kundens moln." },
      overview: {
        body: "Den läser en artikel i ett regelverk och returnerar de risker och kontroller som blir bindande, eller ingenting när texten inte binder. En granskare skriver fortfarande under. Den är byggd för en kund i en reglerad bransch och körs i kundens eget AWS-konto.",
        charts: {
          size: {
            label: "Modellens storlek",
            description: "27 miljarder parametrar, visade som 27 rutor om en miljard vardera",
            billions: 27,
            strong: "27B",
            rest: "parametrar, en ruta per miljard",
          },
          agreement: {
            label: "Test på reserverad data",
            description: "94 av 100 svar på reserverad testdata stämmer med granskarens",
            matched: 94,
            total: 100,
            strong: "94 av 100",
            rest: "svar stämmer med granskarens",
          },
        },
      },
      model: {
        body: "En specialiserad modell med 27 miljarder parametrar, framtagen ur ett arbetsflöde som experter har märkt upp och byggd med övervakad finjustering och förstärkningsinlärning. Syntetiska data täcker de ovanliga etiketterna. Den poängsätts mot en reserverad guldstandard, där experternas etiketter har hållits utanför träningen.",
        figure: {
          key: "slm",
          steps: ["Expertmärkt arbete", "Syntetiska data för ovanliga etiketter", "Finjusterad, sedan förstärkt", "Reserverad guldstandard"],
          label:
            "Expertmärkt arbete och syntetiska data matar modellen; dess lager tänds när den finjusteras; en reserverad guldstandard tänder 94 av 100 rutor, och en slinga går tillbaka för förstärkningsinlärning",
        },
        capabilities: {
          label: "Vad modellen gör",
          items: [
            { text: "Returnerar de risker en artikel i regelverket skapar", value: "94 % lika" },
            { text: "Kopplar varje risk till den kontroll som besvarar den", value: "93 % lika" },
            { text: "Ger utdata som systemet efter kan tolka", value: "100 %" },
            { text: "Täcker ovanliga etiketter med syntetiska data", value: "Syntetiskt" },
            { text: "Returnerar ingenting när texten inte binder", value: "Skyddsräcke" },
            { text: "Lämnar kundens eget AWS-konto", value: "Aldrig" },
            { text: "Skriver under utlåtandet om regelefterlevnad", value: "Aldrig" },
          ],
        },
      },
      stack: [
        {
          name: "Modell",
          items: [
            "Specialiserad 27B-modell",
            "Övervakad finjustering",
            "Förstärkningsinlärning",
            "Syntetiska data",
            "Reserverad guldstandard",
          ],
        },
        {
          name: "AWS",
          items: ["Control Tower", "Organizations", "IAM", "Amazon S3", "SageMaker", "Amazon VPC", "CloudWatch", "Budgets"],
        },
      ],
      cta: { label: "Fråga om en liknande modell", href: "#contact" },
    },
  },
  {
    ...extraction,
    tags: ["Kunduppdrag", "Dubbel RAG", "Alla domäner"],
    line: "Läser ett dokument och returnerar endast det som ett bibliotek av kända kontroller redan innehåller, i standardiserade domäner eller i nya.",
    cardLine: "Returnerar endast det som ett bibliotek av kända kontroller innehåller, i alla domäner.",
    face: {
      ...extraction.face,
      feature: {
        kind: "library",
        sentence: { before: "Användare får ", marked: "åtkomst endast via en begäran", after: " som chefen godkänner." },
        controls: [
          { code: "AC-2", name: "Account management" },
          { code: "AC-6", name: "Least privilege" },
          { code: "AU-6", name: "Audit record review" },
        ],
      },
    },
    modal: {
      ...extraction.modal,
      label: "Kunduppdrag · AI-arkitektur",
      title: { lead: "Extraktion mot ett bibliotek.", rest: "Varje svar är ett ni känner igen." },
      overview: {
        body: "Två sökvägar körs parallellt: den ena läser dokumentet, den andra söker i ett bibliotek av risker och kontroller. Extraktionen är bunden till biblioteket, så varje svar är en kontroll som granskarna redan känner igen, eller ingenting alls.",
        stats: [
          { value: "2 vägar", label: "dokumentet och biblioteket" },
          { value: "Bunden", label: "varje svar hör till biblioteket" },
          { value: "Alla domäner", label: "standardiserade, eller byggda tillsammans med er" },
        ],
      },
      model: {
        body: "Den fungerar i standardiserade domäner, där biblioteket redan finns, och i domäner utan standard, där vi först bygger biblioteket tillsammans med kunden och samma flöde sedan körs på det.",
        figure: {
          key: "extract",
          steps: ["Läser dokumentet", "Söker i biblioteket", "Extraherar, bundet till det", "En granskare skriver under"],
          label:
            "Regelverket läses på den ena vägen och biblioteket av risker och kontroller genomsöks på den andra; båda matar en extraktion, och en granskare skriver under resultatet",
        },
        more: [
          "Vi utformar AI-ramverk och arkitekturer som denna även för andra behov: agentflöden med en människa i loopen, dokumentgranskning och beslutsstöd. Var och en formas efter uppgiften och körs där data redan finns.",
        ],
      },
      stack: [
        // TODO founders: bekräfta stacken för extraktionen (samma som i engelskan).
        { name: "Sökning", items: ["Dubbel RAG", "Extraktion mot ett bibliotek", "Omrankning"] },
        { name: "Bibliotek", items: ["Standardiserade kontrollbibliotek", "Egna bibliotek som byggs tillsammans med kunden"] },
        { name: "Arbetsflöde", items: ["Granskning med en människa i loopen", "Motor för agentflöden"] },
      ],
      cta: { label: "Skicka en kort förfrågan", href: "#contact" },
    },
  },
];

export const workSection: WorkSectionContent = {
  ...en.workSection,
  headline: { lead: "Utvalda arbeten.", rest: "Våra egna, och två vi kan visa." },
  intro: "Två är produkter som vi bygger och driver själva. Två är AI-system som vi har byggt för kunder i reglerade verksamheter.",
  learnMore: "Läs mer",
  ask: {
    ...en.workSection.ask,
    label: "Fler arbeten",
    name: "Fråga om andra arbeten",
    line: "De flesta kunduppdrag omfattas av sekretess. Beskriv problemet så visar vi det som passar.",
    action: { ...en.workSection.ask.action, label: "Skicka en kort förfrågan" },
  },
  modal: {
    ...en.workSection.modal,
    tabs: { overview: "Översikt", model: "Modellen", stack: "Teknik" },
    close: "Stäng",
    previous: "Föregående",
    next: "Nästa",
    write: { ...en.workSection.modal.write, label: "Skriv till Aleksandar" },
  },
};

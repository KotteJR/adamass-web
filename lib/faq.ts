import {
  SITE_ALLABOLAG,
  SITE_AWS_MARKETPLACE,
  SITE_EMAIL,
  SITE_FOUNDED,
  SITE_LOCALITY,
  SITE_NAME,
  SITE_ORG_NUMBER,
  SITE_POSTAL,
  SITE_REGISTERED,
  SITE_STREET,
  SITE_URL,
  people,
} from "./site";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqTitle = "Questions.";
export const faqDescription =
  "Answers about Adamass AB in Malmö: named-lead delivery, modernisation, technical due diligence, GenAI, AWS Marketplace, and how to start.";
export const faqUpdated = "18 September 2026";
export const faqPath = "/faq" as const;

export const faqs = [
  {
    question: "What is Adamass?",
    answer:
      "Adamass AB is a boutique IT consultancy in Malmö, Sweden. Senior people take named ownership of embedded software delivery, modernisation, technical due diligence, and generative AI. One named technical lead stays accountable from the first brief through handover. Searchers who look for an IT-konsult or mjukvarukonsult in Malmö are looking at the same practice.",
  },
  {
    question: "Where is Adamass based, and what is the organisation number?",
    answer: `${SITE_NAME} sits at ${SITE_STREET}, ${SITE_POSTAL} ${SITE_LOCALITY}, Sweden. The Swedish organisation number is ${SITE_ORG_NUMBER}. The company was registered on ${SITE_REGISTERED}. The practice has operated from Malmö since ${SITE_FOUNDED}. The public company record is on Allabolag.`,
  },
  {
    question: "What work do you take on?",
    answer:
      "Four ways in: embedded software delivery inside an existing team, modernisation of ageing applications and data platforms, diligence and strategic advisory before a decision, and GenAI development when a model needs a real product around it. Swedish buyers often describe the diligence work as teknisk due diligence. The same named-lead model applies to each.",
  },
  {
    question: "Is Adamass a staffing company?",
    answer:
      "No. Adamass is not a staffing desk and not a slide factory. People join the client's repositories, tools, and ceremonies, but one named technical lead owns the engagement. The work closes when source, configuration, and operating notes sit with the client.",
  },
  {
    question: "How does an engagement run?",
    answer:
      "Frame, join, deliver, handover. Objectives and success criteria are written first. Work happens in the client's systems with one named owner. Progress and decisions stay visible. Ownership transfers so the assignment does not depend on Adamass staying.",
  },
  {
    question: "What is technical due diligence here?",
    answer:
      "A written verdict on a software asset before an acquisition, investment, or internal decision. The report covers architecture, operations, security, team capability, and delivery risk. It is the judgement the practice would act on, not a slide summary of interviews.",
  },
  {
    question: "What sits on AWS Marketplace, and how does buying work?",
    answer:
      "Three professional services listings: Landing Zone Foundation, Architect as a Service, and Sovereign AI Perimeter. There is no checkout price. You request the service, we agree scope on a call, and we issue a private offer. Billing lands on the cloud account the buyer already has. The seller profile is on AWS Marketplace.",
  },
  {
    question: "Who are the people, and how do I start?",
    answer: `Write to ${SITE_EMAIL} with a short brief. ${people[0].name} is CEO. ${people[1].name} is Partner, GenAI and ML. We reply with availability, then use an intro call to confirm fit, scope, and timing.`,
  },
] as const satisfies readonly FaqItem[];

export const faqLinks = {
  home: SITE_URL,
  faq: `${SITE_URL}${faqPath}`,
  allabolag: SITE_ALLABOLAG,
  marketplace: SITE_AWS_MARKETPLACE,
} as const;

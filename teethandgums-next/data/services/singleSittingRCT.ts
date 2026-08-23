import type { Service } from "./types";
import { commonPrevention } from "./shared";

const singleSittingRCT: Service = {
  slug: "single-sitting-root-canal-treatment",
  title: "Single Sitting Root Canal Treatment",
  image: "/images/services/single-sitting-root-canal.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Complete suitable root canal cases in one planned appointment.",
  description: "Single sitting root canal treatment completes cleaning, shaping, disinfection, and sealing in one visit when the clinical condition is suitable.",
  definition: "It is a root canal procedure in which the major treatment steps are completed during one appointment.",
  causes: [
    "Deep decay affecting the pulp",
    "Pulp inflammation",
    "Dental trauma",
    "Suitable mild to moderate infection",
    "Time-sensitive restorative need",
  ],
  whenRequired: [
    "The tooth is suitable for one-visit care",
    "There is no uncontrolled swelling",
    "Canal anatomy can be managed",
    "Same-day sealing is appropriate",
    "The patient can complete the appointment",
  ],
  benefits: [
    "Fewer clinic visits",
    "Efficient treatment",
    "Early canal sealing",
    "Convenient for suitable patients",
    "Preserves the natural tooth",
  ],
  procedure: [
    "Examination and imaging",
    "Local anesthesia and isolation",
    "Canal access",
    "Cleaning and shaping",
    "Disinfection",
    "Filling and sealing",
    "Temporary or final restoration",
  ],
  precautions: [
    "Avoid hard chewing until restored",
    "Follow medicine instructions",
    "Maintain oral hygiene",
    "Report worsening symptoms",
    "Attend crown or review appointment",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Can every root canal be completed in one sitting?",
      answer: "No. It is suitable only for selected teeth and clinical conditions.",
    },
    {
      question: "Is it safe?",
      answer: "It can be safe and effective after proper diagnosis and isolation.",
    },
    {
      question: "Will I need a crown?",
      answer: "A crown may be recommended, especially for back teeth.",
    },
    {
      question: "What if infection is severe?",
      answer: "Multiple visits may be recommended for drainage, complex anatomy, or persistent symptoms.",
    },
  ],
};

export default singleSittingRCT;

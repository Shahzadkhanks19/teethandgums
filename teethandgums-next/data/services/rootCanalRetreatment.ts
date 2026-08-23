import type { Service } from "./types";
import { commonPrevention } from "./shared";

const rootCanalRetreatment: Service = {
  slug: "root-canal-retreatment",
  title: "Root Canal Retreatment",
  image: "/images/services/root-canal-retreatment.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Treat a previously root canal treated tooth that has not healed properly.",
  description: "Root canal retreatment reopens a previously treated tooth, removes old materials, disinfects the canals again, and reseals the tooth.",
  definition: "It is a repeat endodontic procedure intended to manage persistent disease in a previously treated tooth.",
  causes: [
    "Missed canals",
    "Complex anatomy",
    "Leakage beneath a restoration",
    "New decay",
    "Tooth fracture or reinfection",
  ],
  whenRequired: [
    "Pain in a treated tooth",
    "Swelling or recurrent abscess",
    "Persistent infection on imaging",
    "Failure to heal",
    "New decay exposing the canals",
  ],
  benefits: [
    "May preserve the natural tooth",
    "Removes contaminated material",
    "Controls recurrent infection",
    "Relieves symptoms",
    "May avoid extraction",
  ],
  procedure: [
    "Clinical and radiographic assessment",
    "Removal of existing restoration",
    "Access to previous filling",
    "Removal of old canal material",
    "Cleaning and disinfection",
    "Refilling and sealing",
    "Restoration planning",
  ],
  precautions: [
    "Avoid hard chewing until restored",
    "Maintain oral hygiene",
    "Follow medicine instructions",
    "Attend review imaging",
    "Report new swelling",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Why can a root canal fail?",
      answer: "Failure may occur because of untreated anatomy, leakage, new decay, fracture, or infection.",
    },
    {
      question: "Can retreatment save the tooth?",
      answer: "Many teeth can be preserved, depending on structure, anatomy, and infection.",
    },
    {
      question: "Is retreatment more complex?",
      answer: "It can be because previous materials must be removed and hidden anatomy may need treatment.",
    },
    {
      question: "What if retreatment is unsuitable?",
      answer: "Alternatives may include apical surgery, extraction, or replacement planning.",
    },
  ],
};

export default rootCanalRetreatment;

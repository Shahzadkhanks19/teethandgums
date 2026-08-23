import type { Service } from "./types";
import { commonPrevention } from "./shared";

const fullMouthRehabilitation: Service = {
  slug: "full-mouth-rehabilitation",
  title: "Full Mouth Rehabilitation",
  image: "/images/services/full-mouth-rehabilitation.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Rebuild function and appearance when many teeth are damaged, missing, or worn.",
  description: "Full mouth rehabilitation is a comprehensive, phased plan that may combine restorative, periodontal, endodontic, prosthetic, implant, and bite-related care.",
  definition: "It is coordinated treatment of multiple teeth and supporting structures to restore function, comfort, and appearance.",
  causes: [
    "Severe tooth wear",
    "Multiple missing teeth",
    "Extensive decay",
    "Advanced gum disease",
    "Dental trauma or bite collapse",
  ],
  whenRequired: [
    "Many teeth need treatment",
    "Chewing is significantly affected",
    "Several restorations are failing",
    "Tooth wear has changed facial support",
    "A coordinated plan is needed",
  ],
  benefits: [
    "Comprehensive planning",
    "Restores chewing and bite",
    "Coordinates multiple procedures",
    "Improves appearance and support",
    "Creates a maintenance strategy",
  ],
  procedure: [
    "Detailed assessment",
    "Photographs, scans, and imaging",
    "Gum, tooth, joint, and bite evaluation",
    "Phased planning",
    "Disease control",
    "Restorative or implant treatment",
    "Final evaluation and maintenance",
  ],
  precautions: [
    "Complete disease-control phases",
    "Follow temporary restoration instructions",
    "Maintain excellent hygiene",
    "Use protective appliances if prescribed",
    "Attend long-term maintenance",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Is it the same as smile designing?",
      answer: "No. Full mouth rehabilitation addresses extensive functional, structural, and aesthetic needs.",
    },
    {
      question: "How long does it take?",
      answer: "The timeline depends on procedures, healing, and complexity.",
    },
    {
      question: "Does every tooth need a crown?",
      answer: "No. Treatment is individualized and may combine several approaches.",
    },
    {
      question: "Is it permanent?",
      answer: "Dental treatment requires maintenance and may need repair or replacement over time.",
    },
  ],
};

export default fullMouthRehabilitation;

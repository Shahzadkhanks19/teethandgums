import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalBridge: Service = {
  slug: "dental-bridge",
  title: "Dental Bridge",
  image: "/images/services/dental-bridge.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Replace one or more missing teeth with a fixed dental restoration.",
  description: "A dental bridge replaces missing teeth by supporting an artificial tooth from adjacent teeth or implants.",
  definition: "A dental bridge is a fixed prosthesis that spans a tooth gap using crowns, wings, or implants for support.",
  causes: [
    "Tooth loss from decay",
    "Tooth loss from gum disease",
    "Extraction",
    "Dental trauma",
    "Congenitally missing tooth",
  ],
  whenRequired: [
    "One or more teeth are missing",
    "Supporting teeth are suitable",
    "A fixed replacement is preferred",
    "Chewing or speech is affected",
    "The gap risks tooth movement",
  ],
  benefits: [
    "Fixed replacement",
    "Restores chewing and appearance",
    "Helps maintain tooth position",
    "May avoid surgery",
    "Several designs are available",
  ],
  procedure: [
    "Examination and imaging",
    "Evaluation of supporting teeth",
    "Tooth preparation or implant planning",
    "Scan or impression",
    "Temporary restoration if needed",
    "Final fitting and bite adjustment",
  ],
  precautions: [
    "Clean beneath the bridge",
    "Use floss threaders or interdental aids",
    "Avoid damaging hard-food habits",
    "Attend checkups",
    "Report looseness early",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "How long does a bridge last?",
      answer: "Longevity depends on supporting teeth, hygiene, bite, material, and maintenance.",
    },
    {
      question: "How do I clean under it?",
      answer: "Special floss, interdental brushes, or water flossers may be recommended.",
    },
    {
      question: "Is a bridge better than an implant?",
      answer: "The best option depends on bone, gums, adjacent teeth, health, time, and preference.",
    },
    {
      question: "Can it replace several teeth?",
      answer: "Yes, but design and support must be carefully evaluated.",
    },
  ],
};

export default dentalBridge;

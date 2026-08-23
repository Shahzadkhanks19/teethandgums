import type { Service } from "./types";
import { commonPrevention } from "./shared";

const cosmeticDentistry: Service = {
  slug: "cosmetic-dentistry",
  title: "Cosmetic Dentistry",
  image: "/images/services/cosmetic-dentistry.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Improve tooth color, shape, proportion, and overall smile appearance.",
  description: "Cosmetic dentistry combines selected treatments to improve smile appearance while considering oral health, bite, facial features, and realistic outcomes.",
  definition: "Cosmetic dentistry includes procedures focused on improving tooth color, shape, size, alignment, surface appearance, and smile harmony.",
  causes: [
    "Discolored teeth",
    "Chipped or worn teeth",
    "Uneven tooth shape",
    "Small spaces between teeth",
    "Unbalanced smile appearance",
  ],
  whenRequired: [
    "Aesthetic improvement is desired",
    "Teeth are stained, chipped, worn, or uneven",
    "Minor corrections are needed",
    "Old restorations affect appearance",
    "Oral health is stable",
  ],
  benefits: [
    "Improves smile appearance",
    "Corrects visible imperfections",
    "Customized treatment planning",
    "May improve confidence",
    "Offers conservative and comprehensive options",
  ],
  procedure: [
    "Smile assessment",
    "Discussion of expectations",
    "Photographs or scans",
    "Selection of suitable treatments",
    "Phased treatment",
    "Final evaluation and maintenance",
  ],
  precautions: [
    "Maintain excellent oral hygiene",
    "Avoid habits that chip or stain teeth",
    "Use a night guard if recommended",
    "Attend maintenance visits",
    "Follow restoration care instructions",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Which treatments are included?",
      answer: "Options may include whitening, bonding, veneers, crowns, aligners, gum contouring, and smile design.",
    },
    {
      question: "Is it only about appearance?",
      answer: "The main goal is aesthetic improvement, but treatment must also protect function, tooth structure, gums, and bite.",
    },
    {
      question: "How long do results last?",
      answer: "Longevity varies by procedure, material, habits, oral hygiene, and maintenance.",
    },
    {
      question: "Can all concerns be corrected quickly?",
      answer: "No. Some concerns need staged treatment, orthodontics, gum care, or restorative work.",
    },
  ],
};

export default cosmeticDentistry;

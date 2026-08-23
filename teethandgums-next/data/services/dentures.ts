import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentures: Service = {
  slug: "dentures",
  title: "Complete & Partial Dentures",
  image: "/images/services/dentures.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Replace multiple or all missing teeth with removable dental prostheses.",
  description: "Dentures replace several missing teeth or a full dental arch and are designed to improve appearance, speech, and chewing.",
  definition: "A denture is a removable prosthesis used to replace missing teeth and surrounding tissues.",
  causes: [
    "Multiple missing teeth",
    "Complete tooth loss",
    "Advanced gum disease",
    "Non-restorable teeth",
    "Need for a removable replacement",
  ],
  whenRequired: [
    "Several or all teeth are missing",
    "A removable option is appropriate",
    "Chewing or speech is affected",
    "Implants or bridges are unsuitable",
    "A temporary replacement is needed",
  ],
  benefits: [
    "Replaces multiple teeth",
    "Improves facial support",
    "Supports speech and chewing",
    "Removable for cleaning",
    "Can be implant-retained in selected cases",
  ],
  procedure: [
    "Examination",
    "Assessment of gums and ridges",
    "Impressions or digital records",
    "Bite registration",
    "Try-in",
    "Final delivery",
    "Adjustment visits",
  ],
  precautions: [
    "Clean dentures daily",
    "Remove them at night as advised",
    "Avoid hot water",
    "Clean gums and tongue",
    "Attend adjustment visits",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "How long does adaptation take?",
      answer: "Speech, chewing, and comfort usually improve with practice and adjustments.",
    },
    {
      question: "Should dentures be worn at night?",
      answer: "Many patients are advised to remove them while sleeping.",
    },
    {
      question: "How long do they last?",
      answer: "They may need relining, adjustment, or replacement as tissues change.",
    },
    {
      question: "Can implants stabilize dentures?",
      answer: "Yes, implant-retained options may improve stability in suitable cases.",
    },
  ],
};

export default dentures;

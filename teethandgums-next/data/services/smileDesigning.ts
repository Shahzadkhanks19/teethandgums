import type { Service } from "./types";
import { commonPrevention } from "./shared";

const smileDesigning: Service = {
  slug: "smile-designing",
  title: "Smile Designing",
  image: "/images/services/smile-designing.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Create a personalized plan to improve smile balance and appearance.",
  description: "Smile designing evaluates teeth, gums, lips, facial proportions, tooth color, and alignment to create a customized treatment plan.",
  definition: "Smile designing is a planning process that combines cosmetic, restorative, orthodontic, or gum treatments to improve smile harmony.",
  causes: [
    "Uneven teeth",
    "Discoloration",
    "Chips or wear",
    "Minor gaps",
    "Unbalanced gum display",
  ],
  whenRequired: [
    "Comprehensive smile improvement is desired",
    "Several cosmetic concerns are present",
    "A coordinated treatment sequence is needed",
    "Existing restorations need improvement",
    "A preview or planning process is helpful",
  ],
  benefits: [
    "Personalized planning",
    "Coordinates multiple options",
    "Considers facial proportions",
    "Supports realistic expectations",
    "Can improve confidence",
  ],
  procedure: [
    "Smile consultation",
    "Clinical examination and photographs",
    "Digital scans or impressions",
    "Aesthetic analysis",
    "Treatment preview when appropriate",
    "Phased treatment and finishing",
  ],
  precautions: [
    "Maintain oral health first",
    "Follow procedure-specific care",
    "Avoid damaging habits",
    "Use retainers or night guards if prescribed",
    "Attend maintenance visits",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "What can be included?",
      answer: "Whitening, veneers, bonding, crowns, aligners, gum treatment, and replacement of missing teeth may be included.",
    },
    {
      question: "How long does it take?",
      answer: "The timeline depends on the number and type of procedures.",
    },
    {
      question: "Can I preview my smile?",
      answer: "Digital simulations, photographs, mock-ups, or temporary previews may be available.",
    },
    {
      question: "Are results permanent?",
      answer: "No dental treatment lasts forever; longevity depends on procedures, habits, hygiene, and maintenance.",
    },
  ],
};

export default smileDesigning;

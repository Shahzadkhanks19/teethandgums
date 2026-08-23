import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalBraces: Service = {
  slug: "dental-braces",
  title: "Dental Braces & Orthodontic Treatment",
  image: "/images/services/braces.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Correct crowded, spaced, or misaligned teeth and bite problems.",
  description: "Dental braces gradually move teeth into improved alignment and may address crowding, spacing, bite problems, and smile balance.",
  definition: "Dental braces are fixed orthodontic appliances that guide teeth into planned positions over time.",
  causes: [
    "Crowded teeth",
    "Spacing between teeth",
    "Overbite or underbite",
    "Rotated teeth",
    "Jaw and bite imbalance",
  ],
  whenRequired: [
    "Crowding makes cleaning difficult",
    "Bite problems affect chewing",
    "Spacing affects appearance",
    "Teeth need controlled movement",
    "Orthodontic assessment recommends braces",
  ],
  benefits: [
    "Improves alignment",
    "Improves bite function",
    "Makes teeth easier to clean",
    "Reduces uneven wear",
    "Enhances smile confidence",
  ],
  procedure: [
    "Orthodontic consultation",
    "Photographs, scans, and imaging",
    "Treatment planning",
    "Placement of braces",
    "Periodic adjustments",
    "Removal of braces",
    "Retention",
  ],
  precautions: [
    "Avoid hard and sticky foods",
    "Brush carefully around brackets",
    "Use interdental aids",
    "Attend adjustment visits",
    "Wear retainers as advised",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "How long do braces take?",
      answer: "Treatment time varies and may range from months to a few years.",
    },
    {
      question: "Do braces hurt?",
      answer: "Mild pressure or soreness can occur after placement or adjustments.",
    },
    {
      question: "Can adults get braces?",
      answer: "Yes, adults can receive orthodontic treatment when oral health is suitable.",
    },
    {
      question: "Will I need retainers?",
      answer: "Yes. Retainers help maintain corrected tooth positions.",
    },
  ],
};

export default dentalBraces;

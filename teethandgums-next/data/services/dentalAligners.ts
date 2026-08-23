import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalAligners: Service = {
  slug: "clear-dental-aligners",
  title: "Clear Dental Aligners",
  image: "/images/services/aligners.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Straighten suitable cases using removable, nearly transparent aligners.",
  description: "Clear aligners use a planned series of removable transparent trays to gradually move teeth.",
  definition: "Clear aligners are custom-made removable orthodontic trays designed to move teeth through digitally planned stages.",
  causes: [
    "Mild to moderate crowding",
    "Spacing",
    "Minor bite irregularities",
    "Relapse after orthodontics",
    "Preference for a less visible option",
  ],
  whenRequired: [
    "Clinical assessment confirms suitability",
    "The patient can wear trays as directed",
    "Teeth and gums are healthy",
    "Required movements are predictable",
    "A removable option is preferred",
  ],
  benefits: [
    "Nearly transparent appearance",
    "Removable for eating and cleaning",
    "Fewer food restrictions",
    "Digital planning",
    "Smooth tray design",
  ],
  procedure: [
    "Orthodontic assessment",
    "Digital scan and photographs",
    "Treatment simulation",
    "Fabrication of aligners",
    "Scheduled tray changes",
    "Progress reviews",
    "Retention",
  ],
  precautions: [
    "Wear aligners as prescribed",
    "Remove them while eating",
    "Clean them appropriately",
    "Avoid hot water",
    "Attend progress reviews",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Are aligners suitable for everyone?",
      answer: "No. Suitability depends on tooth movement, bite, oral health, and cooperation.",
    },
    {
      question: "How many hours should they be worn?",
      answer: "They are usually worn for most of the day, following the dentist's instructions.",
    },
    {
      question: "Can I eat with aligners?",
      answer: "They are generally removed for meals and most drinks other than plain water.",
    },
    {
      question: "Are aligners faster than braces?",
      answer: "Not necessarily. Treatment time depends on the case.",
    },
  ],
};

export default dentalAligners;

import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalCrowns: Service = {
  slug: "dental-crowns-caps",
  title: "Dental Crowns & Tooth Caps",
  image: "/images/services/dental-crown.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Protect and restore weakened, broken, or heavily treated teeth.",
  description: "A dental crown covers a prepared tooth to restore strength, shape, function, and appearance.",
  definition: "A dental crown is a custom restoration that covers the visible portion of a prepared tooth.",
  causes: [
    "Large cavity",
    "Cracked tooth",
    "Root canal treated tooth",
    "Severe wear",
    "Need to support a bridge",
  ],
  whenRequired: [
    "Tooth structure is weak",
    "A large filling is failing",
    "A tooth has had root canal treatment",
    "A fracture needs protection",
    "Full coverage is required",
  ],
  benefits: [
    "Protects weakened structure",
    "Restores chewing",
    "Improves shape and appearance",
    "Supports bridges",
    "Available in several materials",
  ],
  procedure: [
    "Assessment",
    "Tooth preparation",
    "Scan or impression",
    "Temporary crown if required",
    "Laboratory fabrication",
    "Final fitting and bite adjustment",
  ],
  precautions: [
    "Avoid sticky foods with a temporary crown",
    "Clean the gumline",
    "Report looseness or sensitivity",
    "Use a night guard if advised",
    "Attend routine reviews",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "How long does a crown last?",
      answer: "Longevity depends on material, bite, tooth condition, habits, hygiene, and maintenance.",
    },
    {
      question: "Is preparation painful?",
      answer: "Local anesthesia is usually used; temporary sensitivity may occur.",
    },
    {
      question: "Which material is best?",
      answer: "Choice depends on location, bite, appearance, structure, and budget.",
    },
    {
      question: "Can a crowned tooth decay?",
      answer: "Yes. Decay can develop at the margin, so cleaning remains essential.",
    },
  ],
};

export default dentalCrowns;

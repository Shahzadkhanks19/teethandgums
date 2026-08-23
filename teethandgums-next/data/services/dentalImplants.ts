import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalImplants: Service = {
  slug: "dental-implants",
  title: "Dental Implants",
  image: "/images/services/dental-implant.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Replace missing teeth with strong, natural-looking fixed teeth.",
  description: "Dental implants replace missing teeth using biocompatible implant posts that support crowns, bridges, or implant-retained dentures.",
  definition: "A dental implant is an artificial tooth root placed in the jawbone to support a replacement tooth or dental prosthesis.",
  causes: [
    "Tooth loss caused by decay",
    "Tooth loss caused by gum disease",
    "Dental trauma or injury",
    "Failed root canal treatment",
    "Loose or uncomfortable dentures",
  ],
  whenRequired: [
    "One or more missing teeth",
    "Difficulty chewing",
    "Visible gaps affecting the smile",
    "Need for a fixed replacement",
    "Adequate bone and gum health after evaluation",
  ],
  benefits: [
    "Natural-looking replacement",
    "Improved chewing and speech",
    "Helps preserve jawbone",
    "Does not require cutting healthy adjacent teeth",
    "Long-term solution with proper care",
  ],
  procedure: [
    "Consultation and medical history review",
    "Clinical examination and imaging",
    "Bone and gum assessment",
    "Implant placement",
    "Healing and integration",
    "Final crown or prosthesis placement",
  ],
  precautions: [
    "Avoid smoking during healing",
    "Do not disturb the surgical site",
    "Eat soft foods as advised",
    "Maintain prescribed oral hygiene",
    "Attend follow-up visits",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Are dental implants permanent?",
      answer: "They are designed as a long-term solution, but lifespan depends on oral hygiene, gum health, bite forces, and maintenance.",
    },
    {
      question: "Is implant surgery painful?",
      answer: "Local anesthesia is used. Mild soreness or swelling may occur afterward.",
    },
    {
      question: "How long does treatment take?",
      answer: "Some cases are completed quickly, while others require several months for healing.",
    },
    {
      question: "Can everyone get implants?",
      answer: "Suitability depends on bone, gums, medical history, smoking, and other clinical factors.",
    },
  ],
};

export default dentalImplants;

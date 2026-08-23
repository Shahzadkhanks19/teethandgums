import type { Service } from "./types";
import { commonPrevention } from "./shared";

const toothExtraction: Service = {
  slug: "painless-tooth-extraction",
  title: "Comfortable Tooth Extraction",
  image: "/images/services/extraction.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Remove a non-restorable tooth using appropriate anesthesia and gentle techniques.",
  description: "Tooth extraction is performed when a tooth cannot be predictably restored or is causing infection, pain, crowding, or other oral health problems.",
  definition: "Tooth extraction is the removal of a tooth from its socket when preserving it is not clinically suitable.",
  causes: [
    "Severe tooth decay",
    "Advanced gum disease",
    "Irreparable fracture",
    "Persistent infection",
    "Orthodontic or prosthetic need",
  ],
  whenRequired: [
    "The tooth cannot be restored",
    "Infection cannot be controlled",
    "The tooth is very loose",
    "A fracture extends below the gum",
    "The tooth interferes with planned treatment",
  ],
  benefits: [
    "Removes a source of pain or infection",
    "Prevents spread of disease in selected cases",
    "Creates space when planned",
    "Allows replacement planning",
    "Improves comfort after healing",
  ],
  procedure: [
    "Examination and X-ray",
    "Discussion of alternatives",
    "Local anesthesia",
    "Gentle removal",
    "Socket cleaning",
    "Bleeding control and instructions",
  ],
  precautions: [
    "Bite on gauze as instructed",
    "Avoid forceful spitting initially",
    "Do not smoke",
    "Eat soft foods",
    "Seek care for uncontrolled bleeding or worsening swelling",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Is extraction painful?",
      answer: "Local anesthesia is used. Pressure may be felt, but sharp pain should not be expected.",
    },
    {
      question: "How long does healing take?",
      answer: "Initial healing occurs over days to weeks, while deeper healing takes longer.",
    },
    {
      question: "Can the missing tooth be replaced?",
      answer: "Options may include an implant, bridge, or denture.",
    },
    {
      question: "What is dry socket?",
      answer: "It is a painful complication that can occur when the protective blood clot is lost.",
    },
  ],
};

export default toothExtraction;

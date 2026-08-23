import type { Service } from "./types";
import { commonPrevention } from "./shared";

const gumDiseaseTreatment: Service = {
  slug: "gum-disease-treatment",
  title: "Gum Disease Treatment",
  image: "/images/services/gum-treatment.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Manage bleeding gums, infection, tartar, and periodontal disease.",
  description: "Gum disease treatment ranges from professional cleaning and oral hygiene improvement to deep cleaning and advanced periodontal care.",
  definition: "Gum disease treatment manages gingivitis and periodontitis by controlling deposits, inflammation, and risk factors.",
  causes: [
    "Plaque and tartar",
    "Smoking or tobacco",
    "Poor oral hygiene",
    "Diabetes and other risk factors",
    "Genetic susceptibility",
  ],
  whenRequired: [
    "Gums bleed",
    "Persistent bad breath",
    "Gums are receding",
    "Teeth feel loose",
    "Pockets or bone loss are detected",
  ],
  benefits: [
    "Reduces inflammation",
    "Controls infection",
    "Helps preserve supporting tissues",
    "Improves cleanliness",
    "Creates a maintenance plan",
  ],
  procedure: [
    "Periodontal examination",
    "Imaging if needed",
    "Professional scaling",
    "Root surface cleaning",
    "Risk-factor management",
    "Maintenance and reassessment",
  ],
  precautions: [
    "Follow customized cleaning instructions",
    "Stop tobacco use",
    "Control diabetes medically",
    "Use mouth rinse only as directed",
    "Attend periodontal maintenance",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Can gum disease be cured?",
      answer: "Gingivitis can often be reversed; periodontitis can usually be controlled.",
    },
    {
      question: "Why do gums bleed?",
      answer: "Bleeding commonly indicates inflammation and should be evaluated.",
    },
    {
      question: "What is deep cleaning?",
      answer: "It usually refers to scaling and root planing below the gumline.",
    },
    {
      question: "Can gum disease cause tooth loss?",
      answer: "Advanced untreated disease can damage supporting bone and tissues.",
    },
  ],
};

export default gumDiseaseTreatment;

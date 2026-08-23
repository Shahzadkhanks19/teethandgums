import type { Service } from "./types";
import { commonPrevention } from "./shared";

const teethWhitening: Service = {
  slug: "teeth-whitening",
  title: "Professional Teeth Whitening",
  image: "/images/services/teeth-whitening.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Lighten suitable tooth discoloration with professionally supervised whitening.",
  description: "Professional teeth whitening uses selected whitening materials to reduce eligible stains while considering sensitivity, restorations, and gum health.",
  definition: "Teeth whitening is a cosmetic treatment that lightens natural tooth color by breaking down stain molecules.",
  causes: [
    "Tea or coffee staining",
    "Tobacco staining",
    "Age-related darkening",
    "Food pigments",
    "Natural color variation",
  ],
  whenRequired: [
    "A brighter smile is desired",
    "Natural teeth are stained",
    "Oral health is stable",
    "Restorations are assessed",
    "The discoloration is suitable for whitening",
  ],
  benefits: [
    "Brighter smile",
    "Professional assessment",
    "Customized strength and method",
    "Can be faster than unsupervised methods",
    "Sensitivity can be monitored",
  ],
  procedure: [
    "Dental examination",
    "Cleaning if required",
    "Shade assessment",
    "Gum protection",
    "Whitening application",
    "Post-treatment instructions",
  ],
  precautions: [
    "Avoid strongly pigmented foods temporarily",
    "Follow sensitivity guidance",
    "Do not overuse products",
    "Maintain oral hygiene",
    "Remember restorations do not whiten",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Is whitening safe?",
      answer: "It is generally safe when performed or supervised by a dental professional.",
    },
    {
      question: "Will it cause sensitivity?",
      answer: "Temporary sensitivity can occur and may be managed by adjusting the method.",
    },
    {
      question: "Do crowns and fillings whiten?",
      answer: "No. Existing restorations usually do not change color.",
    },
    {
      question: "How long do results last?",
      answer: "Results vary based on diet, smoking, hygiene, and maintenance.",
    },
  ],
};

export default teethWhitening;

import type { Service } from "./types";
import { commonPrevention } from "./shared";

const wisdomToothExtraction: Service = {
  slug: "wisdom-tooth-extraction",
  title: "Wisdom Tooth Extraction",
  image: "/images/services/wisdom-tooth.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Treat impacted, infected, painful, or damaging wisdom teeth.",
  description: "Wisdom tooth extraction removes a third molar that is impacted, partially erupted, infected, decayed, or damaging nearby tissues.",
  definition: "Wisdom tooth extraction is the simple or surgical removal of a third molar after examination and imaging.",
  causes: [
    "Impacted wisdom tooth",
    "Repeated gum infection",
    "Decay",
    "Cystic change",
    "Damage to the adjacent tooth",
  ],
  whenRequired: [
    "Repeated pain or swelling",
    "Difficulty cleaning",
    "Damage to a nearby tooth",
    "Infection or decay",
    "Unhealthy eruption position",
  ],
  benefits: [
    "Removes a recurring source of pain",
    "Protects adjacent teeth in selected cases",
    "Improves cleaning access",
    "Treats decay or gum problems",
    "Prevents some complications",
  ],
  procedure: [
    "Examination and panoramic imaging",
    "Discussion of risks",
    "Local anesthesia",
    "Simple or surgical access",
    "Tooth removal",
    "Socket cleaning and suturing if needed",
  ],
  precautions: [
    "Apply cold compress as advised",
    "Follow bleeding-control instructions",
    "Avoid smoking and straws",
    "Eat soft foods",
    "Attend review for severe symptoms",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Does every wisdom tooth need removal?",
      answer: "No. Healthy, functional wisdom teeth may be monitored.",
    },
    {
      question: "Is surgery painful?",
      answer: "Anesthesia is used; temporary swelling and soreness may occur afterward.",
    },
    {
      question: "How long is recovery?",
      answer: "Many patients improve over several days, while complete healing takes longer.",
    },
    {
      question: "What are the risks?",
      answer: "Risks can include dry socket, infection, bleeding, swelling, and nerve-related symptoms.",
    },
  ],
};

export default wisdomToothExtraction;

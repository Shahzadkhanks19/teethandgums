import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalScaling: Service = {
  slug: "dental-scaling-teeth-cleaning",
  title: "Dental Scaling & Teeth Cleaning",
  image: "/images/services/dental-scaling.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Remove plaque, tartar, and surface deposits to support healthy gums.",
  description: "Dental scaling and professional cleaning remove plaque, hardened tartar, and surface deposits that routine brushing cannot fully remove.",
  definition: "Dental scaling is a professional preventive procedure that removes mineralized deposits from tooth surfaces and around the gums.",
  causes: [
    "Plaque accumulation",
    "Hardened tartar",
    "Bleeding gums",
    "Deposit-related bad breath",
    "Irregular professional cleaning",
  ],
  whenRequired: [
    "Visible tartar is present",
    "Gums bleed",
    "Bad breath requires evaluation",
    "A preventive cleaning is due",
    "Gum treatment needs deeper cleaning",
  ],
  benefits: [
    "Removes plaque and tartar",
    "Supports gum health",
    "Improves mouth cleanliness",
    "May reduce bad breath",
    "Helps prevent gum inflammation",
  ],
  procedure: [
    "Oral and gum assessment",
    "Ultrasonic or hand scaling",
    "Cleaning around gum margins",
    "Polishing when appropriate",
    "Oral hygiene guidance",
    "Recall planning",
  ],
  precautions: [
    "Follow brushing and flossing advice",
    "Temporary sensitivity may occur",
    "Avoid tobacco",
    "Use mouth rinse only if advised",
    "Attend periodontal review if recommended",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Does scaling damage enamel?",
      answer: "Professional scaling is designed to remove deposits without damaging healthy enamel.",
    },
    {
      question: "Will teeth become sensitive?",
      answer: "Temporary sensitivity can occur, especially when heavy tartar is removed.",
    },
    {
      question: "How often is it needed?",
      answer: "Frequency depends on buildup, gum health, smoking, medical factors, and home care.",
    },
    {
      question: "Is it the same as whitening?",
      answer: "No. Scaling removes deposits and surface stains; whitening lightens natural tooth color.",
    },
  ],
};

export default dentalScaling;

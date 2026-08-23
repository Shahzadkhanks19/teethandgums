import type { Service } from "./types";
import { commonPrevention } from "./shared";

const pediatricDentistry: Service = {
  slug: "pediatric-dentistry",
  title: "Pediatric Dentistry",
  image: "/images/services/pediatric-dentistry.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Preventive and restorative dental care for children and teenagers.",
  description: "Pediatric dentistry supports healthy dental development through prevention, early diagnosis, cavity treatment, emergency care, and parent education.",
  definition: "Pediatric dentistry is dental care adapted to the developmental, behavioral, and oral health needs of children.",
  causes: [
    "Early childhood cavities",
    "Frequent sugar exposure",
    "Dental trauma",
    "Abnormal tooth eruption",
    "Difficulty cooperating with dental care",
  ],
  whenRequired: [
    "A first dental visit is due",
    "Cavities or pain are present",
    "Dental development needs monitoring",
    "A tooth is injured",
    "Preventive treatment is appropriate",
  ],
  benefits: [
    "Early detection",
    "Age-appropriate prevention",
    "Parent guidance",
    "Supports healthy habits",
    "Monitors growth and eruption",
  ],
  procedure: [
    "Child-friendly assessment",
    "Behavior guidance",
    "Cleaning and prevention",
    "Fluoride or sealants if suitable",
    "Restorative or emergency care",
    "Recall monitoring",
  ],
  precautions: [
    "Supervise brushing",
    "Limit frequent sugary snacks",
    "Use age-appropriate fluoride toothpaste",
    "Protect teeth during sports",
    "Attend preventive visits",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "When should a child first visit?",
      answer: "Around eruption of the first tooth or by the first birthday.",
    },
    {
      question: "Are baby teeth important?",
      answer: "Yes. They support chewing, speech, space maintenance, and development.",
    },
    {
      question: "How can cavities be prevented?",
      answer: "Regular brushing, controlled sugar frequency, water, and routine visits help.",
    },
    {
      question: "What if my child is afraid?",
      answer: "Gradual, positive, age-appropriate visits can help build confidence.",
    },
  ],
};

export default pediatricDentistry;

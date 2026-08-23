import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalVeneers: Service = {
  slug: "dental-veneers",
  title: "Dental Veneers",
  image: "/images/services/veneers.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Improve selected front teeth with thin, natural-looking restorations.",
  description: "Dental veneers are thin custom-made restorations bonded to the front of suitable teeth to improve color, shape, proportion, and minor spacing.",
  definition: "A dental veneer is a thin tooth-colored shell that covers the visible front surface of a tooth.",
  causes: [
    "Persistent discoloration",
    "Chipped front teeth",
    "Uneven tooth shape",
    "Small gaps",
    "Minor surface imperfections",
  ],
  whenRequired: [
    "Conservative cosmetic correction is suitable",
    "Tooth structure and gums are healthy",
    "Whitening cannot correct the concern",
    "Minor shape changes are desired",
    "The bite is suitable",
  ],
  benefits: [
    "Natural-looking appearance",
    "Improves color and shape",
    "Can close selected small gaps",
    "Conservative in suitable cases",
    "Ceramic materials resist stains",
  ],
  procedure: [
    "Cosmetic consultation",
    "Smile and bite assessment",
    "Shade and shape planning",
    "Minimal preparation if required",
    "Digital scan or impression",
    "Fabrication",
    "Bonding and bite adjustment",
  ],
  precautions: [
    "Avoid biting hard objects",
    "Do not use teeth as tools",
    "Maintain oral hygiene",
    "Use a night guard if advised",
    "Attend regular reviews",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Do veneers look natural?",
      answer: "Well-planned veneers are designed to harmonize with surrounding teeth and facial features.",
    },
    {
      question: "Do they require preparation?",
      answer: "Some cases need minimal preparation, while selected cases may need little or none.",
    },
    {
      question: "How long do they last?",
      answer: "Longevity depends on material, bite, habits, oral hygiene, and maintenance.",
    },
    {
      question: "Can they stain?",
      answer: "Ceramic veneers resist staining better than composite veneers.",
    },
  ],
};

export default dentalVeneers;

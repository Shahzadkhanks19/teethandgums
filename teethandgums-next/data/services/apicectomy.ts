import type { Service } from "./types";
import { commonPrevention } from "./shared";

const apicectomy: Service = {
  slug: "apicectomy",
  title: "Apicectomy",
  image: "/images/services/apicectomy.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Remove persistent infection around the tip of a tooth root.",
  description: "Apicectomy is a minor surgical procedure used when disease persists around a root tip after root canal treatment.",
  definition: "An apicectomy removes the root tip and nearby diseased tissue and seals the root end.",
  causes: [
    "Persistent infection after root canal",
    "Root-end lesion",
    "Complex canal anatomy",
    "Blocked canal",
    "Failure of retreatment",
  ],
  whenRequired: [
    "Infection remains near the root tip",
    "Retreatment is impractical",
    "A root-end lesion is present",
    "The tooth is restorable",
    "Surgical endodontic care is recommended",
  ],
  benefits: [
    "Targets persistent infection",
    "May preserve the tooth",
    "Useful when retreatment is difficult",
    "Removes diseased tissue directly",
    "May avoid extraction",
  ],
  procedure: [
    "Examination and imaging",
    "Local anesthesia",
    "Small gum incision",
    "Removal of infected tissue and root tip",
    "Root-end sealing",
    "Suturing and review",
  ],
  precautions: [
    "Apply cold compress as advised",
    "Avoid disturbing the area",
    "Eat soft foods",
    "Take medicines as prescribed",
    "Attend follow-up visits",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Is apicectomy painful?",
      answer: "It is performed under local anesthesia. Temporary soreness or swelling may occur.",
    },
    {
      question: "Why is it needed after root canal treatment?",
      answer: "It may be recommended when infection persists around the root tip.",
    },
    {
      question: "Can it save a tooth?",
      answer: "It is often performed to preserve a tooth that might otherwise need extraction.",
    },
    {
      question: "How long does healing take?",
      answer: "Soft tissue healing begins within days, while bone healing takes longer.",
    },
  ],
};

export default apicectomy;

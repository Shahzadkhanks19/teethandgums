import type { Service } from "./types";
import { commonPrevention } from "./shared";

const rootCanal: Service = {
  slug: "root-canal-treatment",
  title: "Root Canal Treatment",
  image: "/images/services/root-canal.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Save an infected or damaged natural tooth and relieve dental pain.",
  description: "Root canal treatment removes infected or inflamed tissue, cleans and disinfects the root canals, and seals the tooth to preserve function.",
  definition: "Root canal treatment is an endodontic procedure used to treat infection or inflammation inside a tooth.",
  causes: [
    "Deep tooth decay",
    "Cracked or fractured tooth",
    "Repeated dental procedures",
    "Dental trauma",
    "Leakage beneath an old filling or crown",
  ],
  whenRequired: [
    "Persistent tooth pain",
    "Lingering sensitivity",
    "Swelling or abscess",
    "Pain while chewing",
    "Pulp infection on examination or imaging",
  ],
  benefits: [
    "Relieves infection-related pain",
    "Preserves the natural tooth",
    "Restores chewing function",
    "Prevents spread of infection",
    "Reduces need for extraction",
  ],
  procedure: [
    "Clinical examination and X-ray",
    "Local anesthesia",
    "Isolation of the tooth",
    "Removal of infected pulp",
    "Cleaning and shaping canals",
    "Filling and sealing",
    "Final restoration or crown",
  ],
  precautions: [
    "Avoid hard chewing until restored",
    "Maintain oral hygiene",
    "Take medication only if prescribed",
    "Report swelling or severe pain",
    "Complete the final restoration",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Is root canal treatment painful?",
      answer: "It is usually performed under local anesthesia and aims to relieve pain caused by infection.",
    },
    {
      question: "How many visits are needed?",
      answer: "Many cases need one or two visits, though complex infections may require more.",
    },
    {
      question: "Is a crown needed afterward?",
      answer: "A crown is often recommended for back teeth or weakened teeth.",
    },
    {
      question: "Can infection return?",
      answer: "Reinfection can occur because of leakage, new decay, fracture, or complex anatomy.",
    },
  ],
};

export default rootCanal;

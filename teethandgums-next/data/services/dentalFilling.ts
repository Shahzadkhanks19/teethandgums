import type { Service } from "./types";
import { commonPrevention } from "./shared";

const dentalFilling: Service = {
  slug: "dental-filling",
  title: "Dental Filling Treatment",
  image: "/images/services/dental-filling.webp",
  ogImage: "/images/og/services.jpeg",
  shortDesc: "Repair cavities or minor tooth damage with restorative material.",
  description: "Dental filling treatment removes decayed or damaged tooth structure and restores the area using a suitable material.",
  definition: "A dental filling is a restorative material placed into a prepared cavity to replace damaged tooth structure.",
  causes: [
    "Dental cavities",
    "Small fractures",
    "Worn surfaces",
    "Broken old fillings",
    "Minor structural damage",
  ],
  whenRequired: [
    "A cavity is detected",
    "Food lodges in a damaged area",
    "A small chip needs repair",
    "An old filling has failed",
    "Sensitivity is linked to a defect",
  ],
  benefits: [
    "Stops progression after decay removal",
    "Restores tooth shape",
    "Tooth-colored options are available",
    "Conservative for small defects",
    "Protects deeper tissues",
  ],
  procedure: [
    "Examination",
    "X-ray when required",
    "Local anesthesia if needed",
    "Removal of decay",
    "Tooth preparation and bonding",
    "Placement and shaping",
    "Bite adjustment",
  ],
  precautions: [
    "Avoid chewing until numbness wears off",
    "Follow sensitivity guidance",
    "Avoid hard objects",
    "Maintain oral hygiene",
    "Return if the bite feels high",
  ],
  prevention: commonPrevention,
  faqs: [
    {
      question: "Do fillings hurt?",
      answer: "Small fillings may cause little discomfort; local anesthesia is used when needed.",
    },
    {
      question: "How long do tooth-colored fillings last?",
      answer: "Longevity depends on size, location, bite forces, habits, and hygiene.",
    },
    {
      question: "Can a large cavity be filled?",
      answer: "Very large defects may need an inlay, crown, root canal, or other treatment.",
    },
    {
      question: "Why is there sensitivity afterward?",
      answer: "Temporary sensitivity can occur; persistent or worsening pain should be reviewed.",
    },
  ],
};

export default dentalFilling;

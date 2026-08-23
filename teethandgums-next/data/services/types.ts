export type ServiceFaq = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  image: string;
  ogImage?: string;
  shortDesc: string;
  description: string;
  definition: string;
  causes: string[];
  whenRequired: string[];
  benefits: string[];
  procedure: string[];
  precautions: string[];
  prevention: string[];
  faqs: ServiceFaq[];
};

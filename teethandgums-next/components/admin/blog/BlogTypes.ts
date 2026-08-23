export type BlogStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "archived";

export type BlogCategoryOption = {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  isActive?: boolean;
};

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogEditorValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageAlt: string;
  ogImage: string;
  authorName: string;
  authorRole: string;
  status: BlogStatus;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  faqs: BlogFaqItem[];
  scheduledAt: string;
};

export type BlogApiRecord = Omit<
  BlogEditorValues,
  "category"
> & {
  _id: string;
  readingTime: number;
  views: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: BlogCategoryOption | string | null;
};

export type BlogEditorErrors = Partial<
  Record<
    | "title"
    | "slug"
    | "excerpt"
    | "content"
    | "featuredImage"
    | "featuredImageAlt"
    | "metaTitle"
    | "metaDescription"
    | "scheduledAt"
    | "general",
    string
  >
>;

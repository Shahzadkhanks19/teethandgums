import type {
  BlogEditorErrors,
  BlogEditorValues,
} from "./BlogTypes";

export const DEFAULT_BLOG_IMAGE = "/images/logo/logo.webp";

export const initialBlogEditorValues: BlogEditorValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "<p></p>",
  category: "",
  tags: [],
  featuredImage: DEFAULT_BLOG_IMAGE,
  featuredImageAlt: "Teeth and Gums Care dental article",
  ogImage: "",
  authorName: "Teeth and Gums Care",
  authorRole: "Dental Care Team",
  status: "draft",
  isFeatured: false,
  isPinned: false,
  allowComments: false,
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  canonicalUrl: "",
  robotsIndex: true,
  robotsFollow: true,
  faqs: [],
  scheduledAt: "",
};

export function createEditorSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function stripEditorHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function getEditorWordCount(value: string): number {
  const text = stripEditorHtml(value);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

export function getEditorReadingTime(value: string): number {
  return Math.max(1, Math.ceil(getEditorWordCount(value) / 220));
}

export function validateBlogEditor(
  values: BlogEditorValues,
): BlogEditorErrors {
  const errors: BlogEditorErrors = {};
  const contentText = stripEditorHtml(values.content);

  if (values.title.trim().length < 5) {
    errors.title = "Title must contain at least 5 characters.";
  } else if (values.title.trim().length > 180) {
    errors.title = "Title cannot exceed 180 characters.";
  }

  if (!values.slug.trim()) {
    errors.slug = "A valid slug is required.";
  }

  if (values.excerpt.trim().length < 20) {
    errors.excerpt = "Excerpt must contain at least 20 characters.";
  } else if (values.excerpt.trim().length > 500) {
    errors.excerpt = "Excerpt cannot exceed 500 characters.";
  }

  if (contentText.length < 50) {
    errors.content =
      "Article content must contain at least 50 readable characters.";
  }

  if (!values.featuredImage.trim()) {
    errors.featuredImage = "A featured image is required.";
  }

  if (!values.featuredImageAlt.trim()) {
    errors.featuredImageAlt =
      "Featured image alternative text is required.";
  }

  if (values.metaTitle.length > 70) {
    errors.metaTitle = "Meta title cannot exceed 70 characters.";
  }

  if (values.metaDescription.length > 180) {
    errors.metaDescription =
      "Meta description cannot exceed 180 characters.";
  }

  if (values.status === "scheduled") {
    const scheduledTime = new Date(values.scheduledAt).getTime();

    if (
      !values.scheduledAt ||
      Number.isNaN(scheduledTime) ||
      scheduledTime <= Date.now()
    ) {
      errors.scheduledAt =
        "Choose a future date and time for scheduled publishing.";
    }
  }

  return errors;
}

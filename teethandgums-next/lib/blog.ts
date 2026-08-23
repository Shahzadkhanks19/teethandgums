const DEFAULT_READING_WORDS_PER_MINUTE = 220;

export function createBlogSlug(value: string): string {
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

export function normalizeBlogTags(value: unknown): string[] {
  const input = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return Array.from(
    new Set(
      input
        .map((tag) => String(tag).trim().toLowerCase())
        .filter(Boolean)
        .map((tag) => tag.slice(0, 60)),
    ),
  ).slice(0, 20);
}

export function stripBlogHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateBlogReadingTime(content: string): number {
  const wordCount = stripBlogHtml(content)
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(wordCount / DEFAULT_READING_WORDS_PER_MINUTE),
  );
}

export function parseOptionalDate(value: unknown): Date | null {
  if (!value) return null;

  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function escapeBlogSearch(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

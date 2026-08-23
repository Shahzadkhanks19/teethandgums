import "server-only";

import xss, { getDefaultWhiteList } from "xss";

export type BlogTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function slugifyHeading(value: string) {
  return stripTags(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function prepareBlogContent(content: string): {
  html: string;
  toc: BlogTocItem[];
} {
  const toc: BlogTocItem[] = [];
  const usedIds = new Map<string, number>();

  const withHeadingIds = content.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, levelValue: string, rawAttributes: string, innerHtml: string) => {
      const level = Number(levelValue) as 2 | 3;
      const text = stripTags(innerHtml);
      if (!text) return _match;

      const existingId = rawAttributes.match(/\sid=["']([^"']+)["']/i)?.[1];
      const baseId = existingId || slugifyHeading(text) || `section-${toc.length + 1}`;
      const seen = usedIds.get(baseId) || 0;
      usedIds.set(baseId, seen + 1);
      const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;
      const attributesWithoutId = rawAttributes.replace(/\sid=["'][^"']+["']/gi, "");

      toc.push({ id, text, level });
      return `<h${level}${attributesWithoutId} id="${id}" class="blog-anchor-heading">${innerHtml}</h${level}>`;
    },
  );

  const html = xss(withHeadingIds, {
    whiteList: {
      ...getDefaultWhiteList(),
      h1: ["id", "class"],
      h2: ["id", "class"],
      h3: ["id", "class"],
      h4: ["id", "class"],
      h5: ["id", "class"],
      h6: ["id", "class"],
      a: ["href", "title", "target", "rel", "class"],
      img: ["src", "alt", "title", "width", "height", "loading", "class"],
      iframe: [
        "src",
        "title",
        "width",
        "height",
        "allow",
        "allowfullscreen",
        "loading",
        "class",
      ],
      table: ["class"],
      thead: ["class"],
      tbody: ["class"],
      tr: ["class"],
      th: ["colspan", "rowspan", "class"],
      td: ["colspan", "rowspan", "class"],
      p: ["class", "style"],
      span: ["class", "style"],
      div: ["class"],
      pre: ["class"],
      code: ["class"],
      ul: ["class", "data-type"],
      ol: ["class", "data-type"],
      li: ["class", "data-type", "data-checked"],
    },
    onTagAttr(tag, name, value) {
      if (tag === "iframe" && name === "src") {
        const allowed = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\//i.test(value);
        return allowed ? `src="${value}"` : "";
      }
      if (tag === "a" && name === "target" && value === "_blank") {
        return 'target="_blank" rel="noopener noreferrer"';
      }
      return undefined;
    },
  });

  return { html, toc };
}

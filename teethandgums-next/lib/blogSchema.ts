import type { PublicBlogDetail } from "@/lib/publicBlog";
import {
  absoluteBlogUrl,
  blogClinicId,
  blogOrganizationId,
  blogWebsiteId,
} from "@/lib/blogSeo";
import { clinicName, siteUrl } from "@/lib/seo";

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function blogArticleSchema(blog: PublicBlogDetail) {
  const articleUrl = absoluteBlogUrl(blog.canonicalUrl || `/blog/${blog.slug}`);
  const imageUrl = absoluteBlogUrl(blog.ogImage || blog.featuredImage);
  const published = blog.publishedAt || blog.createdAt;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: blog.title,
    alternativeHeadline: blog.metaTitle || undefined,
    description: blog.metaDescription || blog.excerpt,
    articleBody: stripHtml(blog.content),
    url: articleUrl,
    datePublished: published,
    dateModified: blog.updatedAt,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    wordCount: stripHtml(blog.content).split(/\s+/).filter(Boolean).length,
    timeRequired: `PT${Math.max(1, blog.readingTime)}M`,
    articleSection: blog.category?.name || "Dental Health",
    keywords: Array.from(new Set([...blog.keywords, ...blog.tags])).join(", "),
    image: {
      "@type": "ImageObject",
      "@id": `${articleUrl}#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
      width: 1200,
      height: 630,
      caption: blog.featuredImageAlt || blog.title,
    },
    author: {
      "@type": "Person",
      "@id": `${articleUrl}#author`,
      name: blog.authorName,
      jobTitle: blog.authorRole,
      url: articleUrl,
      worksFor: { "@id": blogOrganizationId },
    },
    publisher: {
      "@id": blogOrganizationId,
    },
    about: {
      "@type": "MedicalSpecialty",
      name: "Dentistry",
    },
    mentions: blog.tags.map((tag) => ({ "@type": "Thing", name: tag })),
  };
}

export function blogBreadcrumbSchema(blog: PublicBlogDetail) {
  const articleUrl = absoluteBlogUrl(blog.canonicalUrl || `/blog/${blog.slug}`);
  const items = [
    { name: "Home", url: siteUrl },
    { name: "Dental Blog", url: `${siteUrl}/blog` },
    ...(blog.category
      ? [{ name: blog.category.name, url: `${siteUrl}/blog/category/${blog.category.slug}` }]
      : []),
    { name: blog.title, url: articleUrl },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${articleUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function blogFaqSchema(blog: PublicBlogDetail) {
  if (blog.faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteBlogUrl(blog.canonicalUrl || `/blog/${blog.slug}`)}#faq`,
    mainEntity: blog.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(faq.answer),
      },
    })),
  };
}

export function blogPageSchema(blog: PublicBlogDetail) {
  const articleUrl = absoluteBlogUrl(blog.canonicalUrl || `/blog/${blog.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": articleUrl,
    url: articleUrl,
    name: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    isPartOf: { "@id": blogWebsiteId },
    about: { "@id": blogClinicId },
    primaryImageOfPage: { "@id": `${articleUrl}#primaryimage` },
    breadcrumb: { "@id": `${articleUrl}#breadcrumb` },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "ReadAction",
      target: [articleUrl],
    },
  };
}

export function blogOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": blogOrganizationId,
    name: clinicName,
    alternateName: "Teeth & Gums Care",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/logo/logo.webp`,
    },
  };
}

export function blogWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": blogWebsiteId,
    name: clinicName,
    url: siteUrl,
    inLanguage: "en-IN",
    publisher: { "@id": blogOrganizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBlogSchemas(blog: PublicBlogDetail) {
  return [
    blogArticleSchema(blog),
    blogPageSchema(blog),
    blogBreadcrumbSchema(blog),
    blogFaqSchema(blog),
    blogOrganizationSchema(),
    blogWebsiteSchema(),
  ].filter(Boolean) as Record<string, unknown>[];
}

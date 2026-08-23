import type { Metadata } from "next";

import type { PublicBlogDetail } from "@/lib/publicBlog";
import { clinicName, defaultOgImage, siteUrl } from "@/lib/seo";

export const blogOrganizationId = `${siteUrl}/#organization`;
export const blogWebsiteId = `${siteUrl}/#website`;
export const blogClinicId = `${siteUrl}/#clinic`;

export function absoluteBlogUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  if (value === "/") return siteUrl;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function createBlogArticleMetadata(blog: PublicBlogDetail): Metadata {
  const title = truncate(blog.metaTitle || blog.title, 70);
  const description = truncate(blog.metaDescription || blog.excerpt, 180);
  const canonical = absoluteBlogUrl(blog.canonicalUrl || `/blog/${blog.slug}`);
  const image = absoluteBlogUrl(blog.ogImage || blog.featuredImage || defaultOgImage);
  const publishedTime = blog.publishedAt || blog.createdAt;
  const keywords = unique([
    ...blog.keywords,
    ...blog.tags,
    blog.category?.name || "",
    "Dental care",
    "Dentist in Jodhpur",
    clinicName,
  ]);

  return {
    title,
    description,
    keywords,
    authors: [{ name: blog.authorName, url: canonical }],
    creator: blog.authorName,
    publisher: clinicName,
    category: blog.category?.name || "Dental Health",
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": canonical,
      },
    },
    robots: {
      index: blog.robotsIndex,
      follow: blog.robotsFollow,
      nocache: false,
      googleBot: {
        index: blog.robotsIndex,
        follow: blog.robotsFollow,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: clinicName,
      locale: "en_IN",
      title,
      description,
      publishedTime,
      modifiedTime: blog.updatedAt,
      authors: [blog.authorName],
      section: blog.category?.name || "Dental Health",
      tags: blog.tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.featuredImageAlt || blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: blog.featuredImageAlt || blog.title }],
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": blog.updatedAt,
      "article:author": blog.authorName,
      "article:section": blog.category?.name || "Dental Health",
    },
  };
}

export function createBlogListingMetadata({
  title,
  description,
  canonical,
  image = defaultOgImage,
  noIndex = false,
}: {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl = absoluteBlogUrl(canonical);
  const imageUrl = absoluteBlogUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-IN": canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: clinicName,
      locale: "en_IN",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}

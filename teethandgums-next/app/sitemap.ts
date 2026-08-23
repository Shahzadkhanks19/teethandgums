import type { MetadataRoute } from "next";

import { servicesData } from "@/data/services";
import { getAllPublicBlogSitemapEntries } from "@/lib/publicBlog";

const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL || "https://www.shahazadtestsite.co.in"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const publicRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/book-appointment`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = servicesData.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  try {
    const discovery = await getAllPublicBlogSitemapEntries();
    const blogRoutes: MetadataRoute.Sitemap = discovery.blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "monthly",
      priority: 0.75,
    }));
    const categoryRoutes: MetadataRoute.Sitemap = discovery.categories.map((category) => ({
      url: `${siteUrl}/blog/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.65,
    }));
    const tagRoutes: MetadataRoute.Sitemap = discovery.tags.map((tag) => ({
      url: `${siteUrl}/blog/tag/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.55,
    }));

    return [...publicRoutes, ...serviceRoutes, ...blogRoutes, ...categoryRoutes, ...tagRoutes];
  } catch (error) {
    console.error("Blog sitemap generation failed:", error);
    return [...publicRoutes, ...serviceRoutes];
  }
}

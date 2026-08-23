import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL || "https://www.shahazadtestsite.co.in"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog/", "/rss.xml"],
        disallow: ["/admin/", "/api/", "/blog/search"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

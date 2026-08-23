import { getPublicBlogs } from "@/lib/publicBlog";

export const runtime = "nodejs";
export const revalidate = 3600;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  })[character] || character);
}

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_CLIENT_URL || "https://www.shahazadtestsite.co.in").replace(/\/$/, "");
  const { blogs } = await getPublicBlogs({ limit: 24 });

  const items = blogs.map((blog) => `
    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${siteUrl}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${blog.slug}</guid>
      <description>${escapeXml(blog.excerpt)}</description>
      <pubDate>${new Date(blog.publishedAt || blog.createdAt).toUTCString()}</pubDate>
      <author>${escapeXml(blog.authorName)}</author>
      ${blog.category ? `<category>${escapeXml(blog.category.name)}</category>` : ""}
      ${blog.featuredImage ? `<enclosure url="${escapeXml(new URL(blog.featuredImage, siteUrl).toString())}" type="image/webp" />` : ""}
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Teeth and Gums Care Dental Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Patient-friendly dental treatment guides and oral-health information.</description>
    <language>en-IN</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

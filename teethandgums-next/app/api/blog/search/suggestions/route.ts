import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().slice(0, 80) || "";
  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] }, { headers: { "Cache-Control": "private, max-age=30" } });
  }

  await connectDB();
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "i");
  const now = new Date();

  const blogs = await Blog.find({
    robotsIndex: true,
    $and: [
      { $or: [{ status: "published" }, { status: "scheduled", scheduledAt: { $lte: now } }] },
      { $or: [{ title: pattern }, { excerpt: pattern }, { tags: pattern }] },
    ],
  })
    .select("title slug excerpt")
    .sort({ isPinned: -1, views: -1, publishedAt: -1 })
    .limit(6)
    .lean()
    .exec();

  return NextResponse.json(
    {
      suggestions: blogs.map((blog) => ({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
      })),
    },
    { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" } },
  );
}

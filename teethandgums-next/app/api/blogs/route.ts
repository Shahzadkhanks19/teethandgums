import type { FilterQuery } from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { escapeBlogSearch } from "@/lib/blog";
import connectDB from "@/lib/db";
import Blog, { type BlogRecord } from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 30;

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search")?.trim() || "";
    const category = req.nextUrl.searchParams.get("category")?.trim() || "";
    const tag = req.nextUrl.searchParams.get("tag")?.trim().toLowerCase() || "";
    const featured = req.nextUrl.searchParams.get("featured") === "true";
    const page = Math.max(
      1,
      Number.parseInt(req.nextUrl.searchParams.get("page") || "1", 10) || 1,
    );
    const requestedLimit =
      Number.parseInt(
        req.nextUrl.searchParams.get("limit") || String(DEFAULT_LIMIT),
        10,
      ) || DEFAULT_LIMIT;
    const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);
    const now = new Date();

    const filter: FilterQuery<BlogRecord> = {
      $or: [
        { status: "published" },
        {
          status: "scheduled",
          scheduledAt: { $lte: now },
        },
      ],
      robotsIndex: true,
    };

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (featured) {
      filter.isFeatured = true;
    }

    if (search) {
      const safeSearch = new RegExp(escapeBlogSearch(search), "i");
      filter.$and = [
        {
          $or: [
            { title: safeSearch },
            { excerpt: safeSearch },
            { tags: safeSearch },
          ],
        },
      ];
    }

    await connectDB();

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select({
          content: 0,
          faqs: 0,
          createdBy: 0,
          updatedBy: 0,
        })
        .populate({
          path: "category",
          match: { isActive: true },
          select: "name slug color",
        })
        .sort({
          isPinned: -1,
          isFeatured: -1,
          publishedAt: -1,
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Get Public Blogs Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

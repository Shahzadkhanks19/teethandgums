import type { FilterQuery } from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { verifyAdminRequest } from "@/lib/auth";
import { escapeBlogSearch } from "@/lib/blog";
import { prepareBlogPayload } from "@/lib/blogPayload";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Blog, { type BlogRecord } from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminRequest(req);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const search = req.nextUrl.searchParams.get("search")?.trim() || "";
    const status = req.nextUrl.searchParams.get("status")?.trim() || "all";
    const category = req.nextUrl.searchParams.get("category")?.trim() || "";
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

    const filter: FilterQuery<BlogRecord> = {};

    if (["draft", "published", "scheduled", "archived"].includes(status)) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      const safeSearch = new RegExp(escapeBlogSearch(search), "i");
      filter.$or = [
        { title: safeSearch },
        { excerpt: safeSearch },
        { slug: safeSearch },
        { tags: safeSearch },
        { authorName: safeSearch },
      ];
    }

    await connectDB();

    const [blogs, total, statusCounts] = await Promise.all([
      Blog.find(filter)
        .populate("category", "name slug color")
        .sort({ isPinned: -1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      Blog.countDocuments(filter),
      Blog.aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const counts = {
      total: 0,
      draft: 0,
      published: 0,
      scheduled: 0,
      archived: 0,
    };

    statusCounts.forEach((item) => {
      if (item._id in counts) {
        counts[item._id as keyof typeof counts] = item.count;
      }
      counts.total += item.count;
    });

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
        counts,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Get Admin Blogs Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminRequest(req);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!verifyCsrfToken(req)) {
      return NextResponse.json(
        { success: false, message: "Invalid CSRF token" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const prepared = await prepareBlogPayload(body, {
      adminId: admin.id,
    });

    if (!prepared.success) {
      return NextResponse.json(
        { success: false, message: prepared.message },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const blog = await Blog.create(prepared.data);
    await blog.populate("category", "name slug color");

    await logActivity(
      "Blog Created",
      `Title: ${blog.title}, Status: ${blog.status}`,
      "blog",
    );

    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog,
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Create Blog Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create blog" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

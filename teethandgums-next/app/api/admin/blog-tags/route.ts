import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { normalizeBlogTags } from "@/lib/blog";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Blog from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminRequest(req);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const tags = await Blog.aggregate<{
      name: string;
      usageCount: number;
    }>([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          usageCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          usageCount: 1,
        },
      },
      { $sort: { usageCount: -1, name: 1 } },
    ]);

    return NextResponse.json(
      { success: true, tags },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Get Blog Tags Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blog tags" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function PATCH(req: NextRequest) {
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
      | {
          source?: unknown;
          target?: unknown;
        }
      | null;

    const source = normalizeBlogTags([body?.source])[0];
    const target = normalizeBlogTags([body?.target])[0];

    if (!source || !target) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid source and target tag.",
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (source === target) {
      return NextResponse.json(
        {
          success: false,
          message: "Source and target tags must be different.",
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const blogs = await Blog.find({ tags: source })
      .select({ tags: 1 })
      .exec();

    await Promise.all(
      blogs.map(async (blog) => {
        blog.tags = normalizeBlogTags([
          ...blog.tags.filter((tag) => tag !== source),
          target,
        ]);

        await blog.save();
      }),
    );

    await logActivity(
      "Blog Tags Merged",
      `${source} merged into ${target} across ${blogs.length} blog(s)`,
      "blog",
    );

    return NextResponse.json(
      {
        success: true,
        message: `${source} merged into ${target}`,
        modifiedCount: blogs.length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Merge Blog Tags Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to merge tags" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function DELETE(req: NextRequest) {
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
      | { tag?: unknown }
      | null;

    const tag = normalizeBlogTags([body?.tag])[0];

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Enter a valid tag." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const result = await Blog.updateMany(
      { tags: tag },
      { $pull: { tags: tag } },
    );

    await logActivity(
      "Blog Tag Removed",
      `${tag} removed from ${result.modifiedCount} blog(s)`,
      "blog",
    );

    return NextResponse.json(
      {
        success: true,
        message: `${tag} removed`,
        modifiedCount: result.modifiedCount,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Delete Blog Tag Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to remove tag" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

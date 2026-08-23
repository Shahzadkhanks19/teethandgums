import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  },
) {
  try {
    const { slug } = await params;
    const now = new Date();

    await connectDB();

    const blog = await Blog.findOne({
      slug,
      robotsIndex: true,
      $or: [
        { status: "published" },
        {
          status: "scheduled",
          scheduledAt: { $lte: now },
        },
      ],
    })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name slug color",
      })
      .select({
        createdBy: 0,
        updatedBy: 0,
      })
      .lean()
      .exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      { success: true, blog },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=120, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("Get Public Blog Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blog" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

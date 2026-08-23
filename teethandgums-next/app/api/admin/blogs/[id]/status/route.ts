import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { verifyAdminRequest } from "@/lib/auth";
import { parseOptionalDate } from "@/lib/blog";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Blog, { type BlogStatus } from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses: BlogStatus[] = [
  "draft",
  "published",
  "scheduled",
  "archived",
];

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
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

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog id" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { status?: unknown; scheduledAt?: unknown }
      | null;

    const status = String(body?.status || "") as BlogStatus;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog status" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const update: Record<string, unknown> = {
      status,
      updatedBy: admin.id,
    };

    if (status === "published") {
      update.publishedAt = new Date();
      update.scheduledAt = null;
    } else if (status === "scheduled") {
      const scheduledAt = parseOptionalDate(body?.scheduledAt);

      if (!scheduledAt || scheduledAt.getTime() <= Date.now()) {
        return NextResponse.json(
          {
            success: false,
            message: "Select a future date and time for scheduled publishing.",
          },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }

      update.scheduledAt = scheduledAt;
      update.publishedAt = null;
    } else {
      update.scheduledAt = null;
    }

    await connectDB();

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    )
      .populate("category", "name slug color")
      .exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    await logActivity(
      "Blog Status Updated",
      `Title: ${blog.title}, Status: ${blog.status}`,
      "blog",
    );

    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(
      {
        success: true,
        message: `Blog moved to ${status}`,
        blog,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Update Blog Status Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update blog status" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

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
          ids?: unknown;
          status?: unknown;
          scheduledAt?: unknown;
        }
      | null;

    const ids = Array.isArray(body?.ids)
      ? Array.from(
          new Set(
            body.ids
              .map((id) => String(id))
              .filter((id) => mongoose.isValidObjectId(id)),
          ),
        ).slice(0, 200)
      : [];

    const status = String(body?.status || "") as BlogStatus;

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Select at least one valid blog." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog status." },
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
            message: "Select a future date for scheduled publishing.",
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

    const blogs = await Blog.find({
      _id: { $in: ids },
    })
      .select({ title: 1, slug: 1 })
      .lean()
      .exec();

    const result = await Blog.updateMany(
      { _id: { $in: ids } },
      { $set: update },
      { runValidators: true },
    );

    await logActivity(
      "Blogs Bulk Status Updated",
      `${result.modifiedCount} blog(s) moved to ${status}`,
      "blog",
    );

    revalidatePath("/blog");
    blogs.forEach((blog) =>
      revalidatePath(`/blog/${blog.slug}`),
    );

    return NextResponse.json(
      {
        success: true,
        message: `${result.modifiedCount} blog(s) moved to ${status}`,
        modifiedCount: result.modifiedCount,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Bulk Blog Status Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update selected blogs",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Blog from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      | { ids?: unknown }
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

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Select at least one valid blog." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const blogs = await Blog.find({ _id: { $in: ids } })
      .select({ title: 1, slug: 1 })
      .lean()
      .exec();

    const result = await Blog.deleteMany({ _id: { $in: ids } });

    await logActivity(
      "Blogs Bulk Deleted",
      `Deleted ${result.deletedCount} blog(s): ${blogs
        .map((blog) => blog.title)
        .slice(0, 10)
        .join(", ")}`,
      "blog",
    );

    revalidatePath("/blog");
    blogs.forEach((blog) => revalidatePath(`/blog/${blog.slug}`));

    return NextResponse.json(
      {
        success: true,
        message: `${result.deletedCount} blog(s) deleted successfully`,
        deletedCount: result.deletedCount,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Bulk Delete Blogs Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete selected blogs" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

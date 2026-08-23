import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import createBlogRevision from "@/lib/createBlogRevision";
import logActivity from "@/lib/logActivity";
import Blog from "@/lib/models/Blog";
import BlogRevision from "@/lib/models/BlogRevision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      revisionId: string;
    }>;
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

    const { id, revisionId } = await params;

    if (
      !mongoose.isValidObjectId(id) ||
      !mongoose.isValidObjectId(revisionId)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid revision id" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const revision = await BlogRevision.findOne({
      _id: revisionId,
      blog: id,
    })
      .lean()
      .exec();

    if (!revision) {
      return NextResponse.json(
        { success: false, message: "Revision not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    await createBlogRevision(id, admin.id);

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: {
          title: revision.title,
          slug: revision.slug,
          excerpt: revision.excerpt,
          content: revision.content,
          category: revision.category,
          tags: revision.tags,
          status: revision.status,
          featuredImage: revision.featuredImage,
          featuredImageAlt: revision.featuredImageAlt,
          metaTitle: revision.metaTitle,
          metaDescription: revision.metaDescription,
          updatedBy: admin.id,
        },
      },
      {
        new: true,
        runValidators: true,
      },
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
      "Blog Revision Restored",
      `Revision ${revision.revisionNumber} restored for ${blog.title}`,
      "blog",
    );

    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(
      {
        success: true,
        message: "Revision restored successfully",
        blog,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Restore Blog Revision Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to restore revision" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

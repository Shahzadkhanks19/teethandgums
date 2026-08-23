import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { verifyAdminRequest } from "@/lib/auth";
import createBlogRevision from "@/lib/createBlogRevision";
import { prepareBlogPayload } from "@/lib/blogPayload";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Blog from "@/lib/models/Blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const admin = verifyAdminRequest(req);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog id" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const blog = await Blog.findById(id)
      .populate("category", "name slug color")
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
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Get Admin Blog Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blog" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
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
      | Record<string, unknown>
      | null;

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const currentBlog = await Blog.findById(id)
      .select({ slug: 1, title: 1 })
      .lean()
      .exec();

    if (!currentBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    await createBlogRevision(id, admin.id);

    const prepared = await prepareBlogPayload(body, {
      blogId: id,
      adminId: admin.id,
      partial: true,
    });

    if (!prepared.success) {
      return NextResponse.json(
        { success: false, message: prepared.message },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $set: prepared.data },
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
      "Blog Updated",
      `Title: ${blog.title}, Status: ${blog.status}`,
      "blog",
    );

    revalidatePath("/blog");
    revalidatePath(`/blog/${currentBlog.slug}`);
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully",
        blog,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Update Blog Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
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

    await connectDB();

    const blog = await Blog.findByIdAndDelete(id)
      .select({ title: 1, slug: 1 })
      .lean()
      .exec();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    await logActivity(
      "Blog Deleted",
      `Title: ${blog.title}, Slug: ${blog.slug}`,
      "blog",
    );

    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Delete Blog Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete blog" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

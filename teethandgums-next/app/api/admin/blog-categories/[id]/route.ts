import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { createBlogSlug } from "@/lib/blog";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Blog from "@/lib/models/Blog";
import BlogCategory from "@/lib/models/BlogCategory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
        { success: false, message: "Invalid category id" },
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

    const update: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (name.length < 2 || name.length > 100) {
        return NextResponse.json(
          { success: false, message: "Enter a valid category name." },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }

      update.name = name;
    }

    if (body.slug !== undefined || body.name !== undefined) {
      const slug = createBlogSlug(
        String(body.slug || body.name || ""),
      );

      if (!slug) {
        return NextResponse.json(
          { success: false, message: "Enter a valid category slug." },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }

      update.slug = slug;
    }

    if (body.description !== undefined) {
      update.description = String(body.description || "").trim().slice(0, 500);
    }

    if (body.color !== undefined) {
      const color = String(body.color);

      if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
        return NextResponse.json(
          { success: false, message: "Enter a valid category color." },
          { status: 400, headers: { "Cache-Control": "no-store" } },
        );
      }

      update.color = color;
    }

    if (body.sortOrder !== undefined) {
      update.sortOrder = Math.max(
        0,
        Math.min(Number(body.sortOrder) || 0, 10_000),
      );
    }

    if (body.isActive !== undefined) {
      update.isActive = Boolean(body.isActive);
    }

    await connectDB();

    if (update.slug || update.name) {
      const duplicateFilter: Record<string, unknown> = {
        _id: { $ne: id },
        $or: [],
      };

      const duplicateConditions = duplicateFilter.$or as Array<Record<string, unknown>>;

      if (update.slug) duplicateConditions.push({ slug: update.slug });
      if (update.name) {
        duplicateConditions.push({
          name: new RegExp(
            `^${String(update.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          ),
        });
      }

      const duplicate = await BlogCategory.exists(duplicateFilter);

      if (duplicate) {
        return NextResponse.json(
          { success: false, message: "This category already exists." },
          { status: 409, headers: { "Cache-Control": "no-store" } },
        );
      }
    }

    const category = await BlogCategory.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).exec();

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Blog category not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    await logActivity(
      "Blog Category Updated",
      `Category: ${category.name}`,
      "blog",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Blog category updated successfully",
        category,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Update Blog Category Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update blog category" },
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
        { success: false, message: "Invalid category id" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const category = await BlogCategory.findById(id)
      .select({ name: 1 })
      .lean()
      .exec();

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Blog category not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    const assignedBlogs = await Blog.countDocuments({ category: id });

    if (assignedBlogs > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Move or remove the category from ${assignedBlogs} blog(s) before deleting it.`,
        },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    await BlogCategory.deleteOne({ _id: id });

    await logActivity(
      "Blog Category Deleted",
      `Category: ${category.name}`,
      "blog",
    );

    return NextResponse.json(
      { success: true, message: "Blog category deleted successfully" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Delete Blog Category Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete blog category" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

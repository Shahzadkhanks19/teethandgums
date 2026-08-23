import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { createBlogSlug } from "@/lib/blog";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import BlogCategory from "@/lib/models/BlogCategory";

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

    const categories = await BlogCategory.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean()
      .exec();

    return NextResponse.json(
      { success: true, categories },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Get Blog Categories Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blog categories" },
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

    const name = String(body?.name || "").trim();
    const slug = createBlogSlug(String(body?.slug || name));
    const description = String(body?.description || "").trim();
    const color = String(body?.color || "#2563eb").trim();
    const sortOrder = Math.max(
      0,
      Math.min(Number(body?.sortOrder) || 0, 10_000),
    );

    if (name.length < 2 || name.length > 100 || !slug) {
      return NextResponse.json(
        { success: false, message: "Enter a valid category name and slug." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      return NextResponse.json(
        { success: false, message: "Category color must be a valid hex code." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const duplicate = await BlogCategory.exists({
      $or: [{ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }, { slug }],
    });

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "This category already exists." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    const category = await BlogCategory.create({
      name,
      slug,
      description: description.slice(0, 500),
      color,
      sortOrder,
      isActive: body?.isActive === undefined ? true : Boolean(body.isActive),
    });

    await logActivity(
      "Blog Category Created",
      `Category: ${category.name}`,
      "blog",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Blog category created successfully",
        category,
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Create Blog Category Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create blog category" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

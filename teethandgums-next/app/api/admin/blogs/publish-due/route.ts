import { timingSafeEqual } from "node:crypto";

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

function hasValidCronSecret(req: NextRequest) {
  const expected = process.env.BLOG_PUBLISH_CRON_SECRET?.trim();
  const authorization = req.headers.get("authorization") || "";
  const received = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(req: NextRequest) {
  try {
    const cronAuthorized = hasValidCronSecret(req);
    const admin = cronAuthorized ? null : verifyAdminRequest(req);

    if (!cronAuthorized && !admin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!cronAuthorized && !verifyCsrfToken(req)) {
      return NextResponse.json(
        { success: false, message: "Invalid CSRF token" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const now = new Date();

    const dueBlogs = await Blog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    })
      .select({ title: 1, slug: 1 })
      .lean()
      .exec();

    if (dueBlogs.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No scheduled blogs are due",
          publishedCount: 0,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const result = await Blog.updateMany(
      {
        _id: { $in: dueBlogs.map((blog) => blog._id) },
      },
      {
        $set: {
          status: "published",
          publishedAt: now,
          scheduledAt: null,
          ...(admin ? { updatedBy: admin.id } : {}),
        },
      },
    );

    await logActivity(
      "Scheduled Blogs Published",
      `${result.modifiedCount} scheduled blog(s) published`,
      "blog",
    );

    revalidatePath("/blog");
    dueBlogs.forEach((blog) =>
      revalidatePath(`/blog/${blog.slug}`),
    );

    return NextResponse.json(
      {
        success: true,
        message: `${result.modifiedCount} blog(s) published`,
        publishedCount: result.modifiedCount,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Publish Due Blogs Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to publish scheduled blogs",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

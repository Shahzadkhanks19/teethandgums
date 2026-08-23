import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import BlogRevision from "@/lib/models/BlogRevision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
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

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog id" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();

    const revisions = await BlogRevision.find({ blog: id })
      .sort({ revisionNumber: -1 })
      .limit(50)
      .lean()
      .exec();

    return NextResponse.json(
      { success: true, revisions },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Get Blog Revisions Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch revisions" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

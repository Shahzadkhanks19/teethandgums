import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const decoded = verifyAdminRequest(req);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized",
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!verifyCsrfToken(req)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid CSRF token",
        },
        {
          status: 403,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notification ID",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        $set: { isRead: true },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .lean()
      .exec();

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        notification,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Mark Notification Read Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark notification as read",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

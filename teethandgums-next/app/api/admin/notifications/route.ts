import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

export async function GET(req: NextRequest) {
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

    const requestedLimit = Number(
      req.nextUrl.searchParams.get("limit") || DEFAULT_LIMIT,
    );

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.trunc(requestedLimit), 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    await connectDB();

    const [notifications, unreadCount] = await Promise.all([
      Notification.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
        .exec(),
      Notification.countDocuments({ isRead: false }),
    ]);

    return NextResponse.json(
      {
        success: true,
        unreadCount,
        notifications,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Load Notifications Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load notifications",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

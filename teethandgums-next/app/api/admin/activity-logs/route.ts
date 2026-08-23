import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import ActivityLog from "@/lib/models/ActivityLog";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 500;

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}

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
          headers: noStoreHeaders(),
        },
      );
    }

    const requestedLimit = Number(
      req.nextUrl.searchParams.get("limit") || DEFAULT_LIMIT,
    );

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(
          Math.max(Math.trunc(requestedLimit), 1),
          MAX_LIMIT,
        )
      : DEFAULT_LIMIT;

    await connectDB();

    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return NextResponse.json(
      {
        success: true,
        logs,
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Get Activity Logs Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch activity logs",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
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
          headers: noStoreHeaders(),
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
          headers: noStoreHeaders(),
        },
      );
    }

    await connectDB();

    const result = await ActivityLog.deleteMany({});

    const socketResult = await Promise.allSettled([
      emitSocketEvent({
        eventName: "activityLogUpdated",
        payload: {
          cleared: true,
          deletedCount: result.deletedCount,
        },
      }),
    ]);

    socketResult.forEach((item) => {
      if (item.status === "rejected") {
        console.error(
          "Clear activity logs socket event failed:",
          item.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "All activity logs deleted successfully",
        deletedCount: result.deletedCount,
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Clear Activity Logs Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear activity logs",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

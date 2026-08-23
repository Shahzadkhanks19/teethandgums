import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import ActivityLog from "@/lib/models/ActivityLog";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}

export async function DELETE(
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

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid activity log id",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    await connectDB();

    const log = await ActivityLog.findByIdAndDelete(id)
      .select({
        _id: 1,
        action: 1,
        details: 1,
        type: 1,
        createdAt: 1,
      })
      .lean()
      .exec();

    if (!log) {
      return NextResponse.json(
        {
          success: false,
          message: "Activity log not found",
        },
        {
          status: 404,
          headers: noStoreHeaders(),
        },
      );
    }

    const socketResult = await Promise.allSettled([
      emitSocketEvent({
        eventName: "activityLogUpdated",
        payload: {
          deletedId: id,
          log,
        },
      }),
    ]);

    socketResult.forEach((item) => {
      if (item.status === "rejected") {
        console.error(
          "Delete activity log socket event failed:",
          item.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Activity log deleted successfully",
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Delete Activity Log Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete activity log",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import BlockedSlot from "@/lib/models/BlockedSlot";
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
          message: "Invalid blocked slot id",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    await connectDB();

    const blockedSlot =
      await BlockedSlot.findByIdAndDelete(id)
        .select({
          _id: 1,
          date: 1,
          timeSlot: 1,
          type: 1,
          reason: 1,
        })
        .lean()
        .exec();

    if (!blockedSlot) {
      return NextResponse.json(
        {
          success: false,
          message: "Blocked slot not found",
        },
        {
          status: 404,
          headers: noStoreHeaders(),
        },
      );
    }

    const deletedBlock = {
      id: blockedSlot._id,
      date: blockedSlot.date,
      timeSlot: blockedSlot.timeSlot,
      type: blockedSlot.type,
      reason: blockedSlot.reason,
    };

    const sideEffectResults = await Promise.allSettled([
      emitSocketEvent({
        eventName: "availabilityUpdated",
        payload: {
          blockedSlot: deletedBlock,
        },
      }),
      logActivity(
        "Availability Unblocked",
        blockedSlot.type === "day"
          ? `Removed day block: ${blockedSlot.date}`
          : `Removed slot block: ${blockedSlot.timeSlot} (${blockedSlot.date})`,
        "availability",
      ),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Remove availability block side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Block removed successfully",
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Remove Block Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove blocked slot",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

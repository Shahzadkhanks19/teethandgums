import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Appointment from "@/lib/models/Appointment";
import { sanitizeInput } from "@/lib/sanitize";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BULK_DELETE = 100;
const MAX_BODY_SIZE = 20_000;

type BulkDeleteBody = {
  ids?: string[];
};

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

    let body: BulkDeleteBody;

    try {
      body = sanitizeInput(await req.json()) as BulkDeleteBody;

      if (JSON.stringify(body).length > MAX_BODY_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "Request body is too large",
          },
          {
            status: 413,
            headers: { "Cache-Control": "no-store" },
          },
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const ids = Array.isArray(body.ids)
      ? [...new Set(body.ids.map((id) => id.trim()))]
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No appointments selected",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (ids.length > MAX_BULK_DELETE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can delete maximum 100 appointments at a time",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!ids.every((id) => mongoose.isValidObjectId(id))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment id found",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const result = await Appointment.deleteMany({
      _id: { $in: ids },
    });

    const sideEffectResults = await Promise.allSettled([
      emitSocketEvent({
        eventName: "appointmentDeleted",
        payload: { ids },
      }),
      logActivity(
        "Bulk Appointment Delete",
        `${result.deletedCount} appointment(s) deleted`,
        "appointment",
      ),
    ]);

    sideEffectResults.forEach((resultItem) => {
      if (resultItem.status === "rejected") {
        console.error(
          "Bulk appointment delete side effect failed:",
          resultItem.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: `${result.deletedCount} appointment(s) deleted successfully`,
        deletedCount: result.deletedCount,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Bulk Delete Appointments Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete selected appointments",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

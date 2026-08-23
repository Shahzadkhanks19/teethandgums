import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Contact, {
  type ContactStatus,
} from "@/lib/models/Contact";
import { sanitizeInput } from "@/lib/sanitize";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set<ContactStatus>([
  "new",
  "read",
  "replied",
]);

type UpdateStatusBody = {
  status?: string;
};

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
          message: "Invalid contact id",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    let body: UpdateStatusBody;

    try {
      body = sanitizeInput(
        await req.json(),
      ) as UpdateStatusBody;

      if (JSON.stringify(body).length > 10_000) {
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

    const status =
      body.status?.trim().toLowerCase() as ContactStatus | undefined;

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid contact status",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        $set: { status },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .lean()
      .exec();

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact message not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const sideEffectResults = await Promise.allSettled([
      emitSocketEvent({
        eventName: "contactUpdated",
        payload: { contact },
      }),
      logActivity(
        "Contact Message Status Updated",
        `Message from: ${contact.name}, Status: ${status}`,
        "contact",
      ),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Update contact status side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: `Message marked as ${status}`,
        contact,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Update Contact Status Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update contact message",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

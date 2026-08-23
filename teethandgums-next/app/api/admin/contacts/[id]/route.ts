import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Contact from "@/lib/models/Contact";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    await connectDB();

    const contact = await Contact.findByIdAndDelete(id)
      .select({ _id: 1, name: 1, email: 1 })
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

    const deletedContact = {
      id: contact._id,
      name: contact.name,
      email: contact.email,
    };

    const sideEffectResults = await Promise.allSettled([
      emitSocketEvent({
        eventName: "contactDeleted",
        payload: {
          contact: deletedContact,
        },
      }),
      logActivity(
        "Contact Message Deleted",
        `Message from: ${contact.name} (${contact.email})`,
        "contact",
      ),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Delete contact side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact message deleted successfully",
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Delete Contact Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete contact message",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

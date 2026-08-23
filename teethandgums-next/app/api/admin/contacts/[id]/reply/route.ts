import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import { patientContactReplyEmail } from "@/lib/email/contactTemplates";
import logActivity from "@/lib/logActivity";
import Contact from "@/lib/models/Contact";
import { sanitizeInput } from "@/lib/sanitize";
import sendEmail from "@/lib/sendEmail";
import emitSocketEvent from "@/lib/socketEmitter";
import { notifyPatientContactReply } from "@/lib/whatsapp/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_SIZE = 20_000;

type ReplyBody = {
  subject?: string;
  message?: string;
};

export async function POST(
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

    let body: ReplyBody;

    try {
      body = sanitizeInput(await req.json()) as ReplyBody;

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

    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";

    if (!subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subject and reply message are required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Subject should not exceed 200 characters",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (message.length > 5_000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reply message should not exceed 5000 characters",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const contact = await Contact.findById(id);

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

    const deliveryResults = await Promise.allSettled([
      sendEmail({
        to: contact.email,
        subject,
        html: patientContactReplyEmail({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
          replyMessage: message,
        }),
      }),
      notifyPatientContactReply({
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        replyMessage: message,
      }),
    ]);

    const emailResult = deliveryResults[0];
    if (emailResult?.status === "rejected") {
      throw emailResult.reason;
    }

    contact.replies.push({
      subject,
      message,
      sentTo: contact.email,
      sentBy: decoded.email || "Admin",
      status: "sent",
      sentAt: new Date(),
    });

    contact.status = "replied";
    contact.repliedAt = new Date();

    await contact.save();

    const updatedContact = contact.toObject();

    const sideEffectResults = await Promise.allSettled([
      logActivity(
        "Contact Message Replied",
        `Reply sent to ${contact.name} (${contact.email})`,
        "contact",
      ),
      emitSocketEvent({
        eventName: "contactUpdated",
        payload: { contact: updatedContact },
      }),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Reply contact side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reply sent successfully",
        contact: updatedContact,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Reply Contact Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send reply",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

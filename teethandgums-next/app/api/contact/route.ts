import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import createNotification from "@/lib/createNotification";
import connectDB from "@/lib/db";
import { adminNewContactEmail } from "@/lib/email/contactTemplates";
import Contact, { type ContactDocument } from "@/lib/models/Contact";
import {
  getRateLimitHeaders,
  rateLimit,
  type RateLimitResult,
} from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitize";
import sendEmail from "@/lib/sendEmail";
import emitSocketEvent from "@/lib/socketEmitter";
import { notifyAdminNewContact } from "@/lib/whatsapp/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BODY_BYTES = 100_000;

type ContactBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

type NormalizedContactBody = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

function normalizeContactBody(
  body: ContactBody,
): NormalizedContactBody {
  return {
    name: body.name?.trim().replace(/\s+/g, " ") || "",
    phone: body.phone?.trim().replace(/\D/g, "") || "",
    email: body.email?.trim().toLowerCase() || "",
    message: body.message?.trim() || "",
  };
}

function validateContactData(
  data: NormalizedContactBody,
): string | null {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !data.name ||
    !data.phone ||
    !data.email ||
    !data.message
  ) {
    return "Please fill all required fields";
  }

  if (data.name.length < 2 || data.name.length > 100) {
    return "Name must be between 2 and 100 characters";
  }

  if (!indianPhoneRegex.test(data.phone)) {
    return "Please enter a valid 10-digit Indian WhatsApp number";
  }

  if (!emailRegex.test(data.email) || data.email.length > 254) {
    return "Please enter a valid email address";
  }

  if (data.message.length < 10) {
    return "Message should be at least 10 characters";
  }

  if (data.message.length > 2_000) {
    return "Message should not be more than 2000 characters";
  }

  return null;
}

function rateLimitResponse(
  message: string,
  limit: RateLimitResult,
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status: 429,
      headers: {
        ...getRateLimitHeaders(limit),
        "Cache-Control": "no-store",
      },
    },
  );
}

function jsonSizeTooLarge(body: unknown): boolean {
  return JSON.stringify(body).length > MAX_REQUEST_BODY_BYTES;
}

function createNotificationPreview(
  message: string,
): string {
  const normalizedMessage = message
    .replace(/\s+/g, " ")
    .trim();

  return normalizedMessage.length <= 90
    ? normalizedMessage
    : `${normalizedMessage.slice(0, 87)}...`;
}

async function runContactSideEffects(
  contact: ContactDocument,
) {
  const notification = await createNotification({
    title: "New Contact Message",
    message: `${contact.name} sent a message: ${createNotificationPreview(
      contact.message,
    )}`,
    type: "contact",
    referenceType: "contact",
    referenceId: contact._id.toString(),
    priority: "normal",
  });

  const tasks: Promise<unknown>[] = [
    emitSocketEvent({
      eventName: "newContactMessage",
      payload: {
        contact: contact.toObject(),
        notification,
      },
    }),
  ];

  if (process.env.EMAIL_USER) {
    tasks.push(
      sendEmail({
        to: process.env.EMAIL_USER,
        subject:
          "New Contact Message - Teeth and Gums Care",
        html: adminNewContactEmail({
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          message: contact.message,
        }),
      }),
      notifyAdminNewContact({
        id: contact._id.toString(),
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        message: contact.message,
      }),
    );
  }

  const results = await Promise.allSettled(tasks);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Contact side effect failed:",
        result.reason,
      );
    }
  });

  return notification;
}

export async function POST(req: NextRequest) {
  try {
    const ipLimit = rateLimit(req, {
      keyPrefix: "contact:ip",
      windowMs: 15 * 60 * 1000,
      maxRequests: 10,
    });

    if (!ipLimit.success) {
      return rateLimitResponse(
        "Too many contact form submissions. Please try again after 15 minutes.",
        ipLimit,
      );
    }

    let rawBody: ContactBody;

    try {
      rawBody = sanitizeInput(
        await req.json(),
      ) as ContactBody;

      if (jsonSizeTooLarge(rawBody)) {
        return NextResponse.json(
          {
            success: false,
            message: "Request body is too large",
          },
          {
            status: 413,
            headers: {
              "Cache-Control": "no-store",
            },
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
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const body = normalizeContactBody(rawBody);

    const validationError = validateContactData(body);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const [emailLimit, phoneLimit] = [
      rateLimit(req, {
        keyPrefix: "contact:email",
        identifier: body.email,
        windowMs: 60 * 60 * 1000,
        maxRequests: 5,
      }),
      rateLimit(req, {
        keyPrefix: "contact:phone",
        identifier: body.phone,
        windowMs: 60 * 60 * 1000,
        maxRequests: 5,
      }),
    ];

    if (!emailLimit.success) {
      return rateLimitResponse(
        "Too many submissions from this email. Please try again later.",
        emailLimit,
      );
    }

    if (!phoneLimit.success) {
      return rateLimitResponse(
        "Too many submissions from this phone number. Please try again later.",
        phoneLimit,
      );
    }

    await connectDB();

    const contact = await Contact.create(body);

    await runContactSideEffects(contact);

    return NextResponse.json(
      {
        success: true,
        message: "Message submitted successfully",
        contact: contact.toObject(),
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          ...getRateLimitHeaders(ipLimit),
        },
      },
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit message",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

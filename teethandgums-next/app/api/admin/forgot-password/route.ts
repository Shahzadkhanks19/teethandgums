import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { adminResetPasswordEmail } from "@/lib/email/authTemplates";
import Admin from "@/lib/models/Admin";
import {
  getRateLimitHeaders,
  rateLimit,
  type RateLimitResult,
} from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitize";
import sendEmail from "@/lib/sendEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const genericSuccessMessage =
  "If an account with this email exists, a password reset link has been sent.";

type ForgotPasswordBody = {
  email?: string;
};

function normalizeEmail(email?: string): string {
  return email?.trim().toLowerCase().replace(/\s+/g, "") || "";
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

export async function POST(req: NextRequest) {
  try {
    const ipLimit = rateLimit(req, {
      keyPrefix: "forgot-password:ip",
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!ipLimit.success) {
      return rateLimitResponse(
        "Too many password reset requests. Please try again after 15 minutes.",
        ipLimit,
      );
    }

    let body: ForgotPasswordBody;

    try {
      body = sanitizeInput(
        await req.json(),
      ) as ForgotPasswordBody;

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

    const email = normalizeEmail(body.email);

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const emailLimit = rateLimit(req, {
      keyPrefix: "forgot-password:email",
      identifier: email,
      windowMs: 15 * 60 * 1000,
      maxRequests: 3,
    });

    if (!emailLimit.success) {
      return rateLimitResponse(
        "Too many reset requests for this email. Please try again later.",
        emailLimit,
      );
    }

    await connectDB();

    const admin = await Admin.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordExpire",
    );

    if (!admin) {
      return NextResponse.json(
        {
          success: true,
          message: genericSuccessMessage,
        },
        {
          headers: {
            "Cache-Control": "no-store",
            ...getRateLimitHeaders(ipLimit),
          },
        },
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    admin.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    await admin.save();

    const baseUrl = (
      process.env.NEXT_PUBLIC_CLIENT_URL ||
      "http://localhost:3000"
    ).replace(/\/+$/, "");

    const resetUrl = `${baseUrl}/admin/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: admin.email,
        subject:
          "Admin Password Reset - Teeth and Gums Care",
        html: adminResetPasswordEmail({
          resetUrl,
        }),
      });
    } catch (emailError) {
      admin.resetPasswordToken = "";
      admin.resetPasswordExpire = undefined;
      await admin.save();

      console.error(
        "Forgot Password Email Error:",
        emailError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send the password reset email. Please try again.",
        },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: genericSuccessMessage,
      },
      {
        headers: {
          "Cache-Control": "no-store",
          ...getRateLimitHeaders(ipLimit),
        },
      },
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process password reset request",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

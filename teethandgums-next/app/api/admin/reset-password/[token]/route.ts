import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import {
  getRateLimitHeaders,
  rateLimit,
  type RateLimitResult,
} from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/;

const passwordPolicyMessage =
  "Password must be 8–128 characters and include uppercase, lowercase, number, and special character.";

type ResetPasswordBody = {
  password?: string;
  confirmPassword?: string;
};

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const limit = rateLimit(req, {
      keyPrefix: "admin-reset-password",
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!limit.success) {
      return rateLimitResponse(
        "Too many password reset attempts. Please try again after 15 minutes.",
        limit,
      );
    }

    const { token } = await params;

    if (!token || token.length > 256) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reset token",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    let body: ResetPasswordBody;

    try {
      body = sanitizeInput(await req.json()) as ResetPasswordBody;

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

    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";

    if (!password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password and confirm password are required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: passwordPolicyMessage,
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: new Date(),
      },
    }).select(
      "+password +resetPasswordToken +resetPasswordExpire",
    );

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const isSamePassword = await bcrypt.compare(
      password,
      admin.password,
    );

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password cannot be the same as old password",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    admin.password = await bcrypt.hash(password, 12);
    admin.resetPasswordToken = "";
    admin.resetPasswordExpire = undefined;

    await admin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store",
          ...getRateLimitHeaders(limit),
        },
      },
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset password",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

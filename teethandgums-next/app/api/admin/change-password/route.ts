import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
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

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
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

export async function PATCH(req: NextRequest) {
  try {
    const limit = rateLimit(req, {
      keyPrefix: "admin-change-password",
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!limit.success) {
      return rateLimitResponse(
        "Too many password change attempts. Please try again after 15 minutes.",
        limit,
      );
    }

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

    let body: ChangePasswordBody;

    try {
      body = sanitizeInput(
        await req.json(),
      ) as ChangePasswordBody;

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

    const currentPassword = body.currentPassword || "";
    const newPassword = body.newPassword || "";
    const confirmPassword = body.confirmPassword || "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All password fields are required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!passwordRegex.test(newPassword)) {
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

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password and confirm password do not match",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const admin = await Admin.findById(decoded.id).select("+password");

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password,
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      admin.password,
    );

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password cannot be the same as current password",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    await logActivity(
      "Password Changed",
      admin.email,
      "admin",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store",
          ...getRateLimitHeaders(limit),
        },
      },
    );
  } catch (error) {
    console.error("Change Password Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to change password",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

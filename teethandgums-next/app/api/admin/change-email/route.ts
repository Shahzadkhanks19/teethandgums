import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Admin from "@/lib/models/Admin";
import { sanitizeInput } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChangeEmailBody = {
  newEmail?: string;
  currentPassword?: string;
};

export async function PATCH(req: NextRequest) {
  try {
    const decoded = verifyAdminRequest(req);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
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

    let body: ChangeEmailBody;

    try {
      body = sanitizeInput(
        await req.json(),
      ) as ChangeEmailBody;
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

    const newEmail =
      body.newEmail?.trim().toLowerCase() || "";
    const currentPassword = body.currentPassword || "";

    if (!newEmail || !currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New email and current password are required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (
      newEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
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

    await connectDB();

    const [admin, existingAdmin] = await Promise.all([
      Admin.findById(decoded.id).select("+password"),
      Admin.exists({
        email: newEmail,
        _id: { $ne: decoded.id },
      }),
    ]);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is already used by another admin",
        },
        {
          status: 409,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const previousEmail = admin.email;
    admin.email = newEmail;
    await admin.save();

    await logActivity(
      "Login Email Changed",
      `${previousEmail} → ${newEmail}`,
      "admin",
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login email updated successfully",
        admin: {
          id: admin._id,
          email: admin.email,
        },
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Change Admin Email Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update login email",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

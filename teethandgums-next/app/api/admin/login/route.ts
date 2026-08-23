import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

type LoginBody = {
  email?: string;
  password?: string;
};

function generateToken(adminId: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(
    {
      id: adminId,
      purpose: "admin",
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "7d",
      issuer: "teeth-and-gums-care",
      audience: "admin-dashboard",
    },
  );
}

function normalizeLoginBody(body: LoginBody) {
  return {
    email: body.email?.trim().toLowerCase() || "",
    password: body.password || "",
  };
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
      keyPrefix: "admin-login:ip",
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!ipLimit.success) {
      return rateLimitResponse(
        "Too many login attempts. Please try again after 15 minutes.",
        ipLimit,
      );
    }

    let rawBody: LoginBody;

    try {
      rawBody = sanitizeInput(await req.json()) as LoginBody;

      if (JSON.stringify(rawBody).length > 10_000) {
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

    const { email, password } = normalizeLoginBody(rawBody);

    if (
      !email ||
      !password ||
      email.length > 254 ||
      password.length > 128
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const emailLimit = rateLimit(req, {
      keyPrefix: "admin-login:email",
      identifier: email,
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!emailLimit.success) {
      return rateLimitResponse(
        "Too many login attempts for this email. Please try again after 15 minutes.",
        emailLimit,
      );
    }

    await connectDB();

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password,
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const token = generateToken(admin._id.toString());

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        admin: {
          id: admin._id,
          email: admin.email,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
          ...getRateLimitHeaders(ipLimit),
        },
      },
    );

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Admin login failed",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

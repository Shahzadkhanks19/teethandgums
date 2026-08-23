import { NextResponse } from "next/server";

import { verifyAdminCookie } from "@/lib/auth";
import { generateCsrfToken } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const decoded = await verifyAdminCookie();

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

    const csrfToken = generateCsrfToken();

    const response = NextResponse.json(
      {
        success: true,
        csrfToken,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );

    response.cookies.set("csrfToken", csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("CSRF Token Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate CSRF token",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

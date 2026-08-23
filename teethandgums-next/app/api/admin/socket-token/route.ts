import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { verifyAdminCookie } from "@/lib/auth";

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

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    const socketToken = jwt.sign(
      {
        id: decoded.id,
        purpose: "socket",
      },
      secret,
      {
        algorithm: "HS256",
        expiresIn: "15m",
        issuer: "teeth-and-gums-care",
        audience: "admin-socket",
      },
    );

    return NextResponse.json(
      {
        success: true,
        socketToken,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Socket Token Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate socket token",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

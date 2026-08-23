import { NextResponse } from "next/server";

import { verifyAdminCookie } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

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

    await connectDB();

    const admin = await Admin.findById(decoded.id)
      .select({ _id: 1, email: 1 })
      .lean()
      .exec();

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

    return NextResponse.json(
      {
        success: true,
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
    console.error("Admin Me Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify admin",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

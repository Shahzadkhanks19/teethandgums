import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 1_000;

export async function GET(req: NextRequest) {
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

    const requestedLimit = Number(
      req.nextUrl.searchParams.get("limit") || DEFAULT_LIMIT,
    );

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(
          Math.max(Math.trunc(requestedLimit), 1),
          MAX_LIMIT,
        )
      : DEFAULT_LIMIT;

    await connectDB();

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return NextResponse.json(
      {
        success: true,
        contacts,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Get Contacts Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch contact messages",
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

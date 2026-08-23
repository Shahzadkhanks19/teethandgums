import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Clear-Site-Data": '"cache", "storage"',
      },
    },
  );

  response.cookies.set("adminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  response.cookies.set("csrfToken", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}

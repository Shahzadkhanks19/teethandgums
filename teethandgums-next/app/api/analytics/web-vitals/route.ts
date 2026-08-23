import { NextRequest, NextResponse } from "next/server";

import { getRateLimitHeaders, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedMetricNames = new Set([
  "CLS",
  "FCP",
  "INP",
  "LCP",
  "TTFB",
]);

export async function POST(request: NextRequest) {
  const limit = rateLimit(request, {
    keyPrefix: "web-vitals",
    windowMs: 60_000,
    maxRequests: 30,
  });

  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: limit.message },
      {
        status: 429,
        headers: {
          ...getRateLimitHeaders(limit),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name : "";
    const value = typeof body.value === "number" ? body.value : Number.NaN;
    const path = typeof body.path === "string" ? body.path.slice(0, 250) : "/";

    if (!allowedMetricNames.has(name) || !Number.isFinite(value)) {
      return NextResponse.json(
        { success: false, message: "Invalid metric payload." },
        {
          status: 400,
          headers: {
            ...getRateLimitHeaders(limit),
            "Cache-Control": "no-store",
          },
        },
      );
    }

    if (process.env.NODE_ENV === "production") {
      console.info("[web-vital]", {
        name,
        value: Number(value.toFixed(3)),
        rating: body.rating,
        path,
      });
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          ...getRateLimitHeaders(limit),
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      {
        status: 400,
        headers: {
          ...getRateLimitHeaders(limit),
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

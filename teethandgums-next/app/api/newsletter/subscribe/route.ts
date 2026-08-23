import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import NewsletterSubscriber from "@/lib/models/NewsletterSubscriber";
import { getRateLimitHeaders, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const limit = rateLimit(request, {
    keyPrefix: "newsletter:subscribe",
    windowMs: 15 * 60 * 1000,
    maxRequests: 8,
  });

  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please try again later." },
      { status: 429, headers: { ...getRateLimitHeaders(limit), "Cache-Control": "no-store" } },
    );
  }

  try {
    const body = (await request.json()) as { email?: string; source?: string };
    const email = body.email?.trim().toLowerCase() || "";
    const source = body.source?.trim().slice(0, 80) || "blog";

    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    await connectDB();
    const existing = await NewsletterSubscriber.findOne({ email });

    if (existing?.status === "subscribed") {
      return NextResponse.json(
        { success: true, message: "You are already subscribed." },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      {
        $set: {
          status: "subscribed",
          source,
          confirmedAt: new Date(),
          unsubscribedAt: null,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json(
      { success: true, message: "Subscribed successfully. Dental updates will arrive in your inbox." },
      { status: existing ? 200 : 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to subscribe right now. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

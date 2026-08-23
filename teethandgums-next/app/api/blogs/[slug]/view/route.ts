import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await connectDB();

  const result = await Blog.updateOne(
    {
      slug,
      robotsIndex: true,
      status: { $in: ["published", "scheduled"] },
    },
    { $inc: { views: 1 } },
  );

  return NextResponse.json(
    { success: result.matchedCount > 0 },
    {
      status: result.matchedCount > 0 ? 200 : 404,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

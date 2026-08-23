import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminRequest(req);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!verifyCsrfToken(req)) {
      return NextResponse.json(
        { success: false, message: "Invalid CSRF token" },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No image file was provided" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const extension = allowedTypes.get(file.type);

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, WebP and AVIF images are allowed.",
        },
        { status: 415, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be between 1 byte and 5 MB.",
        },
        { status: 413, headers: { "Cache-Control": "no-store" } },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${randomUUID()}.${extension}`;

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blog",
    );

    await mkdir(uploadDirectory, {
      recursive: true,
    });

    await writeFile(
      path.join(uploadDirectory, filename),
      bytes,
      {
        flag: "wx",
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        url: `/uploads/blog/${filename}`,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Blog Image Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload image",
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

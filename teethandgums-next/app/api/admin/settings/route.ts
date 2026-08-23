import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import ClinicSettings from "@/lib/models/ClinicSettings";
import { sanitizeInput } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedFields = [
  "clinicName",
  "logoUrl",
  "phone",
  "whatsapp",
  "address",
  "googleMapsUrl",
  "workingHours",
  "senderName",
  "senderEmail",
  "replyToEmail",
  "adminNotificationEmail",
  "smtpHost",
  "smtpPort",
  "smtpUser",
  "smtpPassword",
  "smtpSecure",
  "primaryColor",
  "secondaryColor",
  "emailFooter",
  "appointmentEmailsEnabled",
  "contactEmailsEnabled",
  "reminderEmailsEnabled",
  "adminNotificationsEnabled",
] as const;

type AllowedField = (typeof allowedFields)[number];
type SettingsBody = Partial<Record<AllowedField, unknown>>;

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}

function publicSettingsObject(settings: Record<string, unknown>) {
  const safeSettings = { ...settings };
  delete safeSettings.smtpPassword;
  return safeSettings;
}

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
          headers: noStoreHeaders(),
        },
      );
    }

    await connectDB();

    const settings = await ClinicSettings.findOneAndUpdate(
      { singletonKey: "clinic-settings" },
      {
        $setOnInsert: {
          singletonKey: "clinic-settings",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    )
      .lean()
      .exec();

    return NextResponse.json(
      {
        success: true,
        settings,
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Get Settings Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load settings",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

export async function PATCH(req: NextRequest) {
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
          headers: noStoreHeaders(),
        },
      );
    }

    if (!verifyCsrfToken(req)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid CSRF token",
        },
        {
          status: 403,
          headers: noStoreHeaders(),
        },
      );
    }

    let body: SettingsBody;

    try {
      body = sanitizeInput(await req.json()) as SettingsBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    const update: SettingsBody = {};

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        update[key] = body[key];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid settings were provided",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    await connectDB();

    const settings = await ClinicSettings.findOneAndUpdate(
      { singletonKey: "clinic-settings" },
      {
        $set: update,
        $setOnInsert: {
          singletonKey: "clinic-settings",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    )
      .select("+smtpPassword")
      .lean()
      .exec();

    if (!settings) {
      throw new Error("Settings update returned no document");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Settings updated successfully",
        settings: publicSettingsObject(
          settings as unknown as Record<string, unknown>,
        ),
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Update Settings Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

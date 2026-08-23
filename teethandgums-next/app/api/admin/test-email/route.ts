import nodemailer from "nodemailer";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import { smtpTestEmail } from "@/lib/email/systemTemplates";
import ClinicSettings from "@/lib/models/ClinicSettings";
import { sanitizeInput } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TestEmailBody = {
  testEmail?: string;
};

type SmtpSettings = {
  clinicName?: string;
  senderName?: string;
  senderEmail?: string;
  replyToEmail?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}

export async function POST(req: NextRequest) {
  try {
    const decoded = verifyAdminRequest(req);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 401, headers: noStoreHeaders() },
      );
    }

    if (!verifyCsrfToken(req)) {
      return NextResponse.json(
        { success: false, message: "Invalid CSRF token" },
        { status: 403, headers: noStoreHeaders() },
      );
    }

    let rawBody: TestEmailBody;

    try {
      rawBody = sanitizeInput(await req.json()) as TestEmailBody;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400, headers: noStoreHeaders() },
      );
    }

    const testEmail = rawBody.testEmail?.trim().toLowerCase() || "";

    if (!emailRegex.test(testEmail) || testEmail.length > 254) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid test email address",
        },
        { status: 400, headers: noStoreHeaders() },
      );
    }

    await connectDB();

    const settings = (await ClinicSettings.findOne()
      .select("+smtpPassword")
      .lean()
      .exec()) as SmtpSettings | null;

    if (!settings) {
      return NextResponse.json(
        { success: false, message: "Clinic settings not found" },
        { status: 404, headers: noStoreHeaders() },
      );
    }

    if (
      !settings.smtpHost ||
      !settings.smtpUser ||
      !settings.smtpPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "SMTP host, username and password are required",
        },
        { status: 400, headers: noStoreHeaders() },
      );
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: Number(settings.smtpPort || 587),
      secure: Boolean(settings.smtpSecure),
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transporter.verify();

    const clinicName =
      settings.clinicName?.trim() || "Teeth and Gums Care";

    await transporter.sendMail({
      from: `"${settings.senderName || clinicName}" <${
        settings.senderEmail || settings.smtpUser
      }>`,
      to: testEmail,
      replyTo:
        settings.replyToEmail ||
        settings.senderEmail ||
        settings.smtpUser,
      subject: `${clinicName} SMTP Test Email`,
      html: smtpTestEmail(clinicName),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Test email sent successfully",
      },
      { headers: noStoreHeaders() },
    );
  } catch (error) {
    console.error("Test Email Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send test email. Please check SMTP settings.",
      },
      { status: 500, headers: noStoreHeaders() },
    );
  }
}

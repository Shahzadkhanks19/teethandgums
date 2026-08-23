import nodemailer, {
  type Transporter,
} from "nodemailer";

import connectDB from "@/lib/db";
import ClinicSettings from "@/lib/models/ClinicSettings";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

type ClinicEmailSettings = {
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

type ResolvedTransport = {
  transporter: Transporter;
  fromName: string;
  fromEmail: string;
  replyTo: string;
};

function hasDbSmtp(
  settings: ClinicEmailSettings | null,
): settings is Required<
  Pick<
    ClinicEmailSettings,
    "smtpHost" | "smtpPort" | "smtpUser" | "smtpPassword"
  >
> &
  ClinicEmailSettings {
  return Boolean(
    settings?.smtpHost &&
      settings.smtpUser &&
      settings.smtpPassword &&
      settings.smtpPort,
  );
}

async function resolveTransport(
  requestedReplyTo?: string,
): Promise<ResolvedTransport | null> {
  try {
    await connectDB();

    const settings = (await ClinicSettings.findOne()
      .select("+smtpPassword")
      .lean()
      .exec()) as ClinicEmailSettings | null;

    if (hasDbSmtp(settings)) {
      const fromName =
        settings.senderName ||
        settings.clinicName ||
        "Teeth and Gums Care";

      const fromEmail =
        settings.senderEmail || settings.smtpUser;

      return {
        transporter: nodemailer.createTransport({
          host: settings.smtpHost,
          port: Number(settings.smtpPort),
          secure: Boolean(settings.smtpSecure),
          auth: {
            user: settings.smtpUser,
            pass: settings.smtpPassword,
          },
        }),
        fromName,
        fromEmail,
        replyTo:
          requestedReplyTo ||
          settings.replyToEmail ||
          settings.senderEmail ||
          settings.smtpUser,
      };
    }
  } catch (error) {
    console.warn(
      "Database SMTP unavailable; using environment email:",
      error,
    );
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn(
      "Email skipped: EMAIL_USER or EMAIL_PASS missing",
    );
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    }),
    fromName: "Teeth and Gums Care",
    fromEmail: emailUser,
    replyTo: requestedReplyTo || emailUser,
  };
}

export default async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<void> {
  const transport = await resolveTransport(replyTo);

  if (!transport) return;

  await transport.transporter.sendMail({
    from: `"${transport.fromName}" <${transport.fromEmail}>`,
    to,
    subject,
    html,
    replyTo: transport.replyTo,
  });
}

const nodemailer = require("nodemailer");
const {
  logInfo,
  logError,
} = require("../utils/logger");

let transporter = null;

function createTransporter() {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS missing in socket-server .env",
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
}

async function sendEmail({
  to,
  subject,
  html,
}) {
  try {
    if (!to) {
      throw new Error(
        "Email recipient is missing",
      );
    }

    const emailTransporter =
      createTransporter();

    const info =
      await emailTransporter.sendMail({
        from: `"Teeth and Gums Care" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        replyTo:
          process.env.EMAIL_REPLY_TO ||
          process.env.EMAIL_USER,
      });

    logInfo(
      `Email sent to ${to}; message id: ${info.messageId}`,
    );

    return true;
  } catch (error) {
    logError(
      "Email sending failed:",
      error instanceof Error ? error.message : error,
    );

    return false;
  }
}

module.exports = {
  sendEmail,
};

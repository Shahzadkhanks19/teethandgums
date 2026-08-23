const crypto = require("node:crypto");
const NotificationDelivery = require("../models/NotificationDelivery");

function normalizeIndianNumber(value = "") {
  const digits = String(value).replace(/\D/g, "");
  const local = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? `91${local}` : null;
}

async function sendWhatsAppTemplate({ to, event, referenceId, templateName, parameters = [] }) {
  const recipient = normalizeIndianNumber(to);
  if (!recipient) {
    await NotificationDelivery.create({ channel: "whatsapp", event, recipientType: "patient", recipient: String(to || ""), referenceType: "appointment", referenceId: String(referenceId || ""), status: "skipped", templateName, error: "Invalid Indian WhatsApp number", attempts: 0 });
    return false;
  }

  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    await NotificationDelivery.create({ channel: "whatsapp", event, recipientType: "patient", recipient, referenceType: "appointment", referenceId: String(referenceId || ""), status: "skipped", templateName, error: "WhatsApp integration is not configured", attempts: 0 });
    return false;
  }

  const version = process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0";
  const url = `https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: templateName,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en" },
          components: parameters.length ? [{ type: "body", parameters: parameters.map((text) => ({ type: "text", text: String(text || "-").slice(0, 1024) })) }] : [],
        },
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `Meta API returned ${response.status}`);
    await NotificationDelivery.create({ channel: "whatsapp", event, recipientType: "patient", recipient, referenceType: "appointment", referenceId: String(referenceId || ""), status: "sent", providerMessageId: data?.messages?.[0]?.id, templateName, attempts: 1, sentAt: new Date() });
    return true;
  } catch (error) {
    await NotificationDelivery.create({ channel: "whatsapp", event, recipientType: "patient", recipient, referenceType: "appointment", referenceId: String(referenceId || ""), status: "failed", templateName, error: error instanceof Error ? error.message : String(error), attempts: 1 });
    return false;
  }
}

function ticketUrl(appointmentId) {
  const base = String(process.env.NEXT_PUBLIC_CLIENT_URL || process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
  const secret = process.env.APPOINTMENT_TICKET_SECRET || process.env.JWT_SECRET || "development-ticket-secret-change-me";
  const id = String(appointmentId);
  const token = crypto.createHmac("sha256", secret).update(id).digest("hex");
  return `${base}/api/appointments/${encodeURIComponent(id)}/ticket?token=${token}`;
}

async function sendAppointmentReminderWhatsApp(appointment, reminderType) {
  const is24h = reminderType === "24h";
  return sendWhatsAppTemplate({
    to: appointment.phone,
    event: is24h ? "appointment_reminder_24h" : "appointment_reminder_1h",
    referenceId: appointment._id,
    templateName: is24h
      ? (process.env.WHATSAPP_TEMPLATE_REMINDER_24H || "tgc_appointment_reminder_24h")
      : (process.env.WHATSAPP_TEMPLATE_REMINDER_1H || "tgc_appointment_reminder_1h"),
    parameters: [appointment.name, String(appointment._id), appointment.service, appointment.doctor, appointment.date, appointment.timeSlot, ticketUrl(appointment._id)],
  });
}

module.exports = { sendWhatsAppTemplate, sendAppointmentReminderWhatsApp };

import connectDB from "@/lib/db";
import NotificationDelivery from "@/lib/models/NotificationDelivery";
import { normalizeIndianWhatsAppNumber } from "./phone";

export type WhatsAppTemplateParameter = string;

type SendTemplateInput = {
  to: string;
  event: string;
  recipientType: "patient" | "admin";
  referenceType: "appointment" | "contact" | "system";
  referenceId?: string;
  templateName: string;
  parameters: WhatsAppTemplateParameter[];
};

function configured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export async function sendWhatsAppTemplate(input: SendTemplateInput) {
  const recipient = normalizeIndianWhatsAppNumber(input.to);

  if (!recipient) {
    await connectDB();
    await NotificationDelivery.create({ ...input, recipient: input.to, channel: "whatsapp", status: "skipped", error: "Invalid Indian WhatsApp number", attempts: 0 });
    return { success: false, skipped: true } as const;
  }

  if (!configured()) {
    console.warn(`WhatsApp skipped for ${input.event}: Meta Cloud API environment variables are missing.`);
    await connectDB();
    await NotificationDelivery.create({ ...input, recipient, channel: "whatsapp", status: "skipped", error: "WhatsApp integration is not configured", attempts: 0 });
    return { success: false, skipped: true } as const;
  }

  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0";
  const url = `https://graph.facebook.com/${apiVersion}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "template",
    template: {
      name: input.templateName,
      language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en" },
      components: input.parameters.length
        ? [{ type: "body", parameters: input.parameters.map((text) => ({ type: "text", text: String(text || "-").slice(0, 1024) })) }]
        : [],
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await response.json()) as { messages?: Array<{ id?: string }>; error?: { message?: string; code?: number } };
    if (!response.ok) throw new Error(data.error?.message || `Meta API returned ${response.status}`);

    const providerMessageId = data.messages?.[0]?.id;
    await connectDB();
    await NotificationDelivery.create({ channel: "whatsapp", event: input.event, recipientType: input.recipientType, recipient, referenceType: input.referenceType, referenceId: input.referenceId, status: "sent", providerMessageId, templateName: input.templateName, attempts: 1, sentAt: new Date() });
    return { success: true, providerMessageId } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown WhatsApp delivery error";
    await connectDB();
    await NotificationDelivery.create({ channel: "whatsapp", event: input.event, recipientType: input.recipientType, recipient, referenceType: input.referenceType, referenceId: input.referenceId, status: "failed", templateName: input.templateName, error: message, attempts: 1 });
    throw error;
  }
}

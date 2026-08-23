import { model, models, Schema, type Model } from "mongoose";

export type NotificationChannel = "whatsapp";
export type NotificationDeliveryStatus = "sent" | "failed" | "skipped";

export type NotificationDeliveryRecord = {
  channel: NotificationChannel;
  event: string;
  recipientType: "patient" | "admin";
  recipient: string;
  referenceType: "appointment" | "contact" | "system";
  referenceId?: string;
  status: NotificationDeliveryStatus;
  providerMessageId?: string;
  templateName?: string;
  error?: string;
  attempts: number;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const schema = new Schema<NotificationDeliveryRecord>({
  channel: { type: String, enum: ["whatsapp"], required: true, index: true },
  event: { type: String, required: true, trim: true, maxlength: 100, index: true },
  recipientType: { type: String, enum: ["patient", "admin"], required: true, index: true },
  recipient: { type: String, required: true, trim: true, maxlength: 30 },
  referenceType: { type: String, enum: ["appointment", "contact", "system"], required: true, index: true },
  referenceId: { type: String, trim: true, maxlength: 100, index: true },
  status: { type: String, enum: ["sent", "failed", "skipped"], required: true, index: true },
  providerMessageId: { type: String, trim: true, maxlength: 200 },
  templateName: { type: String, trim: true, maxlength: 200 },
  error: { type: String, trim: true, maxlength: 2000 },
  attempts: { type: Number, default: 1, min: 0 },
  sentAt: Date,
}, { timestamps: true, versionKey: false });

schema.index({ referenceType: 1, referenceId: 1, createdAt: -1 });
schema.index({ status: 1, createdAt: -1 });

const NotificationDelivery =
  (models.NotificationDelivery as Model<NotificationDeliveryRecord> | undefined) ||
  model<NotificationDeliveryRecord>("NotificationDelivery", schema);

export default NotificationDelivery;

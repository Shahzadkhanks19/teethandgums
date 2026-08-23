const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  channel: { type: String, enum: ["whatsapp"], required: true, index: true },
  event: { type: String, required: true, trim: true, index: true },
  recipientType: { type: String, enum: ["patient", "admin"], required: true, index: true },
  recipient: { type: String, required: true, trim: true },
  referenceType: { type: String, enum: ["appointment", "contact", "system"], required: true, index: true },
  referenceId: { type: String, trim: true, index: true },
  status: { type: String, enum: ["sent", "failed", "skipped"], required: true, index: true },
  providerMessageId: String,
  templateName: String,
  error: { type: String, maxlength: 2000 },
  attempts: { type: Number, default: 1 },
  sentAt: Date,
}, { timestamps: true, versionKey: false });

schema.index({ referenceType: 1, referenceId: 1, createdAt: -1 });
module.exports = mongoose.models.NotificationDelivery || mongoose.model("NotificationDelivery", schema);

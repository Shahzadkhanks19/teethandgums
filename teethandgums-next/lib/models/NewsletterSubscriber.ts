import { model, models, Schema, type Model } from "mongoose";

export type NewsletterSubscriberRecord = {
  email: string;
  status: "pending" | "subscribed" | "unsubscribed";
  source: string;
  confirmationToken: string;
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const newsletterSubscriberSchema = new Schema<NewsletterSubscriberRecord>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    status: { type: String, enum: ["pending", "subscribed", "unsubscribed"], default: "subscribed", index: true },
    source: { type: String, default: "blog", trim: true, maxlength: 80 },
    confirmationToken: { type: String, default: "", select: false },
    confirmedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

newsletterSubscriberSchema.index({ status: 1, createdAt: -1 });

const NewsletterSubscriber =
  (models.NewsletterSubscriber as Model<NewsletterSubscriberRecord> | undefined) ||
  model<NewsletterSubscriberRecord>("NewsletterSubscriber", newsletterSubscriberSchema);

export default NewsletterSubscriber;

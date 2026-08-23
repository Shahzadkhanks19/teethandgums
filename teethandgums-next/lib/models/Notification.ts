import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export type NotificationType = "appointment" | "contact";
export type NotificationPriority = "normal" | "important";

export type NotificationRecord = {
  title: string;
  message: string;
  type: NotificationType;
  referenceType: NotificationType;
  referenceId: Types.ObjectId;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationDocument =
  HydratedDocument<NotificationRecord>;

const notificationSchema = new Schema<NotificationRecord>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1_000,
    },
    type: {
      type: String,
      enum: ["appointment", "contact"],
      required: true,
      index: true,
    },
    referenceType: {
      type: String,
      enum: ["appointment", "contact"],
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ["normal", "important"],
      default: "normal",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({
  type: 1,
  referenceId: 1,
  createdAt: -1,
});

const Notification =
  (models.Notification as
    | Model<NotificationRecord>
    | undefined) ||
  model<NotificationRecord>(
    "Notification",
    notificationSchema,
  );

export default Notification;

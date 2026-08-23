import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type ActivityLogType =
  | "appointment"
  | "contact"
  | "availability"
  | "admin"
  | "blog"
  | "system";

export type ActivityLogRecord = {
  action: string;
  details: string;
  type: ActivityLogType;
  createdAt: Date;
  updatedAt: Date;
};

export type ActivityLogDocument =
  HydratedDocument<ActivityLogRecord>;

const activityLogSchema = new Schema<ActivityLogRecord>(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    details: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2_000,
    },
    type: {
      type: String,
      enum: [
        "appointment",
        "contact",
        "availability",
        "admin",
        "blog",
        "system",
      ],
      default: "system",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

const ActivityLog =
  (models.ActivityLog as Model<ActivityLogRecord> | undefined) ||
  model<ActivityLogRecord>("ActivityLog", activityLogSchema);

export default ActivityLog;

import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type BlockedSlotType = "day" | "slot";

export type BlockedSlotRecord = {
  date: string;
  timeSlot: string;
  type: BlockedSlotType;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BlockedSlotDocument =
  HydratedDocument<BlockedSlotRecord>;

const blockedSlotSchema = new Schema<BlockedSlotRecord>(
  {
    date: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Blocked date must use YYYY-MM-DD format",
      ],
    },
    timeSlot: {
      type: String,
      default: "",
      trim: true,
      maxlength: 80,
    },
    type: {
      type: String,
      enum: ["day", "slot"],
      required: true,
      index: true,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

blockedSlotSchema.index(
  { date: 1, type: 1, timeSlot: 1 },
  { unique: true },
);
blockedSlotSchema.index({ createdAt: -1 });

const BlockedSlot =
  (models.BlockedSlot as Model<BlockedSlotRecord> | undefined) ||
  model<BlockedSlotRecord>("BlockedSlot", blockedSlotSchema);

export default BlockedSlot;

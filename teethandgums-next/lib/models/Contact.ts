import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export type ContactStatus = "new" | "read" | "replied";
export type ContactReplyStatus = "sent" | "failed";

export type ContactReplyRecord = {
  _id?: Types.ObjectId;
  subject: string;
  message: string;
  sentTo: string;
  sentBy: string;
  status: ContactReplyStatus;
  sentAt: Date;
};

export type ContactRecord = {
  name: string;
  phone: string;
  email: string;
  message: string;
  status: ContactStatus;
  replies: ContactReplyRecord[];
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactDocument = HydratedDocument<ContactRecord>;

const contactReplySchema = new Schema<ContactReplyRecord>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5_000,
    },
    sentTo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    sentBy: {
      type: String,
      default: "Admin",
      trim: true,
      maxlength: 160,
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
    versionKey: false,
  },
);

const contactSchema = new Schema<ContactRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5_000,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
      index: true,
    },
    replies: {
      type: [contactReplySchema],
      default: [],
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact =
  (models.Contact as Model<ContactRecord> | undefined) ||
  model<ContactRecord>("Contact", contactSchema);

export default Contact;

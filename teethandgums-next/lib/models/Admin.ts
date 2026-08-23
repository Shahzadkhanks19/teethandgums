import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type AdminRecord = {
  email: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminDocument = HydratedDocument<AdminRecord>;

const adminSchema = new Schema<AdminRecord>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      default: "",
      select: false,
      index: true,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Admin =
  (models.Admin as Model<AdminRecord> | undefined) ||
  model<AdminRecord>("Admin", adminSchema);

export default Admin;

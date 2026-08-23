import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type ClinicSettingsRecord = {
  singletonKey: "clinic-settings";
  clinicName: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  address: string;
  googleMapsUrl: string;
  workingHours: string;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  adminNotificationEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  primaryColor: string;
  secondaryColor: string;
  emailFooter: string;
  appointmentEmailsEnabled: boolean;
  contactEmailsEnabled: boolean;
  reminderEmailsEnabled: boolean;
  adminNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ClinicSettingsDocument =
  HydratedDocument<ClinicSettingsRecord>;


const clinicSettingsSchema =
  new Schema<ClinicSettingsRecord>(
    {
      singletonKey: {
        type: String,
        default: "clinic-settings",
        immutable: true,
        unique: true,
        select: false,
      },
      clinicName: {
        type: String,
        default: "Teeth and Gums Care",
        trim: true,
        maxlength: 160,
      },
      logoUrl: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2_000,
      },
      phone: {
        type: String,
        default: "+91 98298 24356",
        trim: true,
        maxlength: 30,
      },
      whatsapp: {
        type: String,
        default: "+91 98298 24356",
        trim: true,
        maxlength: 30,
      },
      address: {
        type: String,
        default: "Jodhpur, Rajasthan",
        trim: true,
        maxlength: 500,
      },
      googleMapsUrl: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2_000,
      },
      workingHours: {
        type: String,
        default:
          "Mon-Sat: 10:00 AM - 3:00 PM, 5:30 PM - 8:30 PM | Sun: 10:00 AM - 3:00 PM",
        trim: true,
        maxlength: 500,
      },
      senderName: {
        type: String,
        default: "Teeth and Gums Care",
        trim: true,
        maxlength: 160,
      },
      senderEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
        maxlength: 254,
        match: [
          /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please provide a valid email address",
        ],
      },
      replyToEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
        maxlength: 254,
        match: [
          /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please provide a valid email address",
        ],
      },
      adminNotificationEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
        maxlength: 254,
        match: [
          /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please provide a valid email address",
        ],
      },
      smtpHost: {
        type: String,
        default: "",
        trim: true,
        maxlength: 255,
      },
      smtpPort: {
        type: Number,
        default: 587,
        min: 1,
        max: 65_535,
      },
      smtpUser: {
        type: String,
        default: "",
        trim: true,
        maxlength: 254,
      },
      smtpPassword: {
        type: String,
        default: "",
        select: false,
      },
      smtpSecure: {
        type: Boolean,
        default: false,
      },
      primaryColor: {
        type: String,
        required: true,
        default: "#2563eb",
        match: [
          /^#[0-9a-fA-F]{6}$/,
          "Color must use a six-digit hexadecimal value",
        ],
      },
      secondaryColor: {
        type: String,
        required: true,
        default: "#172554",
        match: [
          /^#[0-9a-fA-F]{6}$/,
          "Color must use a six-digit hexadecimal value",
        ],
      },
      emailFooter: {
        type: String,
        default: "Teeth and Gums Care, Jodhpur",
        trim: true,
        maxlength: 1_000,
      },
      appointmentEmailsEnabled: {
        type: Boolean,
        default: true,
      },
      contactEmailsEnabled: {
        type: Boolean,
        default: true,
      },
      reminderEmailsEnabled: {
        type: Boolean,
        default: true,
      },
      adminNotificationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  );

const ClinicSettings =
  (models.ClinicSettings as
    | Model<ClinicSettingsRecord>
    | undefined) ||
  model<ClinicSettingsRecord>(
    "ClinicSettings",
    clinicSettingsSchema,
  );

export default ClinicSettings;

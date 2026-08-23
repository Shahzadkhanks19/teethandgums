import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rescheduled"
  | "cancelled";

export type AppointmentRecord = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  doctor: string;
  message: string;
  status: AppointmentStatus;
  rescheduleReason: string;
  cancelReason: string;
  reminder24hSent: boolean;
  reminder1hSent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentDocument =
  HydratedDocument<AppointmentRecord>;

const appointmentSchema = new Schema<AppointmentRecord>(
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
    service: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    date: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Appointment date must use YYYY-MM-DD format",
      ],
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    doctor: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rescheduled",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
    rescheduleReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    cancelReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    reminder24hSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    reminder1hSent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

appointmentSchema.index({ date: 1, timeSlot: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ createdAt: -1 });
appointmentSchema.index({ status: 1, createdAt: -1 });
appointmentSchema.index({
  date: 1,
  reminder24hSent: 1,
  reminder1hSent: 1,
});

const Appointment =
  (models.Appointment as Model<AppointmentRecord> | undefined) ||
  model<AppointmentRecord>("Appointment", appointmentSchema);

export default Appointment;

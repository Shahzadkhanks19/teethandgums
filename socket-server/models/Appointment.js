const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    service: String,
    date: String,
    timeSlot: String,
    doctor: String,
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rescheduled", "cancelled"],
      default: "pending",
    },
    rescheduleReason: {
      type: String,
      default: "",
    },
    cancelReason: {
      type: String,
      default: "",
    },
    reminder24hSent: {
      type: Boolean,
      default: false,
    },
    reminder1hSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
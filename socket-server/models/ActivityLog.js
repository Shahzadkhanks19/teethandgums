const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["appointment", "contact", "availability", "admin", "system"],
      default: "system",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);
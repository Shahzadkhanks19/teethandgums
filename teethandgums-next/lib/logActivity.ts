import connectDB from "@/lib/db";
import ActivityLog from "@/lib/models/ActivityLog";

export type ActivityLogType =
  | "appointment"
  | "contact"
  | "availability"
  | "admin"
  | "blog"
  | "system";

export default async function logActivity(
  action: string,
  details = "",
  type: ActivityLogType = "system",
): Promise<void> {
  try {
    await connectDB();

    await ActivityLog.create({
      action: action.trim(),
      details: details.trim(),
      type,
    });
  } catch (error) {
    console.error("Activity log creation failed:", error);
  }
}

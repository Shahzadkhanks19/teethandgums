import connectDB from "@/lib/db";
import Notification from "@/lib/models/Notification";

type NotificationType = "appointment" | "contact";
type NotificationPriority = "normal" | "important";

type CreateNotificationProps = {
  title: string;
  message: string;
  type: NotificationType;
  referenceType: NotificationType;
  referenceId: string;
  priority?: NotificationPriority;
};

export default async function createNotification({
  title,
  message,
  type,
  referenceType,
  referenceId,
  priority = "normal",
}: CreateNotificationProps) {
  try {
    await connectDB();

    return await Notification.create({
      title: title.trim(),
      message: message.trim(),
      type,
      referenceType,
      referenceId,
      priority,
    });
  } catch (error) {
    console.error("Notification creation failed:", error);
    return null;
  }
}

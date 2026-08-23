import sendEmail from "@/lib/sendEmail";

type ReminderType = "24h" | "1h";

type ReminderAppointment = {
  name: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  doctor: string;
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] as string,
  );
}

export default async function sendReminderEmail(
  appointment: ReminderAppointment,
  reminderType: ReminderType,
): Promise<void> {
  const is24h = reminderType === "24h";

  const subject = is24h
    ? "Appointment Reminder - Tomorrow - Teeth and Gums Care"
    : "Appointment Reminder - 1 Hour Left - Teeth and Gums Care";

  const heading = is24h
    ? "Your appointment is tomorrow"
    : "Your appointment is in 1 hour";

  const name = escapeHtml(appointment.name);
  const service = escapeHtml(appointment.service);
  const date = escapeHtml(appointment.date);
  const timeSlot = escapeHtml(appointment.timeSlot);
  const doctor = escapeHtml(appointment.doctor);

  await sendEmail({
    to: appointment.email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;background:#f8fbff;padding:24px;">
        <div style="max-width:620px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5eef8;">
          <div style="background:#0d47a1;color:#fff;padding:22px;">
            <h2 style="margin:0;">${heading}</h2>
            <p style="margin:8px 0 0;">Teeth and Gums Care</p>
          </div>

          <div style="padding:24px;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>This is a friendly reminder for your upcoming dental appointment.</p>

            <div style="background:#f0f7ff;border-radius:14px;padding:18px;margin:20px 0;">
              <h3 style="margin-top:0;color:#0d47a1;">Appointment Details</h3>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${timeSlot}</p>
              <p><strong>Doctor:</strong> ${doctor}</p>
            </div>

            <div style="background:#fff7ed;border-radius:14px;padding:18px;margin:20px 0;">
              <h3 style="margin-top:0;color:#b45309;">Please Note</h3>
              <p style="margin-bottom:0;">Please arrive 5–10 minutes before your scheduled appointment.</p>
            </div>

            <p><strong>Clinic Address:</strong><br />E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute, Jodhpur, Rajasthan</p>
            <p><strong>Phone:</strong> +91 98298 24356</p>
            <br />
            <p>Regards,<br /><strong>Teeth and Gums Care</strong></p>
          </div>
        </div>
      </div>
    `,
  });
}

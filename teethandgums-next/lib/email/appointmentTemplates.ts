import {
  createSiteUrl,
  emailLayout,
  type EmailInfoItem,
} from "./layout";

export type AppointmentEmailData = {
  name: string;
  email?: string;
  phone?: string;
  service: string;
  doctor: string;
  date: string;
  timeSlot: string;
  message?: string;
  reason?: string;
};

function appointmentItems(
  data: AppointmentEmailData,
): EmailInfoItem[] {
  return [
    {
      label: "Patient Name",
      value: data.name,
      icon: "👤",
    },
    {
      label: "Service",
      value: data.service,
      icon: "🦷",
    },
    {
      label: "Doctor",
      value: data.doctor || "No preference",
      icon: "🩺",
    },
    {
      label: "Date",
      value: data.date,
      icon: "📅",
    },
    {
      label: "Time",
      value: data.timeSlot,
      icon: "🕒",
    },
    ...(data.phone
      ? [
          {
            label: "Phone",
            value: data.phone,
            icon: "📞",
          },
        ]
      : []),
    ...(data.email
      ? [
          {
            label: "Email",
            value: data.email,
            icon: "✉️",
          },
        ]
      : []),
  ];
}

export function patientAppointmentReceivedEmail(
  data: AppointmentEmailData,
): string {
  return emailLayout({
    title: "Appointment Request Received",
    previewText:
      "Your appointment request has been received.",
    badge: "Appointment Request",
    badgeTone: "blue",
    heading: "We have received your appointment request!",
    greeting: `Dear ${data.name},`,
    heroIcon: "📋",
    heroTone: "blue",
    body:
      "Thank you for choosing Teeth and Gums Care. Your appointment request has been submitted successfully.\n\nOur clinic team will review your request and confirm the appointment shortly. Please keep your phone available in case our team needs to contact you.",
    infoTitle: "Appointment Details",
    infoItems: appointmentItems(data),
    boxes: [
      {
        title: "Important Note",
        tone: "blue",
        content:
          "This is a request confirmation only. Your appointment will be final after clinic confirmation.",
      },
    ],
  });
}

export function adminNewAppointmentEmail(
  data: AppointmentEmailData,
): string {
  return emailLayout({
    title: "New Appointment Request",
    previewText:
      "A new appointment request has been submitted.",
    badge: "New Appointment Alert",
    badgeTone: "blue",
    heading: "New appointment request received!",
    greeting: "Admin Alert,",
    heroIcon: "🔔",
    heroTone: "blue",
    body: `${data.name} has submitted a new appointment request from the website.`,
    infoTitle: "Appointment Summary",
    infoItems: appointmentItems(data),
    boxes: [
      {
        title: "Patient Message",
        tone: "slate",
        content: data.message || "No message provided.",
      },
    ],
    primaryButton: {
      label: "Open Admin Dashboard",
      url: createSiteUrl("/admin/dashboard/appointments"),
      variant: "primary",
    },
  });
}

export function patientAppointmentConfirmedEmail(
  data: AppointmentEmailData,
): string {
  return emailLayout({
    title: "Appointment Confirmed",
    previewText:
      "Your dental appointment has been confirmed.",
    badge: "Appointment Confirmed",
    badgeTone: "green",
    heading: "Your appointment is confirmed!",
    greeting: `Dear ${data.name},`,
    heroIcon: "✅",
    heroTone: "green",
    body:
      "Great news! Your appointment has been confirmed by our clinic team.\n\nPlease arrive a few minutes before your scheduled time. If you need to reschedule or cancel, kindly contact the clinic in advance.",
    infoTitle: "Confirmed Appointment",
    infoItems: appointmentItems(data),
  });
}

export function patientAppointmentCancelledEmail(
  data: AppointmentEmailData,
): string {
  return emailLayout({
    title: "Appointment Cancelled",
    previewText:
      "Your dental appointment has been cancelled.",
    badge: "Appointment Cancelled",
    badgeTone: "red",
    heading: "Your appointment has been cancelled",
    greeting: `Dear ${data.name},`,
    heroIcon: "❌",
    heroTone: "red",
    body:
      "We regret to inform you that your appointment has been cancelled by the clinic team.",
    infoTitle: "Cancelled Appointment",
    infoItems: appointmentItems(data),
    boxes: [
      {
        title: "Reason",
        tone: "red",
        content: data.reason || "No reason provided.",
      },
    ],
    footerNote:
      "You can contact the clinic to book a new appointment at a suitable time.",
  });
}

export function patientAppointmentRescheduledEmail(
  data: AppointmentEmailData,
): string {
  return emailLayout({
    title: "Appointment Rescheduled",
    previewText:
      "Your dental appointment has been rescheduled.",
    badge: "Appointment Rescheduled",
    badgeTone: "orange",
    heading: "Your appointment has been rescheduled",
    greeting: `Dear ${data.name},`,
    heroIcon: "📆",
    heroTone: "orange",
    body:
      "Your appointment timing has been updated by our clinic team. Please check the updated appointment details below.",
    infoTitle: "Updated Appointment Details",
    infoItems: appointmentItems(data),
    boxes: [
      {
        title: "Reason",
        tone: "orange",
        content: data.reason || "No reason provided.",
      },
    ],
  });
}

export function patientAppointmentReminderEmail(
  data: AppointmentEmailData,
): string {
  return emailLayout({
    title: "Appointment Reminder",
    previewText:
      "Reminder for your upcoming dental appointment.",
    badge: "Appointment Reminder",
    badgeTone: "purple",
    heading: "Reminder for your upcoming appointment",
    greeting: `Dear ${data.name},`,
    heroIcon: "🔔",
    heroTone: "purple",
    body:
      "This is a friendly reminder for your upcoming appointment with us.\n\nPlease reach the clinic on time. If you are unable to visit, kindly contact us in advance.",
    infoTitle: "Appointment Details",
    infoItems: appointmentItems(data),
  });
}

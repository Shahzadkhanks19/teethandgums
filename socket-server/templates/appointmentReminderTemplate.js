const {
  emailLayout,
} = require("./emailLayout");

function appointmentReminderEmail(
  appointment,
  reminderType,
) {
  const is24h = reminderType === "24h";

  return emailLayout({
    title: is24h
      ? "Appointment Reminder - Tomorrow"
      : "Appointment Reminder - 1 Hour Left",

    previewText: is24h
      ? "Your dental appointment is tomorrow."
      : "Your dental appointment is in 1 hour.",

    badge: is24h
      ? "24 Hour Reminder"
      : "1 Hour Reminder",

    badgeTone: is24h ? "blue" : "purple",

    heading: is24h
      ? "Your appointment is tomorrow"
      : "Your appointment is in 1 hour",

    greeting: `Dear ${appointment.name},`,

    heroIcon: is24h ? "📅" : "⏰",
    heroTone: is24h ? "blue" : "purple",

    body:
      "This is a friendly reminder for your upcoming dental appointment with Teeth and Gums Care.\n\nPlease arrive 5–10 minutes before your scheduled appointment time. If you are unable to visit, kindly contact the clinic in advance.",

    infoTitle: "Appointment Details",

    infoItemsList: [
      {
        label: "Patient Name",
        value: appointment.name,
        icon: "👤",
      },
      {
        label: "Service",
        value: appointment.service,
        icon: "🦷",
      },
      {
        label: "Doctor",
        value:
          appointment.doctor ||
          "No preference",
        icon: "🩺",
      },
      {
        label: "Date",
        value: appointment.date,
        icon: "📅",
      },
      {
        label: "Time",
        value: appointment.timeSlot,
        icon: "🕒",
      },
    ],

    footerNote:
      "Please ignore this reminder if you have already contacted the clinic regarding this appointment.",
  });
}

module.exports = {
  appointmentReminderEmail,
};

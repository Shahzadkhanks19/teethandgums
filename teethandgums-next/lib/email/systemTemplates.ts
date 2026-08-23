import { emailLayout } from "./layout";

export function smtpTestEmail(clinicName: string): string {
  return emailLayout({
    title: "SMTP Configuration Successful",
    previewText:
      "Congratulations! Your SMTP configuration is working correctly.",
    badge: "SMTP Test",
    badgeTone: "green",
    heading: "Email Configuration Successful",
    greeting: "Hello Administrator,",
    heroIcon: "📧",
    heroTone: "green",
    body:
      "Congratulations! Your SMTP configuration has been verified successfully.\n\nYour clinic is now ready to send professional branded emails for appointments, contact replies, password resets and all future notifications.",
    infoTitle: "Verification Results",
    infoItems: [
      {
        label: "Status",
        value: "SMTP Connected Successfully",
        icon: "✅",
      },
      {
        label: "Email Service",
        value: "Ready",
        icon: "📨",
      },
      {
        label: "Clinic",
        value: clinicName.trim() || "Teeth and Gums Care",
        icon: "🏥",
      },
    ],
    boxes: [
      {
        title: "Everything is Ready",
        tone: "green",
        content:
          "Patients will now receive professionally branded emails whenever appointments are booked, confirmed, cancelled, rescheduled or when your clinic replies to contact enquiries.",
      },
    ],
    showContactButtons: false,
    footerNote:
      "This is a system-generated email from the Admin Dashboard.",
  });
}

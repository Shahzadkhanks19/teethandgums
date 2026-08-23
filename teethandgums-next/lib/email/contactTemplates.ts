import {
  createSiteUrl,
  emailLayout,
} from "./layout";

export type ContactEmailData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  replyMessage?: string;
};

export function adminNewContactEmail(
  data: ContactEmailData,
): string {
  return emailLayout({
    title: "New Contact Message",
    previewText:
      "A new contact message has been submitted.",
    badge: "New Contact Message",
    badgeTone: "purple",
    heading: "New contact message received",
    greeting: "Admin Alert,",
    heroIcon: "✉️",
    heroTone: "blue",
    body: `${data.name} has contacted you through the website.`,
    infoTitle: "Contact Details",
    infoItems: [
      {
        label: "Name",
        value: data.name,
        icon: "👤",
      },
      {
        label: "Email",
        value: data.email,
        icon: "✉️",
      },
      {
        label: "Phone",
        value: data.phone,
        icon: "📞",
      },
    ],
    boxes: [
      {
        title: "Message",
        tone: "slate",
        content: data.message || "No message provided.",
      },
    ],
    primaryButton: {
      label: "Open Admin Dashboard",
      url: createSiteUrl("/admin/dashboard/contacts"),
      variant: "primary",
    },
  });
}

export function patientContactReplyEmail(
  data: ContactEmailData,
): string {
  return emailLayout({
    title: "Response from Teeth and Gums Care",
    previewText:
      "Our clinic team has replied to your message.",
    badge: "Response From Clinic",
    badgeTone: "green",
    heading: "Our clinic team has replied to you",
    greeting: `Dear ${data.name},`,
    heroIcon: "💬",
    heroTone: "green",
    body:
      "Thank you for contacting Teeth and Gums Care. Our reply is shared below.",
    boxes: [
      {
        title: "Your Message",
        tone: "slate",
        content: data.message || "No message provided.",
      },
      {
        title: "Our Reply",
        tone: "green",
        content:
          data.replyMessage || "No reply message provided.",
      },
    ],
    infoTitle: "Contact Summary",
    infoItems: [
      {
        label: "Name",
        value: data.name,
        icon: "👤",
      },
      {
        label: "Email",
        value: data.email,
        icon: "✉️",
      },
      {
        label: "Phone",
        value: data.phone,
        icon: "📞",
      },
    ],
    footerNote:
      "For urgent dental concerns, please call the clinic directly or use the WhatsApp button above.",
  });
}

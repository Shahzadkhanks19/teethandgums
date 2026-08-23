import type { Metadata } from "next";
import ContactsClient from "./ContactsClient";

export const metadata: Metadata = {
  title: "Contact Messages | Admin Dashboard",
  description:
    "View, search, reply to, manage and export patient contact messages for Teeth and Gums Care.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
    nosnippet: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
};

export default function ContactsPage() {
  return <ContactsClient />;
}
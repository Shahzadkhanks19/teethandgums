import type { Metadata } from "next";
import AppointmentClient from "./AppointmentClient";

export const metadata: Metadata = {
  title: "Appointments | Admin Dashboard",
  description:
    "Manage dental appointments, confirmations, cancellations, reschedules, exports and patient bookings for Teeth and Gums Care.",
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

export default function AppointmentsPage() {
  return <AppointmentClient />;
}
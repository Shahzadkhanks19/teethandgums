import type { Metadata } from "next";

import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description:
    "Private Teeth and Gums Care admin dashboard for appointments, messages, activity logs, and clinic operations.",
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

export default function AdminDashboardPage() {
  return <DashboardClient />;
}

import type { Metadata } from "next";
import ActivityLogsClient from "./ActivityLogsClient";

export const metadata: Metadata = {
  title: "Activity Logs | Admin Dashboard",
  description:
    "Monitor system events, admin actions, appointment updates, contact activities and availability changes for Teeth and Gums Care.",
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

export default function ActivityLogsPage() {
  return <ActivityLogsClient />;
}
import type { Metadata } from "next";
import AvailabilityClient from "./AvailabilityClient";

export const metadata: Metadata = {
  title: "Availability | Admin Dashboard",
  description:
    "Manage clinic availability, block full days or appointment slots, and control the booking schedule for Teeth and Gums Care.",
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

export default function AvailabilityPage() {
  return <AvailabilityClient />;
}
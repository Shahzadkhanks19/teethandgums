import type { Metadata } from "next";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Teeth and Gums Care Admin",
  },
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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </AdminGuard>
  );
}

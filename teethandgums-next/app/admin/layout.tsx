import type { Metadata } from "next";

import "./auth.css";

export const metadata: Metadata = {
  title: {
    default: "Admin",
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

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="admin-auth-scope">{children}</div>;
}

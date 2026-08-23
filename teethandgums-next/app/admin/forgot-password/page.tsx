import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password | Admin",
  description:
    "Request a secure admin password reset link for Teeth and Gums Care dashboard.",
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

function AuthPageFallback() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading secure admin page"
      className="grid min-h-[100dvh] place-items-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
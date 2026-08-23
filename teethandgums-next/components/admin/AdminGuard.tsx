"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminIcon from "./AdminIcon";
type AdminSessionResponse = {
  success?: boolean;
};

export default function AdminGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const verifyAdmin = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as
          | AdminSessionResponse
          | null;

        if (!response.ok || !data?.success) {
          localStorage.removeItem("adminEmail");
          toast.error("Session expired. Please login again.");
          router.replace("/admin/login");
          return;
        }

        setChecking(false);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        toast.error("Unable to verify admin session");
        router.replace("/admin/login");
      }
    };

    void verifyAdmin();

    return () => controller.abort();
  }, [router]);

  if (checking) {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="admin-dashboard-loading"
      >
        <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin" />
        <p>Verifying admin session...</p>
      </section>
    );
  }

  return <>{children}</>;
}
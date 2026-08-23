"use client";

import { useEffect, useState } from "react";

import AdminRealtime from "@/components/admin/AdminRealtime";
import { AdminNotificationsProvider } from "@/components/admin/AdminNotificationsProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminDashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setSidebarCollapsed(
        localStorage.getItem("adminSidebarCollapsed") === "true",
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "adminSidebarCollapsed",
      String(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  return (
    <AdminNotificationsProvider>
      <AdminRealtime />

      <div className="min-h-[100dvh] bg-[#f4f8ff]">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          />
        )}

        <div
          className={`min-h-[100dvh] transition-[padding] duration-300 ${
            sidebarCollapsed ? "lg:pl-[92px]" : "lg:pl-[280px]"
          }`}
        >
          <main
            id="main-content"
            tabIndex={-1}
            className="px-4 py-4 outline-none sm:px-6 lg:px-8 lg:py-6"
          >
            <AdminTopbar
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() =>
                setSidebarCollapsed((previous) => !previous)
              }
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />

            <div className="mt-6">{children}</div>
          </main>
        </div>
      </div>
    </AdminNotificationsProvider>
  );
}

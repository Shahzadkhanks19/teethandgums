"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";

import AdminIcon from "./AdminIcon";
type AdminSidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "fa-solid fa-chart-line",
  },
  {
    label: "Appointments",
    href: "/admin/dashboard/appointments",
    icon: "fa-solid fa-calendar-check",
  },
  {
    label: "Messages",
    href: "/admin/dashboard/contacts",
    icon: "fa-solid fa-envelope",
  },
  {
    label: "Activity Logs",
    href: "/admin/dashboard/activity",
    icon: "fa-solid fa-clock-rotate-left",
  },
  {
    label: "Availability",
    href: "/admin/dashboard/availability",
    icon: "fa-solid fa-calendar-xmark",
  },
  {
    label: "Blog Manager",
    href: "/admin/dashboard/blogs",
    icon: "fa-solid fa-layer-group",
  },
  {
    label: "Blog Categories",
    href: "/admin/dashboard/blogs/categories",
    icon: "fa-solid fa-folder-open",
  },
  {
    label: "Blog Tags",
    href: "/admin/dashboard/blogs/tags",
    icon: "fa-solid fa-link",
  },
  {
    label: "Settings",
    href: "/admin/dashboard/settings",
    icon: "fa-solid fa-gear",
  },
];

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", {
        method: "POST",
      });
    } catch {
      // ignore logout failure
    }

    localStorage.removeItem("adminEmail");
    toast.success("Logged out successfully");
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside
      aria-label="Admin sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-blue-950 via-blue-800 to-blue-600 text-white shadow-2xl shadow-blue-950/20 transition-[width,transform] duration-300
      ${collapsed ? "lg:w-[92px]" : "lg:w-[280px]"}
      ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      w-[280px]`}
    >
      <div className="flex min-h-[86px] items-center gap-4 border-b border-white/10 px-5">
        <div className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl shadow-lg">
          <AdminIcon aria-hidden="true" className="fa-solid fa-tooth" />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black">Admin Panel</h2>
            <p className="truncate text-xs font-semibold text-white/75">
              Teeth and Gums Care
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onCloseMobile}
          className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <AdminIcon aria-hidden="true" className="fa-solid fa-xmark" />
        </button>
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {navItems.map((item) => {
          const isBlogManager = item.href === "/admin/dashboard/blogs";
          const isBlogChild =
            pathname.startsWith("/admin/dashboard/blogs/categories") ||
            pathname.startsWith("/admin/dashboard/blogs/tags");
          const isActive =
            pathname === item.href ||
            (isBlogManager
              ? pathname.startsWith(`${item.href}/`) && !isBlogChild
              : item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link prefetch={false}
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 font-black transition duration-300 ${
                isActive
                  ? "bg-white text-blue-700 shadow-lg shadow-blue-950/20"
                  : "text-white/85 hover:bg-white/12 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <AdminIcon aria-hidden="true" className={`${item.icon} text-lg`} />

              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-4 rounded-2xl bg-white/12 px-4 py-3.5 font-black text-white transition hover:bg-white/20 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <AdminIcon aria-hidden="true" className="fa-solid fa-right-from-bracket text-lg" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
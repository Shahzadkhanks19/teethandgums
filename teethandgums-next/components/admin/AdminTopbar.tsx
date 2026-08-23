"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import {
  type AdminNotification,
  useAdminNotifications,
} from "@/components/admin/AdminNotificationsProvider";

import AdminIcon from "./AdminIcon";
type AdminTopbarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

type Filter = "all" | "unread" | "appointment" | "contact";

const titleMap: Record<
  string,
  { title: string; subtitle: string; icon: string }
> = {
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of appointments, messages and clinic activity.",
    icon: "fa-solid fa-chart-line",
  },
  "/admin/dashboard/appointments": {
    title: "Appointments",
    subtitle: "Manage appointment requests, confirmations and reschedules.",
    icon: "fa-solid fa-calendar-check",
  },
  "/admin/dashboard/contacts": {
    title: "Messages",
    subtitle: "Manage contact form messages and patient enquiries.",
    icon: "fa-solid fa-envelope",
  },
  "/admin/dashboard/activity": {
    title: "Activity Logs",
    subtitle: "Track important admin and system actions.",
    icon: "fa-solid fa-clock-rotate-left",
  },
  "/admin/dashboard/availability": {
    title: "Availability",
    subtitle: "Block clinic days or specific appointment slots.",
    icon: "fa-solid fa-calendar-xmark",
  },
  "/admin/dashboard/settings": {
    title: "Settings",
    subtitle: "Manage admin account, security and clinic settings.",
    icon: "fa-solid fa-gear",
  },
};

const filters: Array<{ value: Filter; label: string; icon: string }> = [
  { value: "all", label: "All", icon: "fa-solid fa-layer-group" },
  { value: "unread", label: "Unread", icon: "fa-solid fa-circle" },
  {
    value: "appointment",
    label: "Appointments",
    icon: "fa-solid fa-calendar-check",
  },
  { value: "contact", label: "Messages", icon: "fa-solid fa-envelope" },
];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function timeAgo(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

function groupName(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return "Older";
}

function routeFor(item: AdminNotification) {
  const params = new URLSearchParams({
    notification: item.id,
    highlight: item.referenceId,
  });

  return item.referenceType === "appointment"
    ? `/admin/dashboard/appointments?${params.toString()}`
    : `/admin/dashboard/contacts?${params.toString()}`;
}


function subscribeToMobileQuery(callback: () => void) {
  const mediaQuery = window.matchMedia("(max-width: 767px)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getServerMobileSnapshot() {
  return false;
}

export default function AdminTopbar({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<HTMLButtonElement | null>(null);
  const previousUnread = useRef(0);

  const [adminEmail, setAdminEmail] = useState("Admin");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmClear, setConfirmClear] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [bellPulse, setBellPulse] = useState(false);
  const isMobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );

  const {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    clearNotifications,
  } = useAdminNotifications();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setAdminEmail(localStorage.getItem("adminEmail") || "Admin");
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const connected = () => setRealtimeConnected(true);
    const disconnected = () => setRealtimeConnected(false);

    window.addEventListener("adminRealtimeConnected", connected);
    window.addEventListener("adminRealtimeDisconnected", disconnected);

    return () => {
      window.removeEventListener("adminRealtimeConnected", connected);
      window.removeEventListener("adminRealtimeDisconnected", disconnected);
    };
  }, []);

  useEffect(() => {
    const previous = previousUnread.current;
    previousUnread.current = unreadCount;

    if (unreadCount <= previous) return;

    const frameId = window.requestAnimationFrame(() => {
      setBellPulse(true);
    });

    const timer = window.setTimeout(() => {
      setBellPulse(false);
    }, 900);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timer);
    };
  }, [unreadCount]);

  useEffect(() => {
    if (!open) return;

    const outside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        bellRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setConfirmClear(false);
    };

    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setConfirmClear(false);
        bellRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", outside);
    document.addEventListener("touchstart", outside);
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("touchstart", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  // Lock mobile scroll when layout overlay breaks out open
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  const page = useMemo(
    () => titleMap[pathname] || titleMap["/admin/dashboard"],
    [pathname],
  );

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [],
  );

  const visible = useMemo(() => {
    if (filter === "unread") return notifications.filter((item) => !item.read);
    if (filter === "appointment" || filter === "contact") {
      return notifications.filter((item) => item.type === filter);
    }
    return notifications;
  }, [filter, notifications]);

  const groups = useMemo(() => {
    const result: Record<"Today" | "Yesterday" | "Older", AdminNotification[]> =
      {
        Today: [],
        Yesterday: [],
        Older: [],
      };

    visible.forEach((item) => {
      result[groupName(item.createdAt) as keyof typeof result].push(item);
    });

    return result;
  }, [visible]);

  const summary = useMemo(() => {
    const now = new Date();
    const todayItems = notifications.filter((item) =>
      sameDay(new Date(item.createdAt), now),
    );

    return {
      total: todayItems.length,
      appointments: todayItems.filter(
        (item) => item.type === "appointment",
      ).length,
      contacts: todayItems.filter((item) => item.type === "contact").length,
    };
  }, [notifications]);

  const openNotification = async (item: AdminNotification) => {
    if (!item.read) await markRead(item.id);
    setOpen(false);
    setConfirmClear(false);
    router.push(routeFor(item));
  };

  const clearAll = async () => {
    if (await clearNotifications()) {
      setConfirmClear(false);
      toast.success("All notifications cleared");
    }
  };

  // Re-usable inner dropdown layout content
  const renderPanelContent = () => (
    <m.div
      ref={panelRef}
      id="admin-notification-panel"
      role="dialog"
      aria-labelledby="notification-title"
      aria-modal={isMobile || undefined}
      initial={reduceMotion ? false : { opacity: 0, scale: isMobile ? 1 : 0.96, y: isMobile ? 24 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: isMobile ? 1 : 0.97, y: isMobile ? 24 : 10 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 360, damping: 30 }
      }
      className={`flex flex-col overflow-hidden bg-white border border-blue-100 shadow-[0_30px_100px_rgba(15,23,42,.28)] ${
        isMobile
          ? "fixed inset-x-4 bottom-4 top-4 z-[9999] rounded-[30px] max-h-[calc(100dvh-2rem)]"
          : "absolute right-0 top-14 w-[480px] max-h-[min(540px,calc(100dvh-140px))] rounded-[30px] z-[80]"
      }`}
    >
      {/* Top Section Header */}
      <div className="shrink-0 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="notification-title" className="text-xl font-black">
                Notification Center
              </h2>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black ${
                realtimeConnected ? "border-green-300/30 bg-green-400/15 text-green-100" : "border-amber-300/30 bg-amber-400/15 text-amber-100"
              }`}>
                <span className={`h-2 w-2 animate-pulse rounded-full ${realtimeConnected ? "bg-green-300" : "bg-amber-300"}`} />
                {realtimeConnected ? "Live" : "Reconnecting"}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-blue-100">
              Persistent appointments and patient messages
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white hover:text-blue-700"
            aria-label="Close notification center"
          >
            <AdminIcon className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Summary label="Today" value={summary.total} />
          <Summary label="Appointments" value={summary.appointments} />
          <Summary label="Messages" value={summary.contacts} />
        </div>
      </div>

      {/* Controls Action Box Options */}
      <div className="shrink-0 border-b border-blue-100 p-4 bg-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-slate-900">{unreadCount} unread</p>
            <p className="text-xs font-semibold text-slate-500">{notifications.length} total</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (await markAllRead()) {
                    toast.success("All notifications marked as read");
                  }
                }}
                className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClear((value) => !value)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                aria-label="Clear all notifications"
              >
                <AdminIcon className="fa-solid fa-trash-can" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {confirmClear && (
            <m.div
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-black text-red-800">Clear all notifications?</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={clearAll} className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white">Yes, clear all</button>
                  <button type="button" onClick={() => setConfirmClear(false)} className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200">Cancel</button>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <div role="tablist" aria-label="Notification filters" className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-blue-50 p-1">
          {filters.map((item) => {
            const active = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.value)}
                className={`relative rounded-xl px-2 py-2.5 text-xs font-black ${
                  active ? "text-blue-700" : "text-slate-500 hover:text-blue-700"
                }`}
              >
                {active && (
                  <m.span layoutId="active-notification-filter" className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-blue-100" />
                )}
                <span className="relative z-10 flex items-center justify-center gap-1">
                  <AdminIcon className={item.icon} aria-hidden="true" />
                  <span className="ml-1.5 hidden sm:inline">{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Scroll View Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 p-3 min-h-0 [scrollbar-width:thin]">
        {loading ? (
          <Skeleton />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-black text-red-800">Could not load notifications</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button type="button" onClick={() => refreshNotifications()} className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-black text-white">Try again</button>
          </div>
        ) : visible.length === 0 ? (
          <Empty filter={filter} />
        ) : (
          (["Today", "Yesterday", "Older"] as const).map((group) => {
            const items = groups[group];
            if (!items.length) return null;
            return (
              <section key={group} className="mb-5 last:mb-0">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{group}</h3>
                  <span aria-hidden="true" className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="grid gap-2.5">
                  <AnimatePresence initial={false} mode="popLayout">
                    {items.map((item) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        reduceMotion={Boolean(reduceMotion)}
                        onOpen={() => openNotification(item)}
                        onRead={() => markRead(item.id)}
                        onDelete={async (event) => {
                          event.stopPropagation();
                          if (await deleteNotification(item.id)) {
                            toast.success("Notification deleted");
                          }
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Footer Strip */}
      <div className="shrink-0 flex items-center justify-between border-t border-blue-100 px-4 py-3 bg-white">
        <span className="text-xs font-bold text-slate-500">{realtimeConnected ? "Realtime updates active" : "Attempting to reconnect"}</span>
        <button type="button" onClick={() => refreshNotifications()} className="rounded-full px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-50 shrink-0">
          <AdminIcon className="fa-solid fa-rotate mr-2" aria-hidden="true" />Refresh
        </button>
      </div>
    </m.div>
  );

  return (
    <header className="rounded-[28px] border border-blue-100 bg-white/95 p-4 shadow-[0_18px_55px_rgba(37,99,235,.10)] backdrop-blur md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 lg:hidden"
            aria-label="Open admin sidebar"
          >
            <AdminIcon className="fa-solid fa-bars" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 lg:grid"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <AdminIcon aria-hidden="true" className={sidebarCollapsed ? "fa-solid fa-angles-right" : "fa-solid fa-angles-left"} />
          </button>

          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700">
              <AdminIcon className={page.icon} aria-hidden="true" />
              Admin Dashboard
            </div>
            <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-4xl">{page.title}</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500 md:text-base">{page.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center relative">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 font-bold text-slate-600">
            <AdminIcon className="fa-regular fa-calendar text-blue-600" aria-hidden="true" />
            <span>{today}</span>
          </div>

          <div className="relative">
            <m.button
              ref={bellRef}
              type="button"
              onClick={() => {
                setOpen((value) => !value);
                setConfirmClear(false);
              }}
              animate={bellPulse && !reduceMotion ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.08, 1] } : undefined}
              transition={{ duration: 0.75 }}
              className="relative grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={open}
              aria-controls="admin-notification-panel"
            >
              {unreadCount > 0 && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-2xl bg-blue-400/20" />}
              <AdminIcon className="fa-solid fa-bell" aria-hidden="true" />
              <AnimatePresence initial={false}>
                {unreadCount > 0 && (
                  <m.span
                    key={unreadCount}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-red-600 px-1.5 text-xs font-black text-white"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>

            <AnimatePresence>
              {open && (
                <>
                  {/* Backdrop Overlay trigger for mobile viewports */}
                  {isMobile && (
                    <m.button
                      type="button"
                      aria-label="Close notifications"
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[9990] bg-slate-950/45 backdrop-blur-sm"
                    />
                  )}
                  {/* Portaled on mobile, inline structural relative block on desktop */}
                  {isMobile ? createPortal(renderPanelContent(), document.body) : renderPanelContent()}
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="inline-flex min-w-0 items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 text-white">
              <AdminIcon className="fa-solid fa-user-shield" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Admin</p>
              <p className="truncate text-sm font-black text-slate-800">{adminEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
      <p className="text-[11px] font-bold text-blue-100">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function NotificationItem({
  item,
  reduceMotion,
  onOpen,
  onRead,
  onDelete,
}: {
  item: AdminNotification;
  reduceMotion: boolean;
  onOpen: () => void;
  onRead: () => Promise<boolean>;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const appointment = item.type === "appointment";

  return (
    <m.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.96 }}
      className={`group overflow-hidden rounded-[22px] border bg-white ${
        item.read ? "border-slate-200" : "border-blue-200 shadow-[0_14px_40px_rgba(37,99,235,.12)]"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full p-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-200"
      >
        <div className="flex gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white ${
            appointment ? "bg-gradient-to-br from-blue-600 to-blue-900" : "bg-gradient-to-br from-green-500 to-emerald-700"
          }`}>
            <AdminIcon className={appointment ? "fa-solid fa-calendar-check" : "fa-solid fa-envelope"} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-black text-slate-900">{item.title}</h4>
                  {item.priority === "important" && (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-700">Important</span>
                  )}
                </div>
                <p className="mt-1 line-clamp-3 text-sm font-semibold leading-6 text-slate-500">{item.message}</p>
              </div>
              {!item.read && (
                <m.span
                  animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-600"
                  aria-label="Unread"
                />
              )}
            </div>
            <p className="mt-3 text-xs font-black text-blue-700">{timeAgo(item.createdAt)}</p>
          </div>
        </div>
      </button>
      <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        {!item.read && (
          <button
            type="button"
            onClick={async (event) => {
              event.stopPropagation();
              await onRead();
            }}
            className="rounded-full bg-white px-3 py-2 text-[11px] font-black text-blue-700 ring-1 ring-blue-100 hover:bg-blue-600 hover:text-white"
          >
            Mark read
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-red-600 ring-1 ring-red-100 hover:bg-red-600 hover:text-white"
          aria-label={`Delete ${item.title}`}
        >
          <AdminIcon className="fa-solid fa-trash-can" aria-hidden="true" />
        </button>
      </div>
    </m.article>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="animate-pulse rounded-[22px] border border-slate-200 bg-white p-4">
          <div className="h-4 w-2/5 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function Empty({ filter }: { filter: Filter }) {
  const message =
    filter === "unread"
      ? "No unread notifications."
      : filter === "appointment"
        ? "No appointment notifications."
        : filter === "contact"
          ? "No message notifications."
          : "New appointments and messages will appear here.";

  return (
    <div className="rounded-[24px] border border-dashed border-blue-200 bg-white p-8 text-center">
      <AdminIcon aria-hidden="true" className="fa-solid fa-bell-slash text-3xl text-blue-600" />
      <p className="mt-4 font-black text-slate-800">Nothing to show</p>
      <p className="mt-2 text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}
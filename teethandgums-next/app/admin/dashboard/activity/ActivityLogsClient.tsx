"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import useRealtimeRefresh from "@/hooks/useRealtimeRefresh";
import { adminFetch } from "@/lib/adminFetch";

import AdminActionMenu from "@/components/admin/AdminActionMenu";
import AdminModal from "@/components/admin/AdminModal";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

import AdminIcon from "@/components/admin/AdminIcon";
type ActivityLog = {
  _id: string;
  action: string;
  details: string;
  type: "appointment" | "contact" | "availability" | "admin" | "system";
  createdAt: string;
};



type ActivityLogsResponse = {
  success?: boolean;
  message?: string;
  logs?: ActivityLog[];
  deletedCount?: number;
};

const filters = ["all", "appointment", "contact", "availability", "admin", "system"];

export default function ActivityLogsClient() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const fetchActivityLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch("/api/admin/activity-logs");
      const data = (await response.json().catch(() => null)) as
        | ActivityLogsResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch activity logs");
      }

      setLogs(data?.logs || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch activity logs";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            void fetchActivityLogs();
          }, { timeout: 900 })
        : globalThis.setTimeout(() => {
            void fetchActivityLogs();
          }, 120);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [fetchActivityLogs]);

  useRealtimeRefresh(fetchActivityLogs);

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => (filter === "all" ? true : log.type === filter))
      .filter((log) => {
        const search = searchTerm.trim().toLowerCase();

        return (
          log.action?.toLowerCase().includes(search) ||
          log.details?.toLowerCase().includes(search) ||
          log.type?.toLowerCase().includes(search)
        );
      });
  }, [logs, filter, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: logs.length,
      appointment: logs.filter((log) => log.type === "appointment").length,
      contact: logs.filter((log) => log.type === "contact").length,
      availability: logs.filter((log) => log.type === "availability").length,
      admin: logs.filter((log) => log.type === "admin").length,
      system: logs.filter((log) => log.type === "system").length,
    };
  }, [logs]);

  const deleteSingleLog = async () => {
    if (!deleteLogId) return;

    try {
      setActionLoading(true);

      const response = await adminFetch(`/api/admin/activity-logs/${deleteLogId}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as
        | ActivityLogsResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete activity log");
        return;
      }

      setLogs((prev) => prev.filter((log) => log._id !== deleteLogId));
      setDeleteLogId(null);

      toast.success("Activity log deleted successfully");
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const clearAllLogs = async () => {
    if (logs.length === 0) {
      toast.error("No activity logs to clear");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/activity-logs", {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as
        | ActivityLogsResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to clear activity logs");
        return;
      }

      setLogs([]);
      setShowClearAllModal(false);

      toast.success("All activity logs cleared successfully");
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <AdminLoadingState text="Loading activity logs..." />;
  }

  if (error) {
    return <AdminErrorState text={error} onRetry={fetchActivityLogs} />;
  }

  return (
    <>
      <section aria-labelledby="activity-logs-title" className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              System Timeline
            </span>

            <h1 id="activity-logs-title" className="mt-4 text-3xl font-black text-slate-900">
              Activity Logs
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              Track admin actions, appointment updates, contact replies,
              availability changes and system events.
            </p>
          </div>

          <button
            type="button"
            disabled={actionLoading || logs.length === 0}
            aria-busy={actionLoading}
            onClick={() => setShowClearAllModal(true)}
            className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? "Processing..." : "Clear All Logs"}
          </button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {[
            ["Total", stats.total],
            ["Appointments", stats.appointment],
            ["Contacts", stats.contact],
            ["Availability", stats.availability],
            ["Admin", stats.admin],
            ["System", stats.system],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-center"
            >
              <strong className="block text-2xl font-black text-blue-700">
                {value}
              </strong>
              <span className="mt-1 block text-xs font-black text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="relative">
            <AdminIcon aria-hidden="true" className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />

            <input
              type="text"
              aria-label="Search activity logs"
              autoComplete="off"
              placeholder="Search by action, details or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-4 pl-12 pr-4 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-5 py-2.5 text-sm font-black capitalize transition ${
                filter === item
                  ? "bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-200"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredLogs.length === 0 ? (
          <div className="mt-7">
            <AdminEmptyState text="No activity logs matching your filters." />
          </div>
        ) : (
          <div className="mt-7 grid gap-4">
            {filteredLogs.map((log) => (
              <article
                key={log._id}
                className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition motion-safe:hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(37,99,235,.10)]"
              >
                <div className="flex gap-4">
                  <div className="hidden flex-col items-center sm:flex">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                      <AdminIcon aria-hidden="true" className="fa-solid fa-bolt" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-black text-slate-900">
                          {log.action}
                        </h3>

                        <p className="mt-2 break-words leading-7 text-slate-500">
                          {log.details || "No details available"}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <AdminStatusBadge status={log.type} />

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                            {new Date(log.createdAt).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <AdminActionMenu
                        items={[
                          {
                            label: "Delete Log",
                            icon: "fa-solid fa-trash",
                            danger: true,
                            disabled: actionLoading,
                            onClick: () => setDeleteLogId(log._id),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {deleteLogId && (
        <AdminModal
          title="Delete Activity Log"
          description="This will permanently delete this activity record."
          icon="fa-solid fa-trash"
          tone="red"
          maxWidth="md"
          onClose={() => setDeleteLogId(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteLogId(null)}
                disabled={actionLoading}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={deleteSingleLog}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Delete Log"}
              </button>
            </div>
          }
        >
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-bold leading-7 text-slate-700">
              Are you sure you want to delete this activity log?
            </p>
          </div>
        </AdminModal>
      )}

      {showClearAllModal && (
        <AdminModal
          title="Clear All Activity Logs"
          description="This action cannot be undone."
          icon="fa-solid fa-triangle-exclamation"
          tone="red"
          maxWidth="md"
          onClose={() => setShowClearAllModal(false)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                disabled={actionLoading}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={clearAllLogs}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Clearing..." : "Clear All Logs"}
              </button>
            </div>
          }
        >
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-bold leading-7 text-slate-700">
              Are you sure you want to clear all{" "}
              <strong>{logs.length}</strong> activity logs?
            </p>

            <p className="mt-3 text-sm font-black text-red-700">
              This action cannot be undone.
            </p>
          </div>
        </AdminModal>
      )}
    </>
  );
}
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
type BlockedSlot = {
  _id: string;
  date: string;
  timeSlot: string;
  type: "day" | "slot";
  reason: string;
  createdAt: string;
};



type AvailabilityApiResponse = {
  success?: boolean;
  message?: string;
  blockedSlots?: BlockedSlot[];
  blockedSlot?: BlockedSlot;
  unavailableSlots?: string[];
};

const morningSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
];

const eveningSlots = [
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
];

function getTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function AvailabilityClient() {
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [blockedSlotsForDate, setBlockedSlotsForDate] = useState<string[]>([]);

  const [availabilityData, setAvailabilityData] = useState({
    date: "",
    timeSlot: "",
    type: "day",
    reason: "",
  });

  const [removeBlockItem, setRemoveBlockItem] = useState<BlockedSlot | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const isSunday = availabilityData.date
    ? new Date(`${availabilityData.date}T00:00:00`).getDay() === 0
    : false;

  const availableSlots = useMemo(
    () => (isSunday ? morningSlots : [...morningSlots, ...eveningSlots]),
    [isSunday],
  );

  const filteredAvailableSlots = availableSlots.filter(
    (slot) => !blockedSlotsForDate.includes(slot),
  );

  const stats = useMemo(() => {
    return {
      blockedDays: blockedSlots.filter((slot) => slot.type === "day").length,
      blockedTimeSlots: blockedSlots.filter((slot) => slot.type === "slot")
        .length,
      todayBlocks: blockedSlots.filter((slot) => slot.date === getTodayDate())
        .length,
      total: blockedSlots.length,
    };
  }, [blockedSlots]);

  const fetchBlockedSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch("/api/admin/blocked-slots");
      const data = (await response.json().catch(() => null)) as
        | AvailabilityApiResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch blocked slots");
      }

      setBlockedSlots(data?.blockedSlots || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch blocked slots";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlockedSlotsForDate = useCallback(async (date: string) => {
    if (!date) {
      setBlockedSlotsForDate([]);
      return;
    }

    try {
      const response = await adminFetch(
        `/api/blocked-slots/unavailable?date=${date}`,
      );

      const data = (await response.json().catch(() => null)) as
        | AvailabilityApiResponse
        | null;

      if (data?.success) {
        setBlockedSlotsForDate(data.unavailableSlots || []);
      }
    } catch {
      setBlockedSlotsForDate([]);
    }
  }, []);

  useEffect(() => {
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            void fetchBlockedSlots();
          }, { timeout: 900 })
        : globalThis.setTimeout(() => {
            void fetchBlockedSlots();
          }, 120);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [fetchBlockedSlots]);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      void fetchBlockedSlotsForDate(availabilityData.date);
    }, 120);

    return () => globalThis.clearTimeout(timer);
  }, [availabilityData.date, fetchBlockedSlotsForDate]);

  const refreshAvailability = useCallback(async () => {
    await fetchBlockedSlots();
    await fetchBlockedSlotsForDate(availabilityData.date);
  }, [
    availabilityData.date,
    fetchBlockedSlots,
    fetchBlockedSlotsForDate,
  ]);

  useRealtimeRefresh(refreshAvailability);

  const blockAvailability = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!availabilityData.date) {
      toast.error("Please select a date");
      return;
    }

    if (availabilityData.type === "slot" && !availabilityData.timeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/blocked-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availabilityData),
      });

      const data = (await response.json().catch(() => null)) as
        | AvailabilityApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to block availability");
        return;
      }

      const createdBlockedSlot = data?.blockedSlot;

      if (!createdBlockedSlot) {
        toast.error("Blocked slot data was not returned");
        return;
      }

      setBlockedSlots((prev) => [createdBlockedSlot, ...prev]);
      toast.success("Availability blocked successfully");

      setAvailabilityData({
        date: "",
        timeSlot: "",
        type: "day",
        reason: "",
      });

      setBlockedSlotsForDate([]);
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const removeBlockedSlot = async () => {
    if (!removeBlockItem) return;

    try {
      setActionLoading(true);

      const response = await adminFetch(
        `/api/admin/blocked-slots/${removeBlockItem._id}`,
        {
          method: "DELETE",
        },
      );

      const data = (await response.json().catch(() => null)) as
        | AvailabilityApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to remove block");
        return;
      }

      setBlockedSlots((prev) =>
        prev.filter((slot) => slot._id !== removeBlockItem._id),
      );

      setRemoveBlockItem(null);
      toast.success("Block removed successfully");

      if (availabilityData.date) {
        fetchBlockedSlotsForDate(availabilityData.date);
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <AdminLoadingState text="Loading availability..." />;
  }

  if (error) {
    return <AdminErrorState text={error} onRetry={fetchBlockedSlots} />;
  }

  return (
    <>
      <section aria-labelledby="availability-management-title" className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              Clinic Schedule Control
            </span>

            <h1 id="availability-management-title" className="mt-4 text-3xl font-black text-slate-900">
              Availability Management
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              Block full clinic days or specific appointment slots for holidays,
              doctor leave, emergencies, or internal schedule changes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[460px]">
            {[
              ["Total", stats.total],
              ["Days", stats.blockedDays],
              ["Slots", stats.blockedTimeSlots],
              ["Today", stats.todayBlocks],
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
        </div>

        <form
          onSubmit={blockAvailability}
          aria-busy={actionLoading}
          className="mt-8 rounded-[24px] border border-blue-100 bg-blue-50/40 p-5"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="availability-date" className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
                Date
              </label>

              <input
                id="availability-date"
                name="date"
                type="date"
                required
                min={getTodayDate()}
                value={availabilityData.date}
                onChange={(event) =>
                  setAvailabilityData((prev) => ({
                    ...prev,
                    date: event.target.value,
                    timeSlot: "",
                  }))
                }
                className="w-full rounded-2xl border border-blue-100 bg-white p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
                Block Type
              </label>

              <select
                value={availabilityData.type}
                onChange={(event) =>
                  setAvailabilityData((prev) => ({
                    ...prev,
                    type: event.target.value,
                    timeSlot: "",
                  }))
                }
                className="w-full rounded-2xl border border-blue-100 bg-white p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="day">Full Day</option>
                <option value="slot">Specific Slot</option>
              </select>
            </div>

            {availabilityData.type === "slot" && (
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
                  Time Slot
                </label>

                <select
                  value={availabilityData.timeSlot}
                  onChange={(event) =>
                    setAvailabilityData((prev) => ({
                      ...prev,
                      timeSlot: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-blue-100 bg-white p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Slot</option>

                  {filteredAvailableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700">
                Reason
              </label>

              <input
                type="text"
                placeholder="Example: Doctor leave, clinic holiday, emergency..."
                maxLength={500}
                value={availabilityData.reason}
                onChange={(event) =>
                  setAvailabilityData((prev) => ({
                    ...prev,
                    reason: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-blue-100 bg-white p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          {availabilityData.type === "slot" &&
            availabilityData.date &&
            filteredAvailableSlots.length === 0 && (
              <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700">
                <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation mr-2" />
                No available slots left for this date.
              </div>
            )}

          {isSunday && availabilityData.date && (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-white p-4 text-sm font-bold leading-7 text-blue-700">
              <AdminIcon aria-hidden="true" className="fa-solid fa-circle-info mr-2" />
              Sunday has morning slots only: 10:00 AM – 3:00 PM.
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 px-7 py-4 font-black text-white shadow-lg shadow-blue-200 transition motion-safe:hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {actionLoading ? (
                <>
                  <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
                  Blocking...
                </>
              ) : (
                <>
                  <AdminIcon aria-hidden="true" className="fa-solid fa-calendar-xmark mr-2" />
                  Block Availability
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-7 rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-slate-900">
            Blocked Slots / Days
          </h2>

          <p className="mt-2 leading-7 text-slate-500">
            Review and remove existing schedule blocks.
          </p>
        </div>

        {blockedSlots.length === 0 ? (
          <AdminEmptyState text="No blocked availability found." />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    {[
                      "Date",
                      "Type",
                      "Time Slot",
                      "Reason",
                      "Created",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="bg-blue-50 px-4 py-4 text-left text-sm font-black text-blue-800 first:rounded-l-2xl last:rounded-r-2xl"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {blockedSlots.map((slot) => (
                    <tr key={slot._id}>
                      <td className="rounded-l-2xl border-y border-l border-blue-100 bg-white px-4 py-4 font-black text-slate-900">
                        {slot.date}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4">
                        <AdminStatusBadge
                          status={slot.type === "day" ? "cancelled" : "pending"}
                        />
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {slot.timeSlot || "Full Day"}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {slot.reason || "No reason"}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {new Date(slot.createdAt).toLocaleDateString()}
                      </td>

                      <td className="rounded-r-2xl border-y border-r border-blue-100 bg-white px-4 py-4">
                        <AdminActionMenu
                          items={[
                            {
                              label: "Remove Block",
                              icon: "fa-solid fa-trash",
                              danger: true,
                              disabled: actionLoading,
                              onClick: () => setRemoveBlockItem(slot),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {blockedSlots.map((slot) => (
                <article
                  key={slot._id}
                  className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {slot.date}
                      </h3>

                      <p className="mt-1 font-semibold text-slate-500">
                        {slot.timeSlot || "Full Day"}
                      </p>
                    </div>

                    <AdminActionMenu
                      items={[
                        {
                          label: "Remove Block",
                          icon: "fa-solid fa-trash",
                          danger: true,
                          disabled: actionLoading,
                          onClick: () => setRemoveBlockItem(slot),
                        },
                      ]}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <AdminStatusBadge
                      status={slot.type === "day" ? "cancelled" : "pending"}
                    />

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                      {new Date(slot.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {slot.reason || "No reason"}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {removeBlockItem && (
        <AdminModal
          title="Remove Availability Block"
          description="This will reopen the selected day or time slot."
          icon="fa-solid fa-calendar-check"
          tone="red"
          maxWidth="md"
          onClose={() => setRemoveBlockItem(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setRemoveBlockItem(null)}
                disabled={actionLoading}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={removeBlockedSlot}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Removing..." : "Remove Block"}
              </button>
            </div>
          }
        >
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-bold leading-7 text-slate-700">
              Are you sure you want to remove the block for{" "}
              <strong>{removeBlockItem.date}</strong>{" "}
              {removeBlockItem.timeSlot
                ? `at ${removeBlockItem.timeSlot}`
                : "for the full day"}
              ?
            </p>
          </div>
        </AdminModal>
      )}
    </>
  );
}
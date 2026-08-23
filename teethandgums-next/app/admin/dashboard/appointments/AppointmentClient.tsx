"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";
import useRealtimeRefresh from "@/hooks/useRealtimeRefresh";

import AdminModal from "@/components/admin/AdminModal";
import AdminActionMenu from "@/components/admin/AdminActionMenu";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

import ViewAppointmentModal from "@/components/admin/modals/ViewAppointmentModal";
import CancelAppointmentModal from "@/components/admin/modals/CancelAppointmentModal";
import RescheduleAppointmentModal from "@/components/admin/modals/RescheduleAppointmentModal";
import DeleteAppointmentModal from "@/components/admin/modals/DeleteAppointmentModal";

import AdminIcon from "@/components/admin/AdminIcon";
type Appointment = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  doctor: string;
  message?: string;
  status: "pending" | "confirmed" | "rescheduled" | "cancelled";
  cancelReason?: string;
  rescheduleReason?: string;
  createdAt: string;
};



type AppointmentApiResponse = {
  success?: boolean;
  message?: string;
  appointments?: Appointment[];
  appointment?: Appointment;
  deletedCount?: number;
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

const allSlots = [...morningSlots, ...eveningSlots];

const filters = ["all", "pending", "confirmed", "rescheduled", "cancelled"];

export default function AppointmentClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);

  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [viewAppointment, setViewAppointment] = useState<Appointment | null>(
    null,
  );
  const [cancelAppointment, setCancelAppointment] =
    useState<Appointment | null>(null);
  const [rescheduleAppointmentItem, setRescheduleAppointmentItem] =
    useState<Appointment | null>(null);
  const [deleteAppointmentItem, setDeleteAppointmentItem] =
    useState<Appointment | null>(null);

  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch("/api/admin/appointments");
      const data = (await response.json().catch(() => null)) as
        | AppointmentApiResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch appointments");
      }

      setAppointments(data?.appointments || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch appointments";

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
            void fetchAppointments();
          }, { timeout: 900 })
        : globalThis.setTimeout(() => {
            void fetchAppointments();
          }, 120);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [fetchAppointments]);

  useRealtimeRefresh(fetchAppointments);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((item) =>
        appointmentFilter === "all" ? true : item.status === appointmentFilter,
      )
      .filter((item) => {
        const search = searchTerm.trim().toLowerCase();

        return (
          item.name?.toLowerCase().includes(search) ||
          item.phone?.toLowerCase().includes(search) ||
          item.email?.toLowerCase().includes(search) ||
          item.service?.toLowerCase().includes(search) ||
          item.doctor?.toLowerCase().includes(search) ||
          item.status?.toLowerCase().includes(search)
        );
      });
  }, [appointments, appointmentFilter, searchTerm]);

  const selectedAll =
    filteredAppointments.length > 0 &&
    selectedAppointments.length === filteredAppointments.length;

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed")
        .length,
      rescheduled: appointments.filter((item) => item.status === "rescheduled")
        .length,
      cancelled: appointments.filter((item) => item.status === "cancelled")
        .length,
    };
  }, [appointments]);

  const toggleAppointmentSelection = (id: string) => {
    setSelectedAppointments((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAllAppointments = () => {
    setSelectedAppointments(
      selectedAll ? [] : filteredAppointments.map((item) => item._id),
    );
  };

  const updateAppointmentStatus = async (
    id: string,
    status: Appointment["status"],
    reason = "",
  ) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(`/api/admin/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          cancelReason: reason,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | AppointmentApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to update appointment");
        return;
      }

      const updatedAppointment = data?.appointment;

      setAppointments((prev) =>
        prev.map((item) =>
          item._id === id
            ? updatedAppointment || { ...item, status, cancelReason: reason }
            : item,
        ),
      );

      setViewAppointment((prev) =>
        prev?._id === id
          ? updatedAppointment || { ...prev, status, cancelReason: reason }
          : prev,
      );

      toast.success(`Appointment ${status} successfully`);

      setCancelAppointment(null);
      setCancelReason("");
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const rescheduleAppointment = async (id: string) => {
    if (!rescheduleData.date || !rescheduleData.timeSlot) {
      toast.error("Please select new date and time slot");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch(
        `/api/admin/appointments/${id}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: rescheduleData.date,
            timeSlot: rescheduleData.timeSlot,
            rescheduleReason: rescheduleData.reason,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | AppointmentApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to reschedule appointment");
        return;
      }

      const updatedAppointment = data?.appointment;

      if (!updatedAppointment) {
        toast.error("Updated appointment data was not returned");
        return;
      }

      setAppointments((prev) =>
        prev.map((item) => (item._id === id ? updatedAppointment : item)),
      );

      setViewAppointment((prev) =>
        prev?._id === id ? updatedAppointment : prev,
      );

      toast.success("Appointment rescheduled successfully");

      setRescheduleAppointmentItem(null);
      setRescheduleData({
        date: "",
        timeSlot: "",
        reason: "",
      });
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as
        | AppointmentApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete appointment");
        return;
      }

      setAppointments((prev) => prev.filter((item) => item._id !== id));
      setSelectedAppointments((prev) => prev.filter((itemId) => itemId !== id));
      setViewAppointment((prev) => (prev?._id === id ? null : prev));
      setDeleteAppointmentItem(null);

      toast.success("Appointment deleted successfully");
    } catch {
      toast.error("Server error");
    } finally {
      setActionLoading(false);
    }
  };

  const bulkDeleteSelectedAppointments = async (confirmed = false) => {
    if (selectedAppointments.length === 0) {
      toast.error("Please select appointments first");
      return;
    }

    if (!confirmed) {
      setBulkDeleteModal(true);
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/appointments/bulk/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedAppointments }),
      });

      const data = (await response.json().catch(() => null)) as
        | AppointmentApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete selected appointments");
        return;
      }

      setAppointments((prev) =>
        prev.filter((item) => !selectedAppointments.includes(item._id)),
      );

      setSelectedAppointments([]);
      setBulkDeleteModal(false);

      toast.success(data?.message || "Selected appointments deleted");
    } catch {
      toast.error("Server error");
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    if (filteredAppointments.length === 0) {
      toast.error("No appointments to export");
      return;
    }

    const rows = filteredAppointments.map((item) => ({
      Name: item.name,
      Phone: item.phone,
      Email: item.email,
      Service: item.service,
      Date: item.date,
      Time: item.timeSlot,
      Doctor: item.doctor,
      Status: item.status,
    }));

    const csvContent = [
      Object.keys(rows[0]).join(","),
      ...rows.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value || "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = "appointments.csv";
    link.click();
    URL.revokeObjectURL(objectUrl);

    toast.success("Appointments CSV exported");
  };

  const exportExcel = async () => {
    if (filteredAppointments.length === 0) {
      toast.error("No appointments to export");
      return;
    }

    const rows = filteredAppointments.map((item) => ({
      Name: item.name,
      Phone: item.phone,
      Email: item.email,
      Service: item.service,
      Date: item.date,
      Time: item.timeSlot,
      Doctor: item.doctor,
      Status: item.status,
    }));

    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    XLSX.writeFile(workbook, "appointments.xlsx");

    toast.success("Appointments Excel exported");
  };

  const exportPDF = async () => {
    if (filteredAppointments.length === 0) {
      toast.error("No appointments to export");
      return;
    }

    const [{ default: jsPDF }, { default: autoTable }] =
      await Promise.all([import("jspdf"), import("jspdf-autotable")]);

    const doc = new jsPDF();

    doc.text("Appointments Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["Name", "Phone", "Service", "Date", "Time", "Doctor", "Status"]],
      body: filteredAppointments.map((item) => [
        item.name,
        item.phone,
        item.service,
        item.date,
        item.timeSlot,
        item.doctor,
        item.status,
      ]),
    });

    doc.save("appointments.pdf");

    toast.success("Appointments PDF exported");
  };

  if (loading) {
    return <AdminLoadingState text="Loading appointments..." />;
  }

  if (error) {
    return <AdminErrorState text={error} onRetry={fetchAppointments} />;
  }

  return (
    <>
      <section aria-labelledby="appointments-manager-title" className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              Appointment Manager
            </span>

            <h1 id="appointments-manager-title" className="mt-4 text-3xl font-black text-slate-900">
              All Appointments
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              Manage bookings, confirmations, reschedules, cancellations and
              exports.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:min-w-[520px]">
            {[
              ["Total", stats.total],
              ["Pending", stats.pending],
              ["Confirmed", stats.confirmed],
              ["Rescheduled", stats.rescheduled],
              ["Cancelled", stats.cancelled],
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

        <div className="mt-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1">
            <AdminIcon aria-hidden="true" className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />

            <input
              type="text"
              placeholder="Search by name, phone, email, service, doctor or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-4 pl-12 pr-4 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportCSV}
              className="rounded-2xl bg-blue-50 px-5 py-3 font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              CSV
            </button>

            <button
              type="button"
              onClick={exportExcel}
              className="rounded-2xl bg-green-50 px-5 py-3 font-black text-green-700 transition hover:bg-green-600 hover:text-white"
            >
              Excel
            </button>

            <button
              type="button"
              onClick={exportPDF}
              className="rounded-2xl bg-red-50 px-5 py-3 font-black text-red-700 transition hover:bg-red-600 hover:text-white"
            >
              PDF
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {filters.map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setAppointmentFilter(status)}
              className={`rounded-full px-5 py-2.5 text-sm font-black capitalize transition ${
                appointmentFilter === status
                  ? "bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-200"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 font-black text-slate-700">
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={toggleSelectAllAppointments}
              className="h-5 w-5 accent-blue-600"
            />
            Select All ({filteredAppointments.length})
          </label>

          <button
            type="button"
            disabled={selectedAppointments.length === 0 || actionLoading}
            onClick={() => bulkDeleteSelectedAppointments(false)}
            className="rounded-2xl bg-slate-900 px-5 py-3 font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete Selected ({selectedAppointments.length})
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="mt-7">
            <AdminEmptyState text="No appointments matching your filters." />
          </div>
        ) : (
          <>
            <div className="mt-7 hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px] border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    {[
                      "Select",
                      "Patient",
                      "Phone",
                      "Email",
                      "Service",
                      "Date",
                      "Time",
                      "Doctor",
                      "Status",
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
                  {filteredAppointments.map((item) => (
                    <tr key={item._id} className="group">
                      <td className="rounded-l-2xl border-y border-l border-blue-100 bg-white px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.includes(item._id)}
                          onChange={() => toggleAppointmentSelection(item._id)}
                          className="h-5 w-5 accent-blue-600"
                        />
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-black text-slate-900">
                        {item.name}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.phone}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.email}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.service}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.date}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.timeSlot}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.doctor}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4">
                        <AdminStatusBadge status={item.status} />
                      </td>

                      <td className="rounded-r-2xl border-y border-r border-blue-100 bg-white px-4 py-4">
                        <AdminActionMenu
                          items={[
                            {
                              label: "View Details",
                              icon: "fa-solid fa-eye",
                              onClick: () => setViewAppointment(item),
                            },
                            {
                              label: "Confirm",
                              icon: "fa-solid fa-circle-check",
                              hidden: item.status !== "pending",
                              disabled: actionLoading,
                              onClick: () =>
                                updateAppointmentStatus(item._id, "confirmed"),
                            },
                            {
                              label: "Reschedule",
                              icon: "fa-solid fa-calendar-days",
                              hidden: item.status === "cancelled",
                              disabled: actionLoading,
                              onClick: () => {
                                setRescheduleAppointmentItem(item);
                                setRescheduleData({
                                  date: item.date,
                                  timeSlot: item.timeSlot,
                                  reason: "",
                                });
                              },
                            },
                            {
                              label: "Cancel",
                              icon: "fa-solid fa-ban",
                              hidden: item.status === "cancelled",
                              disabled: actionLoading,
                              danger: true,
                              onClick: () => setCancelAppointment(item),
                            },
                            {
                              label: "Delete",
                              icon: "fa-solid fa-trash",
                              danger: true,
                              disabled: actionLoading,
                              onClick: () => setDeleteAppointmentItem(item),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7 grid gap-4 lg:hidden">
              {filteredAppointments.map((item) => (
                <article
                  key={item._id}
                  className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAppointments.includes(item._id)}
                        onChange={() => toggleAppointmentSelection(item._id)}
                        className="mt-1 h-5 w-5 accent-blue-600"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {item.service}
                        </p>
                      </div>
                    </div>

                    <AdminActionMenu
                      items={[
                        {
                          label: "View Details",
                          icon: "fa-solid fa-eye",
                          onClick: () => setViewAppointment(item),
                        },
                        {
                          label: "Confirm",
                          icon: "fa-solid fa-circle-check",
                          hidden: item.status !== "pending",
                          disabled: actionLoading,
                          onClick: () =>
                            updateAppointmentStatus(item._id, "confirmed"),
                        },
                        {
                          label: "Reschedule",
                          icon: "fa-solid fa-calendar-days",
                          hidden: item.status === "cancelled",
                          disabled: actionLoading,
                          onClick: () => {
                            setRescheduleAppointmentItem(item);
                            setRescheduleData({
                              date: item.date,
                              timeSlot: item.timeSlot,
                              reason: "",
                            });
                          },
                        },
                        {
                          label: "Cancel",
                          icon: "fa-solid fa-ban",
                          hidden: item.status === "cancelled",
                          disabled: actionLoading,
                          danger: true,
                          onClick: () => setCancelAppointment(item),
                        },
                        {
                          label: "Delete",
                          icon: "fa-solid fa-trash",
                          danger: true,
                          disabled: actionLoading,
                          onClick: () => setDeleteAppointmentItem(item),
                        },
                      ]}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
                    <p>
                      <strong className="text-slate-900">Phone:</strong>{" "}
                      {item.phone}
                    </p>

                    <p>
                      <strong className="text-slate-900">Email:</strong>{" "}
                      {item.email}
                    </p>

                    <p>
                      <strong className="text-slate-900">Date:</strong>{" "}
                      {item.date} at {item.timeSlot}
                    </p>

                    <p>
                      <strong className="text-slate-900">Doctor:</strong>{" "}
                      {item.doctor}
                    </p>
                  </div>

                  <div className="mt-4">
                    <AdminStatusBadge status={item.status} />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {viewAppointment && (
        <ViewAppointmentModal
          appointment={viewAppointment}
          onClose={() => setViewAppointment(null)}
        />
      )}

      {cancelAppointment && (
        <CancelAppointmentModal
          appointment={cancelAppointment}
          cancelReason={cancelReason}
          actionLoading={actionLoading}
          onReasonChange={setCancelReason}
          onClose={() => {
            setCancelAppointment(null);
            setCancelReason("");
          }}
          onConfirm={() =>
            updateAppointmentStatus(
              cancelAppointment._id,
              "cancelled",
              cancelReason,
            )
          }
        />
      )}

      {rescheduleAppointmentItem && (
        <RescheduleAppointmentModal
          appointment={rescheduleAppointmentItem}
          date={rescheduleData.date}
          timeSlot={rescheduleData.timeSlot}
          reason={rescheduleData.reason}
          slots={allSlots}
          actionLoading={actionLoading}
          onChange={(field, value) =>
            setRescheduleData((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
          onClose={() => {
            setRescheduleAppointmentItem(null);
            setRescheduleData({
              date: "",
              timeSlot: "",
              reason: "",
            });
          }}
          onConfirm={() => rescheduleAppointment(rescheduleAppointmentItem._id)}
        />
      )}

      {deleteAppointmentItem && (
        <DeleteAppointmentModal
          appointment={deleteAppointmentItem}
          actionLoading={actionLoading}
          onClose={() => setDeleteAppointmentItem(null)}
          onConfirm={() => deleteAppointment(deleteAppointmentItem._id)}
        />
      )}

      {bulkDeleteModal && (
        <AdminModal
          title="Delete Selected Appointments"
          description="This action cannot be undone."
          icon="fa-solid fa-trash"
          tone="red"
          maxWidth="md"
          onClose={() => setBulkDeleteModal(false)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBulkDeleteModal(false)}
                disabled={actionLoading}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Close
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => bulkDeleteSelectedAppointments(true)}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          }
        >
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-bold leading-7 text-slate-700">
              Are you sure you want to delete{" "}
              <strong>{selectedAppointments.length}</strong> selected
              appointment(s)?
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
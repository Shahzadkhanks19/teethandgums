"use client";

import AdminModal from "@/components/admin/AdminModal";

import AdminIcon from "@/components/admin/AdminIcon";
type Appointment = {
  _id: string;
  name: string;
};

export default function RescheduleAppointmentModal({
  appointment,
  date,
  timeSlot,
  reason,
  slots,
  actionLoading,
  onChange,
  onClose,
  onConfirm,
}: {
  appointment: Appointment;
  date: string;
  timeSlot: string;
  reason: string;
  slots: string[];
  actionLoading: boolean;
  onChange: (field: "date" | "timeSlot" | "reason", value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return (
    <AdminModal
      title="Reschedule Appointment"
      description="Select a new date and time slot for this appointment."
      icon="fa-solid fa-calendar-days"
      tone="blue"
      maxWidth="lg"
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Close
          </button>

          <button
            type="button"
            disabled={
              actionLoading ||
              !date ||
              !timeSlot ||
              !reason.trim()
            }
            aria-busy={actionLoading}
            onClick={onConfirm}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
                Rescheduling...
              </>
            ) : (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-calendar-days mr-2" />
                Reschedule
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-bold text-slate-600">Patient</p>
          <p className="mt-1 text-xl font-black text-blue-700">
            {appointment.name}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="reschedule-appointment-date"
              className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700"
            >
              New Date
            </label>

            <input
              id="reschedule-appointment-date"
              name="date"
              type="date"
              required
              autoFocus
              min={today}
              value={date}
              onChange={(e) => onChange("date", e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-blue-50/40 p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="reschedule-appointment-time"
              className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700"
            >
              New Time Slot
            </label>

            <select
              id="reschedule-appointment-time"
              name="timeSlot"
              required
              value={timeSlot}
              onChange={(e) => onChange("timeSlot", e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-blue-50/40 p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select Slot</option>

              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="reschedule-appointment-reason"
            className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700"
          >
            Reschedule Reason
          </label>

          <textarea
            id="reschedule-appointment-reason"
            name="reason"
            rows={3}
            required
            maxLength={500}
            autoComplete="off"
            value={reason}
            onChange={(e) => onChange("reason", e.target.value)}
            placeholder="Reason for rescheduling..."
            aria-describedby="reschedule-reason-count"
            className="w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/40 p-4 leading-7 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <p
            id="reschedule-reason-count"
            className="mt-2 text-right text-xs font-bold text-slate-500"
          >
            {reason.length}/500
          </p>
        </div>

        <div
          role="note"
          className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700"
        >
          <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation mr-2" />
          Reschedule email will automatically be sent to the patient.
        </div>
      </div>
    </AdminModal>
  );
}
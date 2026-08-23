"use client";

import AdminModal from "@/components/admin/AdminModal";

import AdminIcon from "@/components/admin/AdminIcon";
type Appointment = {
  _id: string;
  name: string;
};

export default function CancelAppointmentModal({
  appointment,
  cancelReason,
  actionLoading,
  onReasonChange,
  onClose,
  onConfirm,
}: {
  appointment: Appointment;
  cancelReason: string;
  actionLoading: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AdminModal
      title="Cancel Appointment"
      description="Cancel this appointment and notify the patient by email."
      icon="fa-solid fa-ban"
      tone="red"
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
            disabled={actionLoading || !cancelReason.trim()}
            aria-busy={actionLoading}
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
                Cancelling...
              </>
            ) : (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-ban mr-2" />
                Cancel Appointment
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-bold text-slate-600">Patient</p>
          <p className="mt-1 text-xl font-black text-red-700">
            {appointment.name}
          </p>
        </div>

        <div>
          <label
            htmlFor="cancel-appointment-reason"
            className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700"
          >
            Cancellation Reason
          </label>

          <textarea
            id="cancel-appointment-reason"
            name="cancelReason"
            rows={3}
            required
            maxLength={500}
            autoFocus
            value={cancelReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter cancellation reason..."
            aria-describedby="cancel-reason-help"
            className="w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/40 p-4 leading-7 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <div
            id="cancel-reason-help"
            className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-500"
          >
            <span>Required before cancellation.</span>
            <span>{cancelReason.length}/500</span>
          </div>
        </div>

        <div
          role="note"
          className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700"
        >
          <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation mr-2" />
          Cancellation email will automatically be sent to the patient.
        </div>
      </div>
    </AdminModal>
  );
}
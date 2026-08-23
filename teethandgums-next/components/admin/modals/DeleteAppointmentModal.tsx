"use client";

import AdminModal from "@/components/admin/AdminModal";

import AdminIcon from "@/components/admin/AdminIcon";
type Appointment = {
  _id: string;
  name: string;
};

export default function DeleteAppointmentModal({
  appointment,
  actionLoading,
  onClose,
  onConfirm,
}: {
  appointment: Appointment;
  actionLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AdminModal
      title="Delete Appointment"
      description="This will permanently delete the appointment record."
      icon="fa-solid fa-trash"
      tone="red"
      maxWidth="md"
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
            disabled={actionLoading}
            aria-busy={actionLoading}
            onClick={onConfirm}
            className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLoading ? (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-trash mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-bold text-slate-600">
            Appointment will be deleted for
          </p>

          <p className="mt-1 text-xl font-black text-red-700">
            {appointment.name}
          </p>
        </div>

        <div role="alert" className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700">
          <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation mr-2" />
          This action cannot be undone.
        </div>
      </div>
    </AdminModal>
  );
}
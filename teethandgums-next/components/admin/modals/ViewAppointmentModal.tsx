"use client";

import toast from "react-hot-toast";

import AdminModal from "@/components/admin/AdminModal";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

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
  status: string;
  cancelReason?: string;
  rescheduleReason?: string;
  createdAt?: string;
};

async function copyValue(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copied");
  } catch {
    toast.error("Unable to copy");
  }
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-blue-50/50 p-3 sm:p-4">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm">
        <AdminIcon aria-hidden="true" className={icon} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
          {label}
        </p>
        <p className="mt-1 break-words font-bold leading-6 text-slate-700">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function ContactRow({
  label,
  value,
  icon,
  callHref,
  mailHref,
}: {
  label: string;
  value: string;
  icon: string;
  callHref?: string;
  mailHref?: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50/50 p-3 sm:p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm">
          <AdminIcon aria-hidden="true" className={icon} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            {label}
          </p>
          <p className="mt-1 break-all font-bold leading-6 text-slate-700">
            {value || "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {callHref && (
          <a
            href={callHref}
            aria-label={`Call ${value}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2.5 text-sm font-black text-white"
          >
            <AdminIcon aria-hidden="true" className="fa-solid fa-phone" />
            Call
          </a>
        )}

        {mailHref && (
          <a
            href={mailHref}
            aria-label={`Email ${value}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-black text-white"
          >
            <AdminIcon aria-hidden="true" className="fa-solid fa-envelope" />
            Email
          </a>
        )}

        <button
          type="button"
          onClick={() => void copyValue(value)}
          aria-label={`Copy ${label}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-black text-slate-700 ring-1 ring-blue-100"
        >
          <AdminIcon aria-hidden="true" className="fa-regular fa-copy" />
          Copy
        </button>
      </div>
    </div>
  );
}

export default function ViewAppointmentModal({
  appointment,
  onClose,
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  const createdAt = appointment.createdAt
    ? new Date(appointment.createdAt).toLocaleString("en-IN")
    : "Not available";

  return (
    <AdminModal
      title="Appointment Details"
      description="Complete patient and booking information."
      icon="fa-solid fa-calendar-check"
      tone="blue"
      maxWidth="xl"
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 px-7 py-3 font-black text-white transition motion-safe:hover:-translate-y-1 sm:w-auto"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="[content-visibility:auto] [contain-intrinsic-size:1200px] space-y-5">
        <section className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words text-xl font-black text-slate-900 sm:text-2xl">
                {appointment.name}
              </h3>

              <p className="mt-2 break-words font-bold text-slate-500">
                {appointment.service}
              </p>

              <p className="mt-1 break-words font-bold text-blue-700">
                {appointment.doctor}
              </p>
            </div>

            <AdminStatusBadge status={appointment.status} />
          </div>
        </section>

        <section>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-700">
            Contact Information
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <ContactRow
              label="Phone"
              value={appointment.phone}
              icon="fa-solid fa-phone"
              callHref={`tel:${appointment.phone}`}
            />

            <ContactRow
              label="Email"
              value={appointment.email}
              icon="fa-solid fa-envelope"
              mailHref={`mailto:${appointment.email}`}
            />
          </div>
        </section>

        <section>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-700">
            Appointment Information
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Row
              label="Date"
              value={appointment.date}
              icon="fa-solid fa-calendar-day"
            />

            <Row
              label="Time"
              value={appointment.timeSlot}
              icon="fa-solid fa-clock"
            />

            <Row
              label="Service"
              value={appointment.service}
              icon="fa-solid fa-tooth"
            />

            <Row
              label="Doctor"
              value={appointment.doctor}
              icon="fa-solid fa-user-doctor"
            />

            <Row
              label="Created At"
              value={createdAt}
              icon="fa-solid fa-calendar-plus"
            />

            <ContactRow
              label="Appointment ID"
              value={appointment._id}
              icon="fa-solid fa-hashtag"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5">
          <p className="font-black text-slate-900">
            <AdminIcon aria-hidden="true" className="fa-solid fa-message mr-2 text-blue-600" />
            Patient Message
          </p>

          <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-slate-600">
            {appointment.message || "No message provided."}
          </p>
        </section>

        {appointment.cancelReason && (
          <section className="rounded-2xl border border-red-100 bg-red-50 p-4 sm:p-5">
            <p className="font-black text-red-700">
              <AdminIcon aria-hidden="true" className="fa-solid fa-ban mr-2" />
              Cancellation Reason
            </p>

            <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-red-700">
              {appointment.cancelReason}
            </p>
          </section>
        )}

        {appointment.rescheduleReason && (
          <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:p-5">
            <p className="font-black text-amber-700">
              <AdminIcon aria-hidden="true" className="fa-solid fa-calendar-days mr-2" />
              Reschedule Reason
            </p>

            <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-amber-700">
              {appointment.rescheduleReason}
            </p>
          </section>
        )}
      </div>
    </AdminModal>
  );
}
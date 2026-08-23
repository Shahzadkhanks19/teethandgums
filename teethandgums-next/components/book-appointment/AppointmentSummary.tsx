"use client";

import { m, useReducedMotion } from "framer-motion";

import AppointmentIcon from "./AppointmentIcon";
type AppointmentSummaryProps = {
  service: string;
  doctor: string;
  date: string;
  time: string;
};

const TOTAL_REQUIRED_FIELDS = 4;

export default function AppointmentSummary({
  service,
  doctor,
  date,
  time,
}: AppointmentSummaryProps) {
  const shouldReduceMotion = useReducedMotion();

  const completedFields = [service, doctor, date, time].filter(Boolean).length;
  const progress = Math.round(
    (completedFields / TOTAL_REQUIRED_FIELDS) * 100,
  );

  const formattedDate = formatAppointmentDate(date);

  return (
    <aside
      aria-labelledby="appointment-summary-title"
      className="overflow-hidden rounded-[38px] border border-blue-100 bg-white shadow-[0_28px_80px_rgba(37,99,235,.14)]"
    >
      {/* Header */}

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 p-7 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl"
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-start">
            <div
              aria-hidden="true"
              className="grid h-14 w-14 shrink-0 place-items-center min-[420px]:h-16 min-[420px]:w-16 rounded-[20px] border border-white/15 bg-white/15 text-2xl shadow-lg backdrop-blur"
            >
              <AppointmentIcon aria-hidden="true" className="fa-solid fa-calendar-check" />
            </div>

            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur">
                Live Summary
              </span>

              <h2
                id="appointment-summary-title"
                className="mt-3 text-2xl font-black leading-tight"
              >
                Appointment Summary
              </h2>

              <p className="mt-1 text-sm leading-6 text-white/75">
                Review your selected appointment details before submitting your booking request.
              </p>
            </div>
          </div>

          {/* Progress */}

          <div className="mt-8">
            <div className="mb-3 flex flex-col gap-1 text-sm font-bold min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <span>Appointment Progress</span>
              <span className="shrink-0">{progress}% complete</span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={`Appointment booking is ${progress}% complete`}
            >
              <m.div
                initial={shouldReduceMotion ? false : { width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-white"
              />
            </div>

            <p className="mt-3 text-xs font-semibold text-white/65">
              {completedFields === TOTAL_REQUIRED_FIELDS
                ? "All required appointment details are selected."
                : `${TOTAL_REQUIRED_FIELDS - completedFields} required ${
                    TOTAL_REQUIRED_FIELDS - completedFields === 1
                      ? "detail"
                      : "details"
                  } remaining.`}
            </p>
          </div>
        </div>
      </div>

      {/* Summary details */}

      <div className="grid gap-4 p-4 min-[420px]:p-6 sm:p-8">
        <SummaryRow
          icon="fa-solid fa-tooth"
          label="Treatment"
          value={service}
          placeholder="Select a dental treatment"
        />

        <SummaryRow
          icon="fa-solid fa-user-doctor"
          label="Preferred Doctor"
          value={doctor}
          placeholder="Select your preferred dentist"
        />

        <SummaryRow
          icon="fa-solid fa-calendar-days"
          label="Appointment Date"
          value={formattedDate}
          placeholder="Select a date"
        />

        <SummaryRow
          icon="fa-solid fa-clock"
          label="Appointment Time"
          value={time}
          placeholder="Select an available time slot"
        />
      </div>

      {/* Visit details */}

      <div className="border-t border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 min-[420px]:p-6 sm:p-8">
        <h3 className="flex items-center gap-2 font-black text-slate-900">
          <AppointmentIcon aria-hidden="true" className="fa-solid fa-clipboard-check text-blue-600" />
          Appointment Information
        </h3>

        <div className="mt-5 grid gap-3">
          <InfoRow
            icon="fa-solid fa-hourglass-half"
            label="Estimated Duration"
            value="30–45 Minutes"
          />

          <InfoRow
            icon="fa-solid fa-phone-volume"
            label="Confirmation"
            value="Phone Call, Email or WhatsApp"
          />

          <InfoRow
            icon="fa-solid fa-money-bill-wave"
            label="Consultation Fee"
            value="Confirmed by Clinic"
          />

          <InfoRow
            icon="fa-solid fa-hospital"
            label="Appointment Type"
            value="In-Clinic Consultation"
          />
        </div>
      </div>

      {/* Help section */}

      <div className="border-t border-blue-100 p-4 min-[420px]:p-6 sm:p-8">
        <div className="rounded-[26px] border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg text-white shadow-lg shadow-blue-100"
            >
              <AppointmentIcon aria-hidden="true" className="fa-solid fa-headset" />
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Need Help Booking Your Appointment?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Contact Teeth and Gums Care if you need help selecting a treatment, dentist or appointment slot.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href="tel:+919829824356"
              itemProp="telephone"
              aria-label="Call Teeth and Gums Care for booking help"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-5 py-3 text-sm font-black text-white shadow-md transition motion-safe:hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <AppointmentIcon aria-hidden="true" className="fa-solid fa-phone mr-2" />
              Call Clinic
            </a>

            <a
              href="https://wa.me/919829824356?text=Hello%20Teeth%20and%20Gums%20Care,%20I%20would%20like%20assistance%20booking%20a%20dental%20appointment%20through%20your%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-black text-blue-700 transition motion-safe:hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <AppointmentIcon aria-hidden="true" className="fa-brands fa-whatsapp mr-2 text-lg" />
              WhatsApp
            </a>
          </div>
        </div>

        <p className="mt-5 flex items-start gap-2 text-xs font-semibold leading-6 text-slate-500">
          <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-info mt-1 text-blue-600" />
          <span>
            Your appointment request will be confirmed only after our clinic verifies doctor availability and contacts you by phone, WhatsApp or email.
          </span>
        </p>
      </div>
    </aside>
  );
}

type SummaryRowProps = {
  icon: string;
  label: string;
  value: string;
  placeholder: string;
};

function SummaryRow({
  icon,
  label,
  value,
  placeholder,
}: SummaryRowProps) {
  const hasValue = Boolean(value);

  return (
    <m.div
      layout
      className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-[24px] border p-4 transition duration-300 min-[420px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[420px]:gap-4 ${
        hasValue
          ? "border-blue-100 bg-blue-50/60"
          : "border-slate-100 bg-slate-50/70"
      }`}
    >
      <div
        aria-hidden="true"
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg ${
          hasValue
            ? "bg-gradient-to-br from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-100"
            : "bg-white text-slate-400 shadow-sm ring-1 ring-slate-100"
        }`}
      >
        <AppointmentIcon className={icon}></AppointmentIcon>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <m.p
          key={value || placeholder}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-1 break-words font-black leading-6 ${
            hasValue ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {value || placeholder}
        </m.p>
      </div>

      {hasValue && (
        <span
          aria-label="Completed"
          className="col-start-2 row-start-2 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-100 text-xs text-green-600 min-[420px]:col-start-3 min-[420px]:row-start-1"
        >
          <AppointmentIcon aria-hidden="true" className="fa-solid fa-check" />
        </span>
      )}
    </m.div>
  );
}

type InfoRowProps = {
  icon: string;
  label: string;
  value: string;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-sm text-blue-700"
        >
          <AppointmentIcon className={icon} />
        </span>

        <span className="min-w-0 text-sm font-bold text-slate-500">
          {label}
        </span>
      </div>

      <strong className="break-words text-sm font-black leading-6 text-slate-900 min-[420px]:max-w-[170px] min-[420px]:text-right">
        {value}
      </strong>
    </div>
  );
}

function formatAppointmentDate(date: string) {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

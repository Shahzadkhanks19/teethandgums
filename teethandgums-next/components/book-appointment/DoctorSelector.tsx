"use client";

import Image from "next/image";
import { m } from "framer-motion";

import {
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import { doctors } from "./appointmentData";

import AppointmentIcon from "./AppointmentIcon";
type DoctorSelectorProps = {
  selectedDoctor: string;
  loading: boolean;
  error?: string;
  onSelect: (doctor: string) => void;
};

export default function DoctorSelector({
  selectedDoctor,
  loading,
  error,
  onSelect,
}: DoctorSelectorProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex items-center gap-2 text-sm font-black text-slate-700">
        <AppointmentIcon
          aria-hidden="true"
          className="fa-solid fa-user-doctor text-blue-600"
        />
        Choose Your Preferred Dentist
      </legend>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Choose your preferred dentist for your consultation. Our team will
        confirm the selected dentist&apos;s availability before your
        appointment.
      </p>

      <div
        role="radiogroup"
        aria-label="Choose your preferred dentist"
        aria-describedby={error ? "appointment-doctor-error" : undefined}
        className="mt-6"
      >
        <StaggerContainer className="grid items-stretch gap-6 md:grid-cols-2">
          {doctors.map((doctor) => {
            const selected = selectedDoctor === doctor.name;

            return (
              <StaggerItem key={doctor.name}>
                <HoverCard className="h-full">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`Choose ${doctor.name}, ${doctor.qualification}, ${doctor.role}`}
                    disabled={loading}
                    onClick={() => onSelect(doctor.name)}
                    className={`group relative flex h-full min-h-[580px] w-full flex-col overflow-hidden rounded-[32px] border text-left transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 ${
                      selected
                        ? "border-blue-600 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-[0_28px_70px_rgba(37,99,235,.28)]"
                        : "border-blue-100 bg-white text-slate-900 shadow-[0_18px_50px_rgba(37,99,235,.08)] hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_28px_70px_rgba(37,99,235,.16)]"
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className={`absolute left-0 top-0 z-20 h-1.5 w-full transition duration-300 ${
                        selected
                          ? "bg-white"
                          : "bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    {selected && (
                      <m.span
                        aria-hidden="true"
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-5 top-5 z-30 grid h-11 w-11 place-items-center rounded-full bg-white text-blue-700 shadow-xl"
                      >
                        <AppointmentIcon className="fa-solid fa-check" />
                      </m.span>
                    )}

                    <div className="relative h-[260px] w-full overflow-hidden">
                      <Image
                        src={doctor.image}
                        alt={`${doctor.name}, ${doctor.qualification}, ${doctor.role} at Teeth and Gums Care Dental Clinic in Jodhpur`}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 32px), 50vw"
                        quality={72}
                        className="object-cover object-top transition duration-700 group-hover:scale-105"
                      />

                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 bg-gradient-to-t ${
                          selected
                            ? "from-blue-900 via-blue-900/10 to-transparent"
                            : "from-slate-950/55 via-transparent to-transparent"
                        }`}
                      />

                      <span
                        className={`absolute bottom-5 left-5 inline-flex items-center rounded-full px-4 py-2 text-xs font-black shadow-lg backdrop-blur ${
                          selected
                            ? "bg-white text-blue-700"
                            : "bg-white/90 text-blue-700"
                        }`}
                      >
                        <AppointmentIcon
                          aria-hidden="true"
                          className="fa-solid fa-circle-check mr-2 text-green-600"
                        />
                        {doctor.status}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div>
                        <h3
                          className={`text-2xl font-black leading-tight ${
                            selected ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {doctor.name}
                        </h3>

                        <p
                          className={`mt-2 font-black ${
                            selected ? "text-blue-100" : "text-blue-600"
                          }`}
                        >
                          {doctor.qualification} • {doctor.role}
                        </p>
                      </div>

                      <div
                        className={`mt-5 grid gap-3 rounded-[22px] border p-4 ${
                          selected
                            ? "border-white/15 bg-white/10"
                            : "border-blue-100 bg-blue-50/60"
                        }`}
                      >
                        <DoctorDetail
                          selected={selected}
                          icon="fa-solid fa-briefcase-medical"
                          text={doctor.experience}
                        />

                        <DoctorDetail
                          selected={selected}
                          icon="fa-solid fa-heart"
                          text={doctor.patients}
                        />

                        <DoctorDetail
                          selected={selected}
                          icon="fa-solid fa-language"
                          text={`Consultation in ${doctor.languages.join(
                            " & ",
                          )}`}
                        />
                      </div>

                      <div className="mt-6">
                        <p
                          className={`text-xs font-black uppercase tracking-wider ${
                            selected ? "text-white/65" : "text-slate-400"
                          }`}
                        >
                          Dental Specialties
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {doctor.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className={`rounded-full px-3 py-2 text-[11px] font-black ${
                                selected
                                  ? "bg-white/15 text-white"
                                  : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                              }`}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        className={`mt-auto border-t pt-6 ${
                          selected ? "border-white/20" : "border-blue-100"
                        }`}
                      >
                        <span
                          className={`inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-6 py-4 text-sm font-black transition duration-300 ${
                            selected
                              ? "bg-white text-blue-700 shadow-xl"
                              : "bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-[0_14px_35px_rgba(37,99,235,.20)] group-hover:-translate-y-0.5 group-hover:shadow-xl"
                          }`}
                        >
                          <AppointmentIcon
                            aria-hidden="true"
                            className={`mr-2 ${
                              selected
                                ? "fa-solid fa-circle-check"
                                : "fa-regular fa-circle"
                            }`}
                          />

                          {selected
                            ? "Selected Dentist"
                            : `Choose ${doctor.name}`}
                        </span>
                      </div>
                    </div>
                  </button>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {error && (
        <m.p
          id="appointment-doctor-error"
          role="alert"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600"
        >
          <AppointmentIcon
            aria-hidden="true"
            className="fa-solid fa-circle-exclamation mr-2"
          />
          {error}
        </m.p>
      )}
    </fieldset>
  );
}

type DoctorDetailProps = {
  selected: boolean;
  icon: string;
  text: string;
};

function DoctorDetail({
  selected,
  icon,
  text,
}: DoctorDetailProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm ${
          selected
            ? "bg-white/15 text-white"
            : "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
        }`}
      >
        <AppointmentIcon className={icon} />
      </span>

      <span
        className={`text-sm font-bold leading-6 ${
          selected ? "text-white/85" : "text-slate-600"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

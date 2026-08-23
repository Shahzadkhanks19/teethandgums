"use client";

import type { ChangeEvent, FormEvent, HTMLAttributes } from "react";
import { m } from "framer-motion";

import { FadeUp, HoverButton, HoverCard } from "@/components/animations";

import DoctorSelector from "./DoctorSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import { appointmentServices } from "./appointmentData";

import type { AppointmentErrors, AppointmentFormData } from "./types";

import AppointmentIcon from "./AppointmentIcon";
type FormFieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

type AppointmentFormProps = {
  formData: AppointmentFormData;
  errors: AppointmentErrors;
  loading: boolean;
  slotLoading: boolean;
  submitError: string;
  selectedSlot: string;
  isSunday: boolean;
  isFullDayBlocked: boolean;
  blockedReason: string;
  blockedSlotReasons: Record<string, string>;
  onChange: (event: FormFieldChangeEvent) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDoctorSelect: (doctor: string) => void;
  onSlotClick: (slot: string) => void;
  isSlotUnavailable: (slot: string) => boolean;
  getSlotReason: (slot: string) => string;
  getTodayDate: () => string;
};

export default function AppointmentForm({
  formData,
  errors,
  loading,
  slotLoading,
  submitError,
  selectedSlot,
  isSunday,
  isFullDayBlocked,
  blockedReason,
  blockedSlotReasons,
  onChange,
  onSubmit,
  onDoctorSelect,
  onSlotClick,
  isSlotUnavailable,
  getSlotReason,
  getTodayDate,
}: AppointmentFormProps) {
  return (
    <HoverCard>
      <section
        aria-labelledby="appointment-form-title"
        className="relative overflow-hidden rounded-[40px] border border-blue-100 bg-white p-6 shadow-[0_35px_90px_rgba(37,99,235,.12)] sm:p-8 lg:p-12"
      >
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700"
        />

        <FadeUp>
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700 ring-1 ring-blue-200/60">
              Online Dental Appointment
            </span>

            <h2
              id="appointment-form-title"
              className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl"
            >
              Book Your Dental Appointment
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-500">
              Fill in your details below to book your dental appointment at Teeth and Gums Care in Jodhpur. Choose your preferred treatment, dentist, date and available appointment slot.
            </p>
          </div>
        </FadeUp>

        <div className="mt-8 rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-xl text-white shadow-lg"
            >
              <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-info" />
            </div>

            <div>
              <h3 className="font-black text-slate-900">Why Book Your Appointment Online?</h3>

              <p className="mt-2 leading-7 text-slate-500">
                Enjoy quick appointment confirmation, preferred dentist selection, real-time slot availability and a smooth online booking experience.
              </p>
            </div>
          </div>
        </div>

        {submitError && (
          <m.div
            id="appointment-submit-error"
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 font-bold text-red-700"
          >
            <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1" />
            <span>{submitError}</span>
          </m.div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={loading}
          aria-describedby={submitError ? "appointment-submit-error" : undefined}
          className="mt-10 space-y-12"
        >
          <div aria-live="polite" className="sr-only">
            {loading
              ? "Submitting your appointment request."
              : slotLoading
                ? "Checking appointment slot availability."
                : ""}
          </div>
          {/* Personal information */}
          <div>
            <SectionHeading
              icon="fa-solid fa-user"
              title="Personal Information"
              description="Basic details required for your appointment."
            />

            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                id="appointment-name"
                name="name"
                label="Full Name"
                icon="fa-solid fa-user"
                placeholder="Enter your full name"
                autoComplete="name"
                value={formData.name}
                error={errors.name}
                disabled={loading}
                onChange={onChange}
              />

              <InputField
                id="appointment-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                label="WhatsApp Number"
                icon="fa-solid fa-phone"
                placeholder="10-digit WhatsApp number"
                autoComplete="tel"
                value={formData.phone}
                error={errors.phone}
                disabled={loading}
                onChange={onChange}
              />

              <InputField
                id="appointment-email"
                name="email"
                type="email"
                label="Email Address"
                icon="fa-solid fa-envelope"
                placeholder="example@gmail.com"
                autoComplete="email"
                value={formData.email}
                error={errors.email}
                disabled={loading}
                onChange={onChange}
              />

              <SelectField
                id="appointment-service"
                name="service"
                label="Treatment Required"
                value={formData.service}
                error={errors.service}
                disabled={loading}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Appointment details */}
          <div className="border-t border-blue-100 pt-10">
            <SectionHeading
              icon="fa-solid fa-calendar-days"
              title="Appointment Details"
              description="Select your preferred appointment date, dentist and available time slot."
            />

            <div className="space-y-8">
              <InputField
                id="appointment-date"
                name="date"
                type="date"
                label="Appointment Date"
                icon="fa-solid fa-calendar-days"
                min={getTodayDate()}
                value={formData.date}
                error={errors.date}
                disabled={loading}
                onChange={onChange}
              />

              <DoctorSelector
                selectedDoctor={formData.doctor}
                loading={loading}
                error={errors.doctor}
                onSelect={onDoctorSelect}
              />
            </div>
          </div>

          {/* Time slot */}
          <div className="border-t border-blue-100 pt-10">
            <SectionHeading
              icon="fa-solid fa-clock"
              title="Select Time Slot"
              description="Available appointment slots are updated in real time based on clinic availability."
            />

            <TimeSlotSelector
              date={formData.date}
              isSunday={isSunday}
              slotLoading={slotLoading}
              loading={loading}
              selectedSlot={selectedSlot}
              errorsSlot={errors.slot}
              isFullDayBlocked={isFullDayBlocked}
              blockedReason={blockedReason}
              blockedSlotReasons={blockedSlotReasons}
              isSlotUnavailable={isSlotUnavailable}
              getSlotReason={getSlotReason}
              onSlotClick={onSlotClick}
            />
          </div>

          {/* Dental concern */}
          <div className="border-t border-blue-100 pt-10">
            <SectionHeading
              icon="fa-solid fa-notes-medical"
              title="Tell Us About Your Dental Concern"
              description="This helps our dentists understand your concern before your appointment."
            />

            <div className="rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-5 shadow-sm sm:p-6">
              <label
                htmlFor="appointment-message"
                className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700"
              >
                <AppointmentIcon aria-hidden="true" className="fa-solid fa-comment-medical text-blue-600" />
                Dental Concern
                <span className="font-semibold text-slate-400">(Optional)</span>
              </label>

              <textarea
                id="appointment-message"
                name="message"
                rows={6}
                maxLength={500}
                autoComplete="off"
                placeholder="Describe your dental problem, tooth pain, swelling, broken tooth, sensitivity, previous treatment or any special instructions for the dentist..."
                value={formData.message}
                onChange={onChange}
                disabled={loading}
                className="w-full resize-none rounded-2xl border border-blue-100 bg-white px-5 py-5 text-slate-700 transition duration-300 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs font-medium text-slate-400">
                  Maximum 500 characters
                </p>

                <span className="text-xs font-bold text-slate-500">
                  {formData.message.length}/500
                </span>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Common Dental Concerns
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
  "Tooth Pain",
  "Root Canal",
  "Dental Implant",
  "Teeth Whitening",
  "Braces",
  "Smile Designing",
].map((concern) => (
                    <span
                      key={concern}
                      className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-blue-100 pt-10">
            <div className="rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-6 text-center text-white shadow-[0_25px_60px_rgba(37,99,235,.22)] sm:p-8">
              <h3 className="text-2xl font-black">
                Ready to Schedule Your Dental Appointment?
              </h3>

              <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/90">
                Our team will review your appointment request and contact you shortly to confirm your preferred date and time.
              </p>

              <HoverButton>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 inline-flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-white px-8 py-5 text-base font-black text-blue-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[300px] sm:text-lg"
                >
                  {loading ? (
                    <>
                      <AppointmentIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-3" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      <AppointmentIcon aria-hidden="true" className="fa-solid fa-calendar-check mr-3" />
                      Submit Appointment Request
                    </>
                  )}
                </button>
              </HoverButton>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/85">
                <span>
                  <AppointmentIcon aria-hidden="true" className="fa-solid fa-lock mr-2" />
                  Secure Booking
                </span>

                <span>
                  <AppointmentIcon aria-hidden="true" className="fa-solid fa-phone mr-2" />
                  Quick Confirmation
                </span>

                <span>
                  <AppointmentIcon aria-hidden="true" className="fa-solid fa-user-doctor mr-2" />
                  Experienced Dental Surgeons
                </span>
              </div>
            </div>
          </div>
        </form>
      </section>
    </HoverCard>
  );
}

type SectionHeadingProps = {
  icon: string;
  title: string;
  description: string;
};

function SectionHeading({ icon, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div
        aria-hidden="true"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700"
      >
        <AppointmentIcon className={icon}></AppointmentIcon>
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

type InputFieldProps = {
  id: string;
  name: keyof AppointmentFormData;
  label: string;
  icon: string;
  value: string;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  min?: string;
  autoComplete?: string;
  disabled?: boolean;
  onChange: (event: FormFieldChangeEvent) => void;
};

function InputField({
  id,
  name,
  label,
  icon,
  value,
  error,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  min,
  autoComplete,
  disabled = false,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700"
      >
        <AppointmentIcon className={`${icon} text-blue-600`}></AppointmentIcon>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          inputMode={inputMode}
          maxLength={maxLength}
          min={min}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-2xl border bg-white px-5 py-4 pr-12 text-slate-700 transition duration-300 placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-blue-100 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-blue-500"
        >
          <AppointmentIcon className={icon}></AppointmentIcon>
        </div>
      </div>

      {error && (
        <m.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-bold text-red-600"
        >
          <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </m.p>
      )}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: keyof AppointmentFormData;
  label: string;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (event: FormFieldChangeEvent) => void;
};

function SelectField({
  id,
  name,
  label,
  value,
  error,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700"
      >
        <AppointmentIcon aria-hidden="true" className="fa-solid fa-tooth text-blue-600" />
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full appearance-none rounded-2xl border bg-white px-5 py-4 pr-12 text-slate-700 transition duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-blue-100 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        >
          <option value="">Select Treatment</option>

          {appointmentServices.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-blue-600"
        >
          <AppointmentIcon aria-hidden="true" className="fa-solid fa-chevron-down" />
        </div>
      </div>

      {error && (
        <m.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm font-bold text-red-600"
        >
          <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mr-2" />
          {error}
        </m.p>
      )}
    </div>
  );
}

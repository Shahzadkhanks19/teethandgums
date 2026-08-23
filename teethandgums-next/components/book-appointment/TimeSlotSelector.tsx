"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";

import { eveningSlots, morningSlots } from "./appointmentData";

import AppointmentIcon from "./AppointmentIcon";
type TimeSlotSelectorProps = {
  date: string;
  isSunday: boolean;
  slotLoading: boolean;
  loading: boolean;
  selectedSlot: string;
  errorsSlot?: string;
  isFullDayBlocked: boolean;
  blockedReason: string;
  blockedSlotReasons: Record<string, string>;
  isSlotUnavailable: (slot: string) => boolean;
  getSlotReason: (slot: string) => string;
  onSlotClick: (slot: string) => void;
};

const SKELETON_SLOTS = Array.from({ length: 8 }, (_, index) => index);

export default function TimeSlotSelector({
  date,
  isSunday,
  slotLoading,
  loading,
  selectedSlot,
  errorsSlot,
  isFullDayBlocked,
  blockedReason,
  blockedSlotReasons,
  isSlotUnavailable,
  getSlotReason,
  onSlotClick,
}: TimeSlotSelectorProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderSlotButton = (slot: string) => {
    const unavailable = isSlotUnavailable(slot);
    const active = selectedSlot === slot;
    const reason = unavailable ? getSlotReason(slot) : "";
    const blockedReasonForSlot = blockedSlotReasons[slot];

    return (
      <m.button
        key={slot}
        type="button"
        disabled={unavailable || slotLoading || loading}
        aria-pressed={active}
        aria-label={
          unavailable
            ? `${slot} unavailable. ${reason}`
            : active
              ? `${slot} selected`
              : `${slot} available`
        }
        title={
  unavailable
    ? blockedReasonForSlot || reason
    : `${slot} available for booking`
}
        onClick={() => onSlotClick(slot)}
        whileHover={
          shouldReduceMotion || unavailable || slotLoading || loading
            ? undefined
            : { y: -4 }
        }
        whileTap={
          shouldReduceMotion || unavailable || slotLoading || loading
            ? undefined
            : { scale: 0.97 }
        }
        className={`group relative min-h-[112px] overflow-hidden rounded-[22px] border-2 px-3 py-4 text-center transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed ${
          unavailable
            ? "border-slate-100 bg-slate-50 opacity-75"
            : active
              ? "border-blue-600 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-[0_18px_45px_rgba(37,99,235,.28)]"
              : "border-blue-100 bg-white text-slate-900 shadow-sm hover:border-blue-400 hover:shadow-[0_16px_38px_rgba(37,99,235,.13)]"
        }`}
      >
        {active && (
          <m.span
            aria-hidden="true"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.7,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white text-[11px] text-blue-700 shadow-lg"
          >
            <AppointmentIcon aria-hidden="true" className="fa-solid fa-check"></AppointmentIcon>
          </m.span>
        )}

        <m.div
          aria-hidden="true"
          animate={
            active && !shouldReduceMotion
              ? {
                  scale: [1, 1.08, 1],
                }
              : undefined
          }
          transition={{
            duration: 0.4,
          }}
          className={`mx-auto grid h-10 w-10 place-items-center rounded-xl transition duration-300 ${
            unavailable
              ? "bg-slate-100 text-slate-400"
              : active
                ? "bg-white/15 text-white"
                : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
          }`}
        >
          <AppointmentIcon aria-hidden="true" className="fa-regular fa-clock"></AppointmentIcon>
        </m.div>

        <span
          className={`mt-3 block text-sm font-black ${
            unavailable
              ? "text-slate-400"
              : active
                ? "text-white"
                : "text-slate-900"
          }`}
        >
          {slot}
        </span>

        <span
          className={`mt-1.5 block text-[11px] font-bold leading-4 ${
            unavailable
              ? "text-slate-400"
              : active
                ? "text-white/85"
                : "text-slate-500"
          }`}
        >
          {unavailable ? reason : active ? "Selected" : "Available"}
        </span>

        {!unavailable && !active && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </m.button>
    );
  };

  return (
    <div
      role="group"
      aria-labelledby="appointment-time-slot-label"
      aria-describedby={errorsSlot ? "appointment-slot-error" : undefined}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="appointment-time-slot-label" className="block text-sm font-black text-slate-700">
            Choose an Appointment Time
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Select your preferred appointment time from the available slots below.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {slotLoading ? (
            <m.span
              key="loading"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: -4,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="inline-flex items-center self-start rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 sm:self-auto"
            >
              <AppointmentIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2"></AppointmentIcon>
              Checking Live Availability...
            </m.span>
          ) : date ? (
            <m.span
              key="updated"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: -4,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="inline-flex items-center self-start rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 sm:self-auto"
            >
              <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-check mr-2"></AppointmentIcon>
              Live Availability Updated
            </m.span>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!date && (
          <m.div
            key="no-date"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 8,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            className="rounded-[26px] border-2 border-dashed border-blue-100 bg-blue-50/60 p-8 text-center"
          >
            <div
              aria-hidden="true"
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-2xl text-blue-600 shadow-sm ring-1 ring-blue-100"
            >
              <AppointmentIcon aria-hidden="true" className="fa-regular fa-calendar"></AppointmentIcon>
            </div>

            <h3 className="mt-4 font-black text-slate-900">
              Select Your Appointment Date
            </h3>

            <p className="mx-auto mt-2 max-w-lg font-semibold leading-7 text-slate-500">
              Morning and evening appointment slots will appear after you select a preferred date.
            </p>
          </m.div>
        )}

        {date && slotLoading && (
          <m.div
            key="slot-skeleton"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                  }
            }
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <SlotSkeleton />
          </m.div>
        )}

        {date && !slotLoading && (
          <m.div
            key={`slots-${date}`}
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 10,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
          >
            {isFullDayBlocked && (
              <m.div
                role="alert"
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 6,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-6 flex gap-4 rounded-[24px] border border-orange-200 bg-orange-50 p-5 text-orange-700"
              >
                <div
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 text-lg text-orange-700"
                >
                  <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-exclamation"></AppointmentIcon>
                </div>

                <div>
                  <h3 className="font-black">
                    Appointments Are Unavailable for This Date
                  </h3>

                  <p className="mt-1 font-semibold leading-6">
                    {blockedReason
                      ? `Reason: ${blockedReason}`
                      : "Please choose another available appointment date."}
                  </p>
                </div>
              </m.div>
            )}

            <SlotGroup
              title="Morning Appointments"
              icon="fa-solid fa-sun"
              slots={morningSlots}
              renderSlotButton={renderSlotButton}
            />

            {!isSunday && (
              <div className="mt-8">
                <SlotGroup
                  title="Evening Appointments"
                  icon="fa-solid fa-moon"
                  slots={eveningSlots}
                  renderSlotButton={renderSlotButton}
                />
              </div>
            )}

            {isSunday && (
              <div className="mt-6 flex gap-4 rounded-[22px] border border-blue-100 bg-blue-50/70 p-5">
                <div
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-lg text-blue-600 shadow-sm ring-1 ring-blue-100"
                >
                  <AppointmentIcon aria-hidden="true" className="fa-solid fa-clock"></AppointmentIcon>
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Sunday Clinic Hours
                  </h3>

                  <p className="mt-1 font-semibold leading-6 text-slate-500">
                    Appointments are available only during morning clinic hours (10:00 AM – 3:00 PM).
                  </p>
                </div>
              </div>
            )}

            <SlotLegend />
          </m.div>
        )}
      </AnimatePresence>

      {errorsSlot && (
        <m.p
          id="appointment-slot-error"
          role="alert"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 4,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600"
        >
          <AppointmentIcon className="fa-solid fa-circle-exclamation mr-2"></AppointmentIcon>
          {errorsSlot}
        </m.p>
      )}
    </div>
  );
}

type SlotGroupProps = {
  title: string;
  icon: string;
  slots: string[];
  renderSlotButton: (slot: string) => React.ReactNode;
};

function SlotGroup({
  title,
  icon,
  slots,
  renderSlotButton,
}: SlotGroupProps) {
  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700"
        >
          <AppointmentIcon aria-hidden="true" className={icon}></AppointmentIcon>
        </div>

        <div>
          <h3 className="font-black text-slate-900">{title}</h3>
          <p className="text-xs font-semibold text-slate-500">
            Choose your preferred appointment time.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {slots.map((slot) => renderSlotButton(slot))}
      </div>
    </section>
  );
}

function SlotSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-44 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {SKELETON_SLOTS.map((slot) => (
          <div
            key={slot}
            className="min-h-[112px] animate-pulse rounded-[22px] border-2 border-slate-100 bg-slate-50 p-4"
          >
            <div className="mx-auto h-10 w-10 rounded-xl bg-slate-200/70" />
            <div className="mx-auto mt-3 h-4 w-20 rounded-full bg-slate-200/70" />
            <div className="mx-auto mt-2 h-3 w-14 rounded-full bg-slate-200/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SlotLegend() {
  return (
    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 rounded-[22px] border border-blue-100 bg-blue-50/50 p-4 text-xs font-bold text-slate-600">
      <LegendItem
        className="border-blue-100 bg-white"
        text="Available Now"
      />

      <LegendItem
        className="border-blue-600 bg-gradient-to-br from-blue-600 to-blue-900"
        text="Selected"
      />

      <LegendItem
        className="border-slate-100 bg-slate-100"
        text="Unavailable"
      />
    </div>
  );
}

function LegendItem({
  className,
  text,
}: {
  className: string;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`h-4 w-4 rounded-md border ${className}`}
      />
      {text}
    </span>
  );
}

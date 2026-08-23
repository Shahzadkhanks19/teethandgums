"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import BookAppointmentHero from "@/components/book-appointment/BookAppointmentHero";
import WhyBookCard from "@/components/book-appointment/WhyBookCard";
import AppointmentForm from "@/components/book-appointment/AppointmentForm";
import AppointmentSummary from "@/components/book-appointment/AppointmentSummary";
import EmergencyAppointmentCard from "@/components/book-appointment/EmergencyAppointmentCard";
import NextSteps from "@/components/book-appointment/NextSteps";
import AppointmentFAQ from "@/components/book-appointment/AppointmentFAQ";
import AppointmentSuccess from "@/components/book-appointment/AppointmentSuccess";

import {
  initialAppointmentFormData,
  type AppointmentErrors,
  type AppointmentFormData,
} from "@/components/book-appointment/types";

type BlockedSlotItem = {
  type: string;
  timeSlot: string;
  reason?: string;
};

type AvailabilityResponse = {
  success?: boolean;
  message?: string;
  unavailableSlots?: string[];
  isFullDayBlocked?: boolean;
  fullDayReason?: string;
  blockedSlots?: BlockedSlotItem[];
};

export default function BookAppointmentClient() {
  const availabilityControllerRef = useRef<AbortController | null>(null);
  const latestRequestedDateRef = useRef("");
  const scrollTimerRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<AppointmentFormData>(
    initialAppointmentFormData,
  );

  const [errors, setErrors] = useState<AppointmentErrors>({});
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [isFullDayBlocked, setIsFullDayBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState("");
  const [blockedSlotReasons, setBlockedSlotReasons] = useState<
    Record<string, string>
  >({});

  const isSunday = formData.date
    ? new Date(`${formData.date}T00:00:00`).getDay() === 0
    : false;

  const getTodayDate = () => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60_000;

    return new Date(today.getTime() - timezoneOffset)
      .toISOString()
      .split("T")[0];
  };

  const resetAvailabilityState = useCallback(() => {
    setUnavailableSlots([]);
    setIsFullDayBlocked(false);
    setBlockedReason("");
    setBlockedSlotReasons({});
  }, []);

  const convertSlotToDateTime = (date: string, slot: string) => {
    if (!date || !slot) return null;

    const [time, modifier] = slot.split(" ");
    const [rawHours, rawMinutes] = time.split(":").map(Number);

    if (
      Number.isNaN(rawHours) ||
      Number.isNaN(rawMinutes) ||
      !modifier
    ) {
      return null;
    }

    let hours = rawHours;
    const minutes = rawMinutes;

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(
      `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}:00`,
    );
  };

  const isPastSlot = (slot: string) => {
    if (!formData.date) return false;

    const slotDateTime = convertSlotToDateTime(formData.date, slot);

    return Boolean(slotDateTime && slotDateTime <= new Date());
  };

  const fetchUnavailableSlots = useCallback(async (
    date: string,
    signal: AbortSignal,
  ) => {
    if (!date) return;

    latestRequestedDateRef.current = date;

    try {
      setSlotLoading(true);

      const response = await fetch(
        `/api/blocked-slots/unavailable?date=${encodeURIComponent(date)}`,
        {
          method: "GET",
          signal,
          cache: "no-store",
        },
      );

      const data = (await response.json().catch(() => null)) as
        | AvailabilityResponse
        | null;

      if (latestRequestedDateRef.current !== date) {
        return;
      }

      if (!response.ok) {
        resetAvailabilityState();
        toast.error(data?.message || "Failed to load available slots");
        return;
      }

      if (!data?.success) {
        resetAvailabilityState();
        toast.error(data?.message || "Failed to load available slots");
        return;
      }

      setUnavailableSlots(data?.unavailableSlots || []);
      setIsFullDayBlocked(Boolean(data?.isFullDayBlocked));
      setBlockedReason(data?.fullDayReason || "");

      const reasonsMap: Record<string, string> = {};

      data?.blockedSlots
        ?.filter((item) => item.type === "slot")
        .forEach((item) => {
          if (item.timeSlot) {
            reasonsMap[item.timeSlot] = item.reason || "";
          }
        });

      setBlockedSlotReasons(reasonsMap);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (latestRequestedDateRef.current === date) {
        resetAvailabilityState();
        toast.error("Failed to load available slots");
      }
    } finally {
      if (latestRequestedDateRef.current === date) {
        setSlotLoading(false);
      }
    }
  }, [resetAvailabilityState]);

  useEffect(() => {
    availabilityControllerRef.current?.abort();

    const frameId = window.requestAnimationFrame(() => {
      if (!formData.date) {
        latestRequestedDateRef.current = "";
        resetAvailabilityState();
        setSlotLoading(false);
        return;
      }

      const controller = new AbortController();
      availabilityControllerRef.current = controller;
      void fetchUnavailableSlots(formData.date, controller.signal);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      availabilityControllerRef.current?.abort();
    };
  }, [formData.date, fetchUnavailableSlots, resetAvailabilityState]);

  useEffect(() => {
    return () => {
      availabilityControllerRef.current?.abort();

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const isSlotUnavailable = (slot: string) => {
    return (
      isFullDayBlocked ||
      unavailableSlots.includes(slot) ||
      isPastSlot(slot)
    );
  };

  const getSlotReason = (slot: string) => {
    const specificBlockedReason = blockedSlotReasons[slot];

    if (isPastSlot(slot)) {
      return "Time Passed";
    }

    if (specificBlockedReason) {
      return `Blocked • ${specificBlockedReason}`;
    }

    if (unavailableSlots.includes(slot)) {
      return "Already Booked";
    }

    if (isFullDayBlocked) {
      return blockedReason
        ? `Closed • ${blockedReason}`
        : "Appointments Closed";
    }

    return "Unavailable";
  };

  const scrollToElement = (selector: string) => {
    window.requestAnimationFrame(() => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        const element = document.querySelector<HTMLElement>(selector);

        if (!element) return;

        const top =
          element.getBoundingClientRect().top + window.scrollY - 120;

        window.scrollTo({
          top,
          behavior: "smooth",
        });

        element.focus?.({
          preventScroll: true,
        });
      }, 100);
    });
  };

  const scrollToFirstError = (newErrors: AppointmentErrors) => {
    const fieldOrder: Array<{
      key: keyof AppointmentErrors;
      selector: string;
    }> = [
      {
        key: "name",
        selector: "#appointment-name",
      },
      {
        key: "phone",
        selector: "#appointment-phone",
      },
      {
        key: "email",
        selector: "#appointment-email",
      },
      {
        key: "service",
        selector: "#appointment-service",
      },
      {
        key: "date",
        selector: "#appointment-date",
      },
      {
        key: "doctor",
        selector: '[role="radiogroup"][aria-label="Choose your preferred dentist"]',
      },
      {
        key: "slot",
        selector: "#appointment-slot-error",
      },
    ];

    const firstInvalidField = fieldOrder.find(
      ({ key }) => Boolean(newErrors[key]),
    );

    if (firstInvalidField) {
      scrollToElement(firstInvalidField.selector);
    }
  };

  const validateForm = () => {
    const newErrors: AppointmentErrors = {};
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name should be at least 2 characters";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!indianPhoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else if (formData.date < getTodayDate()) {
      newErrors.date = "Please select today or a future date";
    }

    if (!formData.doctor) {
      newErrors.doctor = "Please select a preferred doctor";
    }

    if (slotLoading) {
      newErrors.slot = "Please wait while slot availability is checked";
    } else if (isFullDayBlocked) {
      newErrors.slot = "Appointments are closed for this date";
    } else if (!selectedSlot) {
      newErrors.slot = "Please select a time slot";
    } else if (isSlotUnavailable(selectedSlot)) {
      newErrors.slot =
        "This slot is already booked, blocked, or has passed";
    }

    setErrors(newErrors);

    return {
      isValid: Object.keys(newErrors).length === 0,
      newErrors,
    };
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof AppointmentFormData;

    const nextValue =
      fieldName === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;

    setSubmitError("");

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: nextValue,
    }));

    if (fieldName === "date") {
      availabilityControllerRef.current?.abort();

      setSelectedSlot("");
      resetAvailabilityState();
    }

    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: undefined,
      ...(fieldName === "date"
        ? {
            slot: undefined,
          }
        : {}),
    }));
  };

  const handleDoctorSelect = (doctor: string) => {
    if (loading) return;

    setSubmitError("");

    setFormData((previousData) => ({
      ...previousData,
      doctor,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      doctor: undefined,
    }));
  };

  const handleSlotClick = (slot: string) => {
    if (
      loading ||
      slotLoading ||
      isSlotUnavailable(slot)
    ) {
      return;
    }

    setSubmitError("");
    setSelectedSlot(slot);

    setErrors((previousErrors) => ({
      ...previousErrors,
      slot: undefined,
    }));
  };

  const resetAppointmentState = () => {
    availabilityControllerRef.current?.abort();
    latestRequestedDateRef.current = "";

    setSuccess(false);
    setFormData(initialAppointmentFormData);
    setSelectedSlot("");
    resetAvailabilityState();
    setErrors({});
    setSubmitError("");
    setLoading(false);
    setSlotLoading(false);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      toast.error("Please complete all required fields");
      scrollToFirstError(newErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
          timeSlot: selectedSlot,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        const errorMessage =
          data?.message || "Unable to submit appointment request";

        setSubmitError(errorMessage);
        toast.error(errorMessage);

        window.requestAnimationFrame(() => {
          scrollToElement('[role="alert"]');
        });

        return;
      }

      availabilityControllerRef.current?.abort();

      toast.success("Appointment request submitted successfully!");

      setSuccess(true);
      setFormData(initialAppointmentFormData);
      setSelectedSlot("");
      resetAvailabilityState();
      setErrors({});
      setSubmitError("");

      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
      });
    } catch {
      const errorMessage = "Server error. Please try again later";

      setSubmitError(errorMessage);
      toast.error(errorMessage);

      window.requestAnimationFrame(() => {
        scrollToElement('[role="alert"]');
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <AppointmentSuccess onReset={resetAppointmentState} />;
  }

  return (
    <main id="main-content" tabIndex={-1} className="overflow-x-hidden bg-gradient-to-b from-blue-50 via-white to-white outline-none">
      <BookAppointmentHero />

      {/* Why choose section */}
      <section
        aria-labelledby="why-book-title"
        className="relative overflow-hidden py-16 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-blue-100/45 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-100/35 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <WhyBookCard />
        </div>
      </section>

      {/* Appointment form */}
      <section
        id="appointment-form-section"
        aria-labelledby="appointment-form-title"
        className="relative scroll-mt-24 overflow-hidden bg-white py-16 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-blue-100/35 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-32 h-72 w-72 rounded-full bg-cyan-100/25 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AppointmentForm
            formData={formData}
            errors={errors}
            loading={loading}
            slotLoading={slotLoading}
            submitError={submitError}
            selectedSlot={selectedSlot}
            isSunday={isSunday}
            isFullDayBlocked={isFullDayBlocked}
            blockedReason={blockedReason}
            blockedSlotReasons={blockedSlotReasons}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onDoctorSelect={handleDoctorSelect}
            onSlotClick={handleSlotClick}
            isSlotUnavailable={isSlotUnavailable}
            getSlotReason={getSlotReason}
            getTodayDate={getTodayDate}
          />
        </div>
      </section>

      {/* Summary and emergency cards */}
      <section
        aria-label="Appointment summary and emergency dental assistance"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <AppointmentSummary
                service={formData.service}
                doctor={formData.doctor}
                date={formData.date}
                time={selectedSlot}
              />
            </div>

            <div className="min-w-0">
              <EmergencyAppointmentCard />
            </div>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <NextSteps />
        </div>
      </section>

      {/* FAQ */}
      <AppointmentFAQ />
    </main>
  );
}
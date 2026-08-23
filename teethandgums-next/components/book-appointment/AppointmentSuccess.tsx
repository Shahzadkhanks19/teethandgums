"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";

import {
  HoverButton,
  HoverCard,
  ScaleIn,
} from "@/components/animations";

import AppointmentIcon from "./AppointmentIcon";
type AppointmentSuccessProps = {
  onReset: () => void;
};

const nextActions = [
  {
    icon: "fa-solid fa-phone-volume",
    title: "Clinic Confirmation",
    text: "Our clinic team will contact you to confirm your appointment details.",
  },
  {
    icon: "fa-solid fa-calendar-check",
    title: "Appointment Confirmation",
    text: "Your requested date and time will be verified before confirmation.",
  },
  {
    icon: "fa-solid fa-hospital-user",
    title: "Visit Our Clinic",
    text: "Arrive at the confirmed time and meet your selected dentist.",
  },
];

export default function AppointmentSuccess({
  onReset,
}: AppointmentSuccessProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      role="status"
      aria-live="polite"
      aria-labelledby="appointment-success-title"
      className="relative min-h-[78vh] overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white px-4 py-20 sm:px-6 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <ScaleIn>
          <HoverCard>
            <section className="relative overflow-hidden rounded-[40px] border border-blue-100 bg-white shadow-[0_32px_90px_rgba(37,99,235,.14)]">
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-green-500 via-cyan-400 to-blue-600"
              />

              <div className="px-6 py-12 text-center sm:px-10 lg:px-14 lg:py-16">
                <m.div
                  aria-hidden="true"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          scale: 0.65,
                          rotate: -8,
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative mx-auto mb-8 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-green-100 to-emerald-50 text-5xl text-green-600 shadow-[0_18px_45px_rgba(34,197,94,.18)] ring-8 ring-green-50"
                >
                  <AppointmentIcon aria-hidden="true" className="fa-solid fa-calendar-check" />

                  <m.span
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            scale: 0,
                          }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : 0.3,
                      duration: shouldReduceMotion ? 0 : 0.35,
                    }}
                    className="absolute -right-1 -top-1 grid h-10 w-10 place-items-center rounded-full bg-green-600 text-sm text-white shadow-lg"
                  >
                    <AppointmentIcon aria-hidden="true" className="fa-solid fa-check" />
                  </m.span>
                </m.div>

                <span className="inline-flex rounded-full bg-green-50 px-5 py-2 text-sm font-black text-green-700 ring-1 ring-green-100">
                  Appointment Request Received
                </span>

                <h1
                  id="appointment-success-title"
                  className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-900 md:text-5xl"
                >
                  Your Appointment Request Has Been Received
                </h1>

                <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                  Thank you for choosing Teeth and Gums Care in Jodhpur. We have successfully received your appointment request. Our team will contact you shortly to confirm your preferred appointment date and time.
                </p>

                <div className="mx-auto mt-8 max-w-3xl rounded-[28px] border border-blue-100 bg-blue-50/70 p-5 text-left sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      aria-hidden="true"
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg text-white shadow-lg shadow-blue-100"
                    >
                      <AppointmentIcon aria-hidden="true" className="fa-solid fa-circle-info" />
                    </div>

                    <div>
                      <h2 className="font-black text-slate-900">
                        Your Appointment Is Awaiting Confirmation
                      </h2>

                      <p className="mt-1 leading-7 text-slate-500">
                        The clinic will verify doctor and slot availability
                        before confirming your visit by phone, email, or
                        WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  {nextActions.map((item, index) => (
                    <m.article
                      key={item.title}
                      initial={
                        shouldReduceMotion
                          ? false
                          : {
                              opacity: 0,
                              y: 16,
                            }
                      }
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : 0.15 + index * 0.1,
                        duration: shouldReduceMotion ? 0 : 0.45,
                      }}
                      className="rounded-[26px] border border-blue-100 bg-white p-6 text-center shadow-[0_14px_38px_rgba(37,99,235,.08)]"
                    >
                      <div
                        aria-hidden="true"
                        className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-xl text-blue-700"
                      >
                        <AppointmentIcon className={item.icon}></AppointmentIcon>
                      </div>

                      <h3 className="mt-4 font-black text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {item.text}
                      </p>
                    </m.article>
                  ))}
                </div>

                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <HoverButton>
                    <button
                      type="button"
                      onClick={onReset}
                      className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.22)] transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                    >
                      <AppointmentIcon aria-hidden="true" className="fa-solid fa-calendar-plus mr-3" />
                      Book Another Appointment
                    </button>
                  </HoverButton>

                  <HoverButton>
                    <Link prefetch={false}
                      href="/"
                      className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 font-black text-blue-700 transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                    >
                      <AppointmentIcon aria-hidden="true" className="fa-solid fa-house mr-3" />
                      Return to Home
                    </Link>
                  </HoverButton>
                </div>
              </div>

              <div className="border-t border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 py-7 sm:px-10">
                <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
                  <div>
                    <h2 className="font-black text-slate-900">
                      Need Help With Your Appointment?
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Contact Teeth and Gums Care if you need to update your appointment or require immediate assistance.
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <a
                      href="tel:+919829824356"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                      <AppointmentIcon aria-hidden="true" className="fa-solid fa-phone mr-2" />
                      Call Clinic
                    </a>

                    <a
                      href="https://wa.me/919829824356?text=Hello%20Teeth%20and%20Gums%20Care,%20I%20have%20submitted%20an%20online%20appointment%20request%20through%20your%20website%20and%20would%20like%20to%20know%20its%20status."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-1 hover:bg-green-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                    >
                      <AppointmentIcon aria-hidden="true" className="fa-brands fa-whatsapp mr-2 text-lg" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </HoverCard>
        </ScaleIn>
      </div>
    </section>
  );
}

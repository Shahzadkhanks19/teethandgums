import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import { heroPoints, trustStats } from "./appointmentData";

import AppointmentIcon from "./AppointmentIcon";
export default function BookAppointmentHero() {
  return (
    <section
      aria-labelledby="appointment-hero-title"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 py-24 text-white lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-black backdrop-blur">
              Online Dental Appointment
            </span>

            <h1
              id="appointment-hero-title"
              className="mt-6 text-4xl font-black leading-tight md:text-6xl"
            >
              Book Dental Appointment Online in Jodhpur
            </h1>

            <div
              aria-hidden="true"
              className="mx-auto mt-5 h-1 w-32 rounded-full bg-white/80"
            />

            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/90">
              Book your appointment with Teeth and Gums Care in Jodhpur.
              Choose your preferred dental treatment, dentist, date and
              available time slot online.
            </p>

            <StaggerContainer className="mt-10 flex flex-wrap justify-center gap-4">
              {heroPoints.map((item) => (
                <StaggerItem key={item}>
                  <div className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold backdrop-blur">
                    <AppointmentIcon
                      aria-hidden="true"
                      className="fa-solid fa-circle-check mr-2 text-green-300"
                    />
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-3">
              {trustStats.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                    <AppointmentIcon
                      aria-hidden="true"
                      className={`${item.icon} text-3xl`}
                    />
                    <h3 className="mt-3 font-black">{item.title}</h3>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

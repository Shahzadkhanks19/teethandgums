import Link from "next/link";

import type { Service } from "@/data/services";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import ServiceIcon from "./ServiceIcon";
interface Props {
  service: Service;
}

export default function ServiceCTA({ service }: Props) {
  return (
    <section
      aria-labelledby={`service-cta-title-${service.slug}`}
      className="[content-visibility:auto] [contain-intrinsic-size:650px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <HoverCard>
            <aside
              className="relative overflow-hidden rounded-[38px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-6 py-16 text-center text-white shadow-[0_35px_90px_rgba(37,99,235,.20)] md:px-12"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
              />

              <div className="relative z-10">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-black backdrop-blur">
                  Book Your Consultation
                </span>

                <h2
                  id={`service-cta-title-${service.slug}`}
                  className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight md:text-5xl"
                >
                  Looking for {service.title} in Jodhpur?
                </h2>

                <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/90">
                  Schedule your consultation with the experienced dentists at
                  Teeth and Gums Care. Receive a personalized treatment plan
                  using modern dental technology in a comfortable and
                  patient-focused environment.
                </p>

                <StaggerContainer className="mx-auto mt-10 grid w-full max-w-[280px] grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-2 md:flex md:justify-center">
                  <StaggerItem className="w-full sm:w-auto">
                    <HoverButton className="block w-full sm:w-auto">
                      <Link prefetch={false}
                        href="/book-appointment"
                        aria-label={`Book an appointment for ${service.title} at Teeth and Gums Care`}
                        className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-white px-6 py-4 text-center text-sm font-black text-blue-700 shadow-xl shadow-blue-900/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:min-w-[230px] sm:text-base"
                      >
                        <ServiceIcon
                          aria-hidden="true"
                          className="fa-solid fa-calendar-check mr-3"
                        />
                        Book Appointment
                      </Link>
                    </HoverButton>
                  </StaggerItem>

                  <StaggerItem className="w-full sm:w-auto">
                    <HoverButton className="block w-full sm:w-auto">
                      <Link prefetch={false}
                        href="/contact"
                        aria-label="Contact Teeth and Gums Care Dental Clinic"
                        className="group inline-flex min-h-[56px] w-full items-center justify-center rounded-full border-2 border-white/70 px-6 py-4 text-center text-sm font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:min-w-[230px] sm:text-base"
                      >
                        <ServiceIcon
                          aria-hidden="true"
                          className="fa-solid fa-phone mr-3"
                        />
                        Contact Clinic
                      </Link>
                    </HoverButton>
                  </StaggerItem>
                </StaggerContainer>

                <p className="mt-8 text-sm font-semibold leading-7 text-white/80">
                  Appointments are confirmed by our clinic team based on
                  doctor and slot availability.
                </p>
              </div>
            </aside>
          </HoverCard>
        </FadeUp>
      </div>
    </section>
  );
}

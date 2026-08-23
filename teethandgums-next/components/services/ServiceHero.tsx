import Link from "next/link";

import type { Service } from "@/data/services";

import {
  HoverButton,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import ServiceIcon from "./ServiceIcon";
interface Props {
  service: Service;
}

export default function ServiceHero({ service }: Props) {
  return (
    <section
      aria-labelledby={`service-hero-title-${service.slug}`}
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-5 py-28 text-center text-white lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.12),transparent_35%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-2xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-2xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
          <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-6 py-3 font-black backdrop-blur">
            Teeth and Gums Care
          </span>

          <div className="mt-6">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
              Advanced Dental Treatment in Jodhpur
            </span>
          </div>

          <h1
            id={`service-hero-title-${service.slug}`}
            className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight md:text-6xl"
          >
            {service.title} in Jodhpur
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
            {service.shortDesc}
          </p>

          <StaggerContainer className="mx-auto mt-10 grid w-full max-w-[280px] grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-2 sm:justify-center md:flex">
            <StaggerItem className="w-full sm:w-auto">
              <HoverButton className="block w-full sm:w-auto">
                <Link prefetch={false}
                  href="/book-appointment"
                  aria-label={`Book an appointment for ${service.title} at Teeth and Gums Care`}
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-white px-6 py-4 text-center text-sm font-black text-blue-700 shadow-xl shadow-blue-900/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto sm:min-w-[230px] sm:text-base"
                >
                  <ServiceIcon
                    aria-hidden="true"
                    className="fa-solid fa-calendar-check mr-3"
                  />
                  Book Consultation
                </Link>
              </HoverButton>
            </StaggerItem>

            <StaggerItem className="w-full sm:w-auto">
              <HoverButton className="block w-full sm:w-auto">
                <Link prefetch={false}
                  href="/services"
                  aria-label="View all dental services at Teeth and Gums Care"
                  className="group inline-flex min-h-[56px] w-full items-center justify-center rounded-full border-2 border-white/70 px-6 py-4 text-center text-sm font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto sm:min-w-[220px] sm:text-base"
                >
                  View All Services
                  <ServiceIcon
                    aria-hidden="true"
                    className="fa-solid fa-arrow-right ml-3 transition duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </HoverButton>
            </StaggerItem>
          </StaggerContainer>

          <p className="mx-auto mt-8 max-w-2xl text-sm font-semibold leading-7 text-white/80">
            Treatment recommendations are provided after a clinical
            consultation with our dental team.
          </p>
      </div>
    </section>
  );
}

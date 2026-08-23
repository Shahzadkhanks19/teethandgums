import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faCalendarCheck, faCircleCheck, faClipboardCheck, faComments, faHeartCircleCheck, faStethoscope, faTooth, faUserDoctor } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";

import { processSteps } from "@/data/processSteps";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";


function resolveProcessIcon(icon: string): IconDefinition {
  const icons: Record<string, IconDefinition> = {
    "fa-solid fa-calendar-check": faCalendarCheck,
    "fa-solid fa-comments": faComments,
    "fa-solid fa-user-doctor": faUserDoctor,
    "fa-solid fa-tooth": faTooth,
    "fa-solid fa-stethoscope": faStethoscope,
    "fa-solid fa-clipboard-check": faClipboardCheck,
    "fa-solid fa-heart-circle-check": faHeartCircleCheck,
  };

  return icons[icon] ?? faCircleCheck;
}

export default function ProcessSection() {
  return (
    <section
      aria-labelledby="process-section-title"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[44px] bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 px-5 py-16 shadow-[0_30px_90px_rgba(37,99,235,0.18)] sm:px-8 lg:px-12 lg:py-20">
          {/* Internal decorative glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] xl:gap-20">
            {/* Section introduction */}
            <FadeUp>
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/15 px-5 py-2 text-sm font-extrabold text-white backdrop-blur-xl">
                  Simple Process
                </span>

                <h2
                  id="process-section-title"
                  className="mt-5 max-w-[620px] text-4xl font-black leading-tight tracking-tight text-white md:text-5xl"
                >
                  Your Dental Visit Made Simple and Comfortable
                </h2>

                <p className="mt-6 max-w-[600px] text-lg leading-8 text-blue-50/95">
                  From your first consultation to treatment and follow-up, every
                  step is designed to keep you informed, relaxed, and confident.
                </p>

                <FadeUp delay={0.15}>
                  <HoverButton>
                    <Link prefetch={false}
                      href="/book-appointment"
                      aria-label="Book your dental appointment"
                      className="group mt-8 inline-flex items-center rounded-full bg-white px-9 py-4 font-black text-blue-700 shadow-[0_18px_40px_rgba(255,255,255,0.20)] transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(255,255,255,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                      Book Your Visit

                      <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </HoverButton>
                </FadeUp>
              </div>
            </FadeUp>

            {/* Process steps */}
            <StaggerContainer className="grid w-full min-w-0 gap-5">
              {processSteps.map((step) => (
                <StaggerItem key={step.number} className="h-full">
                  <HoverCard className="h-full">
                    <article className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(15,23,42,0.18)] sm:p-6">
                      {/* Left hover accent */}
                      <div
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />

                      {/* Subtle card glow */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl"
                      />

                      <div className="relative z-10 flex flex-col gap-5 min-[420px]:flex-row min-[420px]:items-start">
                        <div className="flex shrink-0 items-center gap-4">
                          <span
                            aria-hidden="true"
                            className="text-3xl font-black leading-none text-blue-700 sm:text-4xl"
                          >
                            {step.number}
                          </span>

                          <div
                            aria-hidden="true"
                            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg text-white shadow-lg shadow-blue-100 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-14 sm:w-14 sm:text-xl"
                          >
                            <FontAwesomeIcon icon={resolveProcessIcon(step.icon)} aria-hidden="true" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-lg font-black text-slate-900 sm:text-xl">
                            {step.title}
                          </h3>

                          <p className="mt-2 break-words text-[15px] leading-7 text-slate-500">
                            {step.text}
                          </p>
                        </div>
                      </div>
                    </article>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
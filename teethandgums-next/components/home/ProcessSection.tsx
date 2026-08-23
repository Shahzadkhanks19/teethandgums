import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRight,
  faCalendarCheck,
  faCircleCheck,
  faClipboardCheck,
  faComments,
  faHeartCircleCheck,
  faStethoscope,
  faTooth,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { processSteps } from "@/data/processSteps";
import { FadeUp, HoverButton, StaggerContainer, StaggerItem } from "@/components/animations";

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
    <section aria-labelledby="process-section-title" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#062d5c] via-[#08376f] to-[#0b3c91] px-5 py-14 shadow-[0_34px_90px_rgba(8,55,111,0.22)] sm:px-8 lg:px-12 lg:py-16">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[48px] border-white/5" />
          <div aria-hidden="true" className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative z-10 grid items-start gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:gap-16">
            <FadeUp>
              <div className="lg:sticky lg:top-28">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-blue-100 backdrop-blur">
                  Your Smile Journey
                </span>
                <h2 id="process-section-title" className="mt-6 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-white md:text-5xl">
                  Simple Steps.
                  <span className="block text-blue-200">Exceptional Care.</span>
                </h2>
                <p className="mt-5 max-w-[500px] text-lg leading-8 text-blue-50/80">
                  A clear, comfortable treatment journey designed to keep you informed and confident from consultation to follow-up.
                </p>

                <FadeUp delay={0.15}>
                  <HoverButton>
                    <Link
                      prefetch={false}
                      href="/book-appointment"
                      className="group mt-8 inline-flex items-center rounded-2xl bg-white px-7 py-4 font-black text-[#08376f] shadow-[0_16px_36px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5"
                    >
                      Begin Your Journey
                      <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 text-blue-600 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </HoverButton>
                </FadeUp>
              </div>
            </FadeUp>

            <div className="relative">
              <div aria-hidden="true" className="absolute bottom-8 left-[29px] top-8 w-px bg-gradient-to-b from-blue-300 via-white/30 to-transparent sm:left-[37px]" />

              <StaggerContainer className="grid gap-5">
                {processSteps.slice(0, 4).map((step, index) => (
                  <StaggerItem key={step.number}>
                    <article className="group relative flex gap-5 rounded-[28px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur transition-all duration-300 hover:translate-x-1 hover:border-white/20 hover:bg-white/[0.12] sm:gap-6 sm:p-6">
                      <div className="relative z-10 grid h-[58px] w-[58px] shrink-0 place-items-center rounded-[20px] border border-white/15 bg-white text-xl text-blue-700 shadow-[0_14px_30px_rgba(0,0,0,0.14)] sm:h-[74px] sm:w-[74px] sm:text-2xl">
                        <FontAwesomeIcon icon={resolveProcessIcon(step.icon)} aria-hidden="true" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-blue-200">Step 0{index + 1}</span>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                        <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">{step.title}</h3>
                        <p className="mt-2 max-w-[620px] text-sm leading-7 text-blue-50/75">{step.text}</p>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

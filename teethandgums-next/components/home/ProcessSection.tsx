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
    <section
      aria-labelledby="process-section-title"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-gradient-to-r from-blue-50 via-white to-blue-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">Our Process</span>
            <h2 id="process-section-title" className="mt-5 text-4xl font-black tracking-[-0.035em] text-[#08376f] md:text-5xl">
              Your <span className="text-blue-600">Smile Journey</span>, Simplified
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
              A clear, comfortable experience from your first conversation through treatment and follow-up care.
            </p>
          </div>
        </FadeUp>

        <div className="relative mt-16">
          <div aria-hidden="true" className="absolute left-[8%] right-[8%] top-10 hidden border-t-2 border-dashed border-blue-200 lg:block" />
          <StaggerContainer className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.slice(0, 4).map((step, index) => (
              <StaggerItem key={step.number}>
                <article className="group relative h-full rounded-[26px] border border-blue-100 bg-white p-6 text-center shadow-[0_16px_45px_rgba(8,55,111,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)]">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-[8px] border-white bg-gradient-to-br from-blue-600 to-[#0b3c91] text-2xl text-white shadow-[0_16px_40px_rgba(37,99,235,0.24)] transition group-hover:scale-105">
                    <FontAwesomeIcon icon={resolveProcessIcon(step.icon)} aria-hidden="true" />
                  </div>
                  <div className="mx-auto mt-5 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black tracking-[0.12em] text-blue-700">0{index + 1}</div>
                  <h3 className="mt-4 text-xl font-black text-[#08376f]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{step.text}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <FadeUp delay={0.18}>
          <div className="mt-12 flex justify-center">
            <HoverButton>
              <Link
                prefetch={false}
                href="/book-appointment"
                className="group inline-flex items-center rounded-2xl border border-blue-200 bg-white px-7 py-4 font-black text-[#08376f] shadow-sm transition hover:bg-blue-50"
              >
                Begin Your Smile Journey
                <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 text-blue-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </HoverButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

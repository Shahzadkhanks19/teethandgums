import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarCheck,
  faHeartCircleCheck,
  faMicroscope,
  faPhone,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import Link from "next/link";
import { FadeUp, HoverButton, HoverCard, StaggerContainer, StaggerItem } from "@/components/animations";

interface TrustPoint {
  icon: IconDefinition;
  text: string;
}

const trustPoints: TrustPoint[] = [
  { icon: faUserDoctor, text: "Experienced Dentists" },
  { icon: faMicroscope, text: "Modern Technology" },
  { icon: faHeartCircleCheck, text: "Patient-Centered Care" },
];

export default function CTASection() {
  return (
    <section aria-labelledby="home-cta-title" className="relative overflow-hidden bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#08376f] via-[#0b3c91] to-blue-600 px-6 py-10 shadow-[0_28px_80px_rgba(8,55,111,0.22)] sm:px-8 lg:px-12 lg:py-12">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[38px] border-white/5" />
          <div aria-hidden="true" className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <FadeUp>
              <div>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-100 backdrop-blur">
                  <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-2" />
                  Book Your Visit Today
                </span>
                <h2 id="home-cta-title" className="mt-5 max-w-[720px] text-4xl font-black leading-[1.04] tracking-[-0.035em] text-white md:text-5xl lg:text-[58px]">
                  Ready for a Healthier, Brighter Smile?
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50/90">
                  From preventive care to advanced treatment and complete smile makeovers, our team is here to guide you with clarity and comfort.
                </p>

                <StaggerContainer className="mt-7 flex flex-wrap gap-3">
                  {trustPoints.map((item) => (
                    <StaggerItem key={item.text}>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur">
                        <FontAwesomeIcon icon={item.icon} aria-hidden="true" className="text-blue-200" />
                        {item.text}
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <HoverCard>
                <aside className="rounded-[28px] border border-white/20 bg-white p-6 shadow-[0_24px_65px_rgba(8,55,111,0.22)] sm:p-8">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-xl text-blue-700">
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-[#08376f]">Book Your Appointment</h3>
                  <p className="mt-3 leading-7 text-slate-500">Choose the most convenient way to connect with our clinic team.</p>

                  <div className="mt-6 grid gap-3">
                    <HoverButton>
                      <Link prefetch={false} href="/book-appointment" className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-6 py-4 font-black text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)]">
                        <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-2" />
                        Book Appointment
                      </Link>
                    </HoverButton>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <a href="https://wa.me/919829824356" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-2xl border border-green-200 bg-green-50 px-5 py-3.5 font-black text-green-700">
                        <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} className="mr-2" />
                        WhatsApp
                      </a>
                      <a href="tel:+919829824356" itemProp="telephone" className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3.5 font-black text-blue-700">
                        <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="mr-2" />
                        Call Now
                      </a>
                    </div>
                  </div>
                </aside>
              </HoverCard>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

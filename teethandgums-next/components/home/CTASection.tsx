import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCalendarCheck, faHeartCircleCheck, faMicroscope, faPhone, faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import Link from "next/link";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

/* ============================================
   TYPES
============================================ */

interface TrustPoint {
  icon: IconDefinition;
  text: string;
}

/* ============================================
   DATA
============================================ */

const trustPoints: TrustPoint[] = [
  {
    icon: faUserDoctor,
    text: "Experienced Dentists",
  },
  {
    icon: faMicroscope,
    text: "Modern Technology",
  },
  {
    icon: faHeartCircleCheck,
    text: "Patient-Centered Care",
  },
];

/* ============================================
   COMPONENT
============================================ */

export default function CTASection() {
  return (
    <section
      aria-labelledby="home-cta-title"
      className="relative mt-10 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 py-20 lg:py-28"
    >
      {/* Decorative background elements */}
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
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 xl:gap-20">
        {/* Main CTA copy */}
        <FadeUp>
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/15 px-5 py-2 text-sm font-extrabold text-white backdrop-blur-xl">
              <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="me-2" />
              Book Your Visit Today
            </span>

            <h2
              id="home-cta-title"
              className="mt-6 max-w-[720px] text-4xl font-black leading-tight tracking-tight text-white md:text-6xl"
            >
              Ready for a Healthier,
              <br />
              Brighter Smile?
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50/95">
              Whether you need a routine dental check-up, cosmetic treatment,
              gum care, dental implants, orthodontic treatment, or a complete
              smile makeover, our experienced dental team is here to help.
            </p>

            <StaggerContainer className="mt-9 flex flex-wrap gap-4">
              {trustPoints.map((item) => (
                <StaggerItem key={item.text}>
                  <div className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/15 px-5 py-3 font-bold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/25">
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </span>

                    <span>{item.text}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeUp>

        {/* Appointment card */}
        <FadeUp delay={0.15}>
          <HoverCard className="h-full">
            <aside className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white p-8 text-center shadow-[0_30px_90px_rgba(15,23,42,0.22)] lg:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="relative z-10 mx-auto mb-6 grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition-transform duration-300 hover:rotate-6 hover:scale-105"
              >
                <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} />
              </div>

              <h3 className="relative z-10 text-3xl font-black text-slate-900">
                Book Your Appointment
              </h3>

              <p className="relative z-10 mx-auto mt-4 max-w-sm leading-7 text-slate-500">
                Schedule your consultation and receive personalized dental care
                from our experienced team.
              </p>

              <div className="relative z-10 mt-8 grid gap-4">
                <HoverButton>
                  <Link prefetch={false}
                    href="/book-appointment"
                    aria-label="Book a dental appointment"
                    className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 px-6 py-4 font-black text-white shadow-lg shadow-blue-100 transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="me-2 transition-transform duration-300 group-hover:scale-110" />
                    Book Appointment
                  </Link>
                </HoverButton>

                <HoverButton>
                  <a
                    href="https://wa.me/919829824356"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Teeth and Gums Care on WhatsApp"
                    className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-black text-white shadow-lg shadow-green-100 transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} className="me-2 transition-transform duration-300 group-hover:scale-110" />
                    WhatsApp Us
                  </a>
                </HoverButton>

                <HoverButton>
                  <a
                    href="tel:+919829824356"
                    itemProp="telephone"
                    aria-label="Call Teeth and Gums Care"
                    className="group inline-flex w-full items-center justify-center rounded-2xl border-2 border-blue-600 px-6 py-4 font-black text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="me-2 transition-transform duration-300 group-hover:rotate-6" />
                    Call Now
                  </a>
                </HoverButton>
              </div>

              <p className="relative z-10 mt-6 text-sm leading-6 text-slate-400">
                Same-day appointments may be available depending on the clinic
                schedule.
              </p>
            </aside>
          </HoverCard>
        </FadeUp>
      </div>
    </section>
  );
}
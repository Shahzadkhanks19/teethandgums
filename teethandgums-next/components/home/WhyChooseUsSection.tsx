import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faHeartCircleCheck, faMicroscope, faShieldHeart, faUserDoctor } from "@fortawesome/free-solid-svg-icons";

import {
  FadeUp,
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

/* ============================================
   TYPES
============================================ */

interface WhyChooseItem {
  icon: IconDefinition;
  title: string;
  text: string;
}

/* ============================================
   DATA
============================================ */

const whyChooseUs: WhyChooseItem[] = [
  {
    icon: faUserDoctor,
    title: "Experienced Dentists",
    text: "Skilled dental professionals providing personalized treatment plans for every patient.",
  },
  {
    icon: faMicroscope,
    title: "Modern Technology",
    text: "Advanced equipment for accurate diagnosis, precise treatment, and a more comfortable experience.",
  },
  {
    icon: faHeartCircleCheck,
    title: "Patient-Centered Care",
    text: "Gentle treatment, clear communication, and a calm environment designed around your comfort.",
  },
  {
    icon: faShieldHeart,
    title: "Complete Dental Care",
    text: "From preventive checkups to advanced treatments and smile makeovers, all your dental needs are covered.",
  },
];

/* ============================================
   COMPONENT
============================================ */

export default function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="why-choose-title"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      {/* Decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-50 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-100">
              Why Choose Us
            </span>

            <h2
              id="why-choose-title"
              className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl"
            >
              Dental Care You Can Trust
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              Combining clinical expertise, modern technology, and
              compassionate care to deliver healthier smiles and confident
              treatment experiences.
            </p>
          </div>
        </FadeUp>

        {/* Feature cards */}
        <StaggerContainer className="mt-14 grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <HoverCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(37,99,235,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)]">
                  {/* Top accent */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {/* Decorative card glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl"
                  />

                  {/* Icon */}
                  <RotateIn>
                    <div
                      aria-hidden="true"
                      className="relative z-10 mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:shadow-2xl"
                    >
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </div>
                  </RotateIn>

                  {/* Content */}
                  <h3 className="relative z-10 text-xl font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="relative z-10 mt-4 flex-1 leading-7 text-slate-500">
                    {item.text}
                  </p>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
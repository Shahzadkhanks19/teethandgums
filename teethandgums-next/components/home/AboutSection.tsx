import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowRightLong, faCalendarCheck, faHeartCircleCheck, faMicroscope, faShieldHeart, faUserDoctor } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Link from "next/link";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  HoverImage,
  SlideRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

/* ============================================
   TYPES
============================================ */

interface AboutFeature {
  icon: IconDefinition;
  text: string;
}

/* ============================================
   DATA
============================================ */

const features: AboutFeature[] = [
  {
    icon: faUserDoctor,
    text: "Experienced Dental Experts",
  },
  {
    icon: faMicroscope,
    text: "Advanced Dental Technology",
  },
  {
    icon: faHeartCircleCheck,
    text: "Patient-Centered Care",
  },
  {
    icon: faShieldHeart,
    text: "Safe & Comfortable Treatment",
  },
];

/* ============================================
   COMPONENT
============================================ */

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-section-title"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Decorative background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 xl:gap-20">
        {/* Clinic image */}
        <SlideRight>
          <HoverImage>
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-8 -top-8 h-44 w-44 rounded-full bg-blue-100/50 blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl"
              />

              <div className="relative overflow-hidden rounded-[36px] bg-white p-2 shadow-[0_30px_80px_rgba(37,99,235,0.12)]">
                <div className="relative overflow-hidden rounded-[30px]">
                  <Image
                    src="/images/common/about.webp"
                    alt="Modern dental clinic interior at Teeth and Gums Care in Jodhpur"
                    width={650}
                    height={720}
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 50vw"
                    quality={75}
                    className="h-auto min-h-[420px] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] max-sm:min-h-[320px]"
                  />
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute bottom-6 right-6 rounded-[28px] bg-gradient-to-br from-blue-600 to-blue-900 px-6 py-5 text-center text-white shadow-[0_20px_45px_rgba(37,99,235,0.28)] sm:bottom-8 sm:right-8 sm:px-8 sm:py-6">
                <p className="text-3xl font-black leading-none sm:text-4xl">
                  25+
                </p>

                <span className="mt-2 block text-xs font-semibold text-white/90 sm:text-sm">
                  Years of Experience
                </span>
              </div>
            </div>
          </HoverImage>
        </SlideRight>

        {/* About content */}
        <div className="lg:pl-4">
          <FadeUp>
            <span className="inline-flex rounded-full bg-blue-50 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-100">
              About Our Clinic
            </span>

            <h2
              id="about-section-title"
              className="mt-5 max-w-[620px] text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Creating Healthy Smiles With{" "}
              <span className="text-blue-600">Modern Dental Care</span>
            </h2>

            <p className="mt-5 max-w-[610px] text-lg font-bold leading-8 text-blue-600">
              Your smile is our priority, and your comfort is our commitment.
            </p>

            <p className="mt-5 max-w-[610px] leading-8 text-slate-500">
              At Teeth and Gums Care, we provide advanced, compassionate, and
              personalized dental care for patients of all ages.
            </p>

            <p className="mt-4 max-w-[610px] leading-8 text-slate-500">
              From preventive dentistry and gum care to cosmetic treatments,
              smile designing, and complete oral healthcare, every treatment is
              planned around your comfort and long-term oral health.
            </p>
          </FadeUp>

          {/* Features */}
          <StaggerContainer className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <StaggerItem key={feature.text} className="h-full">
                <HoverCard className="h-full">
                  <article className="group flex h-full items-center gap-4 rounded-[20px] border border-blue-100 bg-blue-50/60 p-5 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-white hover:shadow-xl">
                    <div
                      aria-hidden="true"
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
                    >
                      <FontAwesomeIcon icon={feature.icon} aria-hidden="true" />
                    </div>

                    <p className="font-semibold leading-6 text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
                      {feature.text}
                    </p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTAs */}
          <FadeUp delay={0.15}>
            <div className="mt-9 flex flex-col gap-5 sm:flex-row">
              <HoverButton>
                <Link prefetch={false}
                  href="/about"
                  aria-label="Learn more about Teeth and Gums Care"
                  className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-9 py-4 text-center font-extrabold text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] transition-shadow duration-300 hover:shadow-[0_22px_45px_rgba(37,99,235,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                >
                  Learn More About Us

                  <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </HoverButton>

              <HoverButton>
                <Link prefetch={false}
                  href="/book-appointment"
                  aria-label="Book a dental appointment"
                  className="group inline-flex w-full items-center justify-center rounded-full border-2 border-blue-600 px-9 py-4 text-center font-extrabold text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                >
                  Book Appointment

                  <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="ml-3 transition-transform duration-300 group-hover:scale-110" />
                </Link>
              </HoverButton>
            </div>
          </FadeUp>

          {/* Brand statement */}
          <FadeUp delay={0.25}>
            <p className="mt-10 text-xl font-black italic tracking-wide text-blue-800">
              “Healthy Smiles, Lifelong Confidence”
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
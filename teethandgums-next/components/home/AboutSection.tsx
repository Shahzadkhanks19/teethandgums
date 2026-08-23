import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRightLong,
  faCalendarCheck,
  faHeartCircleCheck,
  faMicroscope,
  faShieldHeart,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";

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

interface AboutFeature {
  icon: IconDefinition;
  text: string;
}

const features: AboutFeature[] = [
  { icon: faUserDoctor, text: "Experienced Dental Experts" },
  { icon: faMicroscope, text: "Advanced Dental Technology" },
  { icon: faHeartCircleCheck, text: "Patient-Centered Care" },
  { icon: faShieldHeart, text: "Safe & Comfortable Treatment" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-section-title"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-blue-100/55 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 xl:gap-20">
        <div className="order-2 lg:order-1">
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-blue-700">
              About Our Clinic
            </span>
            <h2
              id="about-section-title"
              className="mt-6 max-w-[650px] text-4xl font-black leading-[1.04] tracking-[-0.035em] text-[#08376f] md:text-5xl xl:text-[58px]"
            >
              A Clinic Built on <span className="text-blue-600">Trust.</span>
              <br />Focused on <span className="text-blue-600">You.</span>
            </h2>
            <p className="mt-6 max-w-[620px] text-lg font-semibold leading-8 text-slate-600">
              Your smile is our priority, and your comfort is our commitment.
            </p>
            <p className="mt-4 max-w-[620px] leading-8 text-slate-500">
              At Teeth and Gums Care, we provide advanced, compassionate, and personalized dental care for patients of all ages. Every treatment is planned around your comfort, clarity, and long-term oral health.
            </p>
          </FadeUp>

          <StaggerContainer className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <StaggerItem key={feature.text}>
                <HoverCard>
                  <article className="group flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_10px_30px_rgba(8,55,111,0.06)] transition-all hover:border-blue-200 hover:shadow-[0_16px_42px_rgba(37,99,235,0.12)]">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                      <FontAwesomeIcon icon={feature.icon} aria-hidden="true" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-700">{feature.text}</p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <HoverButton>
                <Link
                  prefetch={false}
                  href="/about"
                  className="group inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-7 py-4 font-black text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)] sm:w-auto"
                >
                  Discover Our Story
                  <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </HoverButton>
              <HoverButton>
                <Link
                  prefetch={false}
                  href="/book-appointment"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-blue-200 bg-white px-7 py-4 font-black text-[#08376f] transition hover:bg-blue-50 sm:w-auto"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-2 text-blue-600" />
                  Book Appointment
                </Link>
              </HoverButton>
            </div>
          </FadeUp>
        </div>

        <SlideRight>
          <HoverImage>
            <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
              <div className="relative col-span-2 overflow-hidden rounded-[34px] border border-blue-100 bg-blue-50 p-2 shadow-[0_24px_65px_rgba(8,55,111,0.12)] sm:col-span-1 sm:row-span-2">
                <div className="relative h-[420px] overflow-hidden rounded-[28px] sm:h-full sm:min-h-[520px]">
                  <Image
                    src="/images/common/about.webp"
                    alt="Modern dental clinic interior at Teeth and Gums Care in Jodhpur"
                    fill
                    sizes="(max-width: 640px) calc(100vw - 32px), 50vw"
                    quality={76}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08376f]/25 via-transparent to-transparent" />
                </div>
              </div>

              <div className="relative hidden min-h-[250px] overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_18px_45px_rgba(8,55,111,0.10)] sm:block">
                <Image
                  src="/images/common/slider3.webp"
                  alt="Dental treatment environment at Teeth and Gums Care"
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>

              <div className="relative hidden min-h-[250px] overflow-hidden rounded-[30px] bg-gradient-to-br from-[#08376f] via-[#0b3c91] to-blue-600 p-7 text-white shadow-[0_20px_50px_rgba(8,55,111,0.24)] sm:flex sm:flex-col sm:justify-end">
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[22px] border-white/10" />
                <div className="relative z-10 text-5xl font-black">25+</div>
                <div className="relative z-10 mt-2 text-sm font-extrabold uppercase tracking-[0.12em] text-blue-100">Years of Experience</div>
                <p className="relative z-10 mt-4 text-sm leading-6 text-white/80">Creating healthy, confident smiles with thoughtful care.</p>
              </div>
            </div>
          </HoverImage>
        </SlideRight>
      </div>
    </section>
  );
}

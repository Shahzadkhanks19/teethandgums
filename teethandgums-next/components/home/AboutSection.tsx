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
  title: string;
  text: string;
}

const features: AboutFeature[] = [
  { icon: faUserDoctor, title: "Experienced Experts", text: "Personalised care backed by decades of clinical experience." },
  { icon: faMicroscope, title: "Advanced Dentistry", text: "Modern tools and precise treatment planning for better outcomes." },
  { icon: faHeartCircleCheck, title: "Patient-Centred", text: "Every visit is designed around your comfort and confidence." },
  { icon: faShieldHeart, title: "Safety First", text: "Strict hygiene and sterilisation standards at every step." },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-section-title"
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] xl:gap-20">
          <FadeUp>
            <div className="max-w-[620px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                About Teeth &amp; Gums Care
              </span>

              <h2
                id="about-section-title"
                className="mt-6 text-4xl font-black leading-[1.03] tracking-[-0.045em] text-[#08376f] md:text-5xl xl:text-[62px]"
              >
                Dentistry Designed Around
                <span className="block text-blue-600">Trust, Precision &amp; Comfort.</span>
              </h2>

              <p className="mt-6 max-w-[590px] text-lg font-semibold leading-8 text-slate-600">
                Modern dental care should feel reassuring, transparent, and personal from the moment you walk in.
              </p>

              <p className="mt-4 max-w-[600px] leading-8 text-slate-500">
                At Teeth and Gums Care, we combine clinical experience, thoughtful communication, and advanced dentistry to create treatment journeys focused on long-term oral health and confident smiles.
              </p>

              <StaggerContainer className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <StaggerItem key={feature.title}>
                    <HoverCard className="h-full">
                      <article className="group h-full rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_12px_35px_rgba(8,55,111,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_50px_rgba(37,99,235,0.12)]">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 transition duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-[#0b3c91] group-hover:text-white">
                          <FontAwesomeIcon icon={feature.icon} aria-hidden="true" />
                        </div>
                        <h3 className="mt-4 text-base font-black text-[#08376f]">{feature.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{feature.text}</p>
                      </article>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeUp delay={0.15}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
          </FadeUp>

          <SlideRight>
            <HoverImage>
              <div className="relative mx-auto w-full max-w-[680px]">
                <div aria-hidden="true" className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-blue-100/80 blur-3xl" />
                <div aria-hidden="true" className="absolute -bottom-8 -right-8 h-44 w-44 rounded-full bg-blue-200/50 blur-3xl" />

                <div className="grid grid-cols-12 gap-4">
                  <div className="relative col-span-12 min-h-[430px] overflow-hidden rounded-[38px] border border-blue-100 bg-blue-50 p-2 shadow-[0_28px_80px_rgba(8,55,111,0.14)] sm:col-span-7 sm:min-h-[600px]">
                    <div className="relative h-full overflow-hidden rounded-[32px]">
                      <Image
                        src="/images/common/about.webp"
                        alt="Modern dental clinic interior at Teeth and Gums Care in Jodhpur"
                        fill
                        sizes="(max-width: 640px) calc(100vw - 32px), 55vw"
                        quality={78}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#08376f]/25 via-transparent to-transparent" />
                    </div>
                  </div>

                  <div className="col-span-12 grid gap-4 sm:col-span-5">
                    <div className="relative min-h-[260px] overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(8,55,111,0.10)]">
                      <Image
                        src="/images/common/slider3.webp"
                        alt="Dental treatment environment at Teeth and Gums Care"
                        fill
                        sizes="(max-width: 640px) calc(100vw - 32px), 25vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#08376f] via-[#0b3c91] to-blue-600 p-7 text-white shadow-[0_24px_60px_rgba(8,55,111,0.24)]">
                      <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[20px] border-white/10" />
                      <div className="relative z-10 text-5xl font-black tracking-[-0.04em]">25+</div>
                      <div className="relative z-10 mt-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100">Years of Experience</div>
                      <p className="relative z-10 mt-5 text-sm leading-6 text-white/80">Trusted clinical experience with a commitment to modern, ethical dentistry.</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-7 left-1/2 w-[88%] -translate-x-1/2 rounded-[26px] border border-blue-100 bg-white/95 px-5 py-4 shadow-[0_20px_55px_rgba(8,55,111,0.14)] backdrop-blur-xl sm:w-[78%]">
                  <div className="grid grid-cols-3 divide-x divide-blue-100 text-center">
                    <div className="px-2">
                      <div className="text-lg font-black text-[#08376f]">5000+</div>
                      <div className="text-[11px] font-bold text-slate-500">Patients</div>
                    </div>
                    <div className="px-2">
                      <div className="text-lg font-black text-[#08376f]">4.9/5</div>
                      <div className="text-[11px] font-bold text-slate-500">Rating</div>
                    </div>
                    <div className="px-2">
                      <div className="text-lg font-black text-[#08376f]">Jodhpur</div>
                      <div className="text-[11px] font-bold text-slate-500">Trusted Care</div>
                    </div>
                  </div>
                </div>
              </div>
            </HoverImage>
          </SlideRight>
        </div>
      </div>
    </section>
  );
}

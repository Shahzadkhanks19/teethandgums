import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
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

interface DoctorPreview {
  name: string;
  role: string;
  text: string;
  image: string;
  position: string;
}

/* ============================================
   DATA
============================================ */

const doctors: DoctorPreview[] = [
  {
    name: "Dr. Sunita Khetani",
    role: "Dental Expert",
    text: "Compassionate, patient-focused dental care tailored to every smile.",
    image: "/images/common/sunita.webp",
    position: "center 18%",
  },
  {
    name: "Dr. Vishal Khetani",
    role: "Dental Expert",
    text: "Modern dental treatment with a strong focus on comfort and precision.",
    image: "/images/common/vishal.webp",
    position: "center 18%",
  },
];

/* ============================================
   COMPONENT
============================================ */

export default function DoctorPreviewSection() {
  return (
    <section
      aria-labelledby="doctor-preview-title"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[44px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white px-5 py-16 shadow-[0_28px_80px_rgba(37,99,235,0.10)] sm:px-8 lg:px-12 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] xl:gap-20">
            {/* Section content */}
            <FadeUp>
              <div>
                <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-200/60">
                  Meet Our Experts
                </span>

                <h2
                  id="doctor-preview-title"
                  className="mt-5 max-w-[560px] text-4xl font-black leading-tight text-slate-900 md:text-5xl"
                >
                  Experienced Hands For Your Smile
                </h2>

                <p className="mt-6 max-w-[560px] leading-8 text-slate-500">
                  Our dental team focuses on ethical treatment, patient comfort,
                  accurate diagnosis, and long-term oral wellness.
                </p>

                <FadeUp delay={0.15}>
                  <HoverButton>
                    <Link prefetch={false}
                      href="/about"
                      aria-label="Learn more about our dentists"
                      className="group mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-9 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] transition-shadow duration-300 hover:shadow-[0_22px_45px_rgba(37,99,235,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                      Know More About Us

                      <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </HoverButton>
                </FadeUp>
              </div>
            </FadeUp>

            {/* Doctor cards */}
            <StaggerContainer className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <StaggerItem key={doctor.name} className="h-full">
                  <HoverCard className="h-full">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-blue-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(37,99,235,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)]">
                      {/* Top accent */}
                      <div
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />

                      {/* Decorative glow */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl"
                      />

                      {/* Doctor image */}
                      <div className="relative z-10 mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-8 border-white bg-blue-50 shadow-lg shadow-blue-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                        <Image
                          src={doctor.image}
                          alt={`${doctor.name}, dental expert at Teeth and Gums Care`}
                          width={160}
                          height={160}
                          sizes="128px"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition: doctor.position }}
                        />
                      </div>

                      {/* Doctor details */}
                      <h3 className="relative z-10 text-xl font-black text-slate-900">
                        {doctor.name}
                      </h3>

                      <p className="relative z-10 mt-2 font-extrabold text-blue-600">
                        {doctor.role}
                      </p>

                      <p className="relative z-10 mt-3 flex-1 leading-7 text-slate-500">
                        {doctor.text}
                      </p>

                      {/* Availability badge */}
                      <div className="relative z-10 mt-6 inline-flex items-center justify-center self-center rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-100">
                        <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2" />
                        Available For Consultation
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
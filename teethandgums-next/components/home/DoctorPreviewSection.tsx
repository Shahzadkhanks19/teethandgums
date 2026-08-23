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

interface DoctorPreview {
  name: string;
  role: string;
  text: string;
  image: string;
  position: string;
}

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

export default function DoctorPreviewSection() {
  return (
    <section
      aria-labelledby="doctor-preview-title"
      className="relative overflow-hidden bg-white py-20 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[38px] border border-blue-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#eef5ff_100%)] px-5 py-14 shadow-[0_28px_80px_rgba(8,55,111,0.10)] sm:px-8 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] xl:gap-16">
            <FadeUp>
              <div>
                <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">Meet Our Experts</span>
                <h2 id="doctor-preview-title" className="mt-6 max-w-[540px] text-4xl font-black leading-[1.05] tracking-[-0.035em] text-[#08376f] md:text-5xl">
                  Experienced Hands for <span className="text-blue-600">Every Smile</span>
                </h2>
                <p className="mt-6 max-w-[560px] text-lg leading-8 text-slate-500">
                  Our dental team focuses on ethical treatment, patient comfort, accurate diagnosis, and long-term oral wellness.
                </p>
                <FadeUp delay={0.15}>
                  <HoverButton>
                    <Link
                      prefetch={false}
                      href="/about"
                      className="group mt-8 inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-7 py-4 font-black text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)]"
                    >
                      Know More About Us
                      <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </HoverButton>
                </FadeUp>
              </div>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <StaggerItem key={doctor.name} className="h-full">
                  <HoverCard className="h-full">
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(8,55,111,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_70px_rgba(37,99,235,0.15)]">
                      <div className="relative aspect-[4/4.7] overflow-hidden bg-blue-50">
                        <Image
                          src={doctor.image}
                          alt={`${doctor.name}, dental expert at Teeth and Gums Care`}
                          fill
                          sizes="(max-width: 639px) calc(100vw - 64px), 290px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          style={{ objectPosition: doctor.position }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08376f]/85 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
                            <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-1.5" />
                            Available for Consultation
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-2xl font-black text-[#08376f]">{doctor.name}</h3>
                        <p className="mt-1 text-sm font-black uppercase tracking-[0.11em] text-blue-600">{doctor.role}</p>
                        <p className="mt-4 flex-1 text-sm leading-7 text-slate-500">{doctor.text}</p>
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

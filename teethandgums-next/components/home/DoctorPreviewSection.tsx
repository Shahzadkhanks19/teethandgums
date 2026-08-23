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
    <section aria-labelledby="doctor-preview-title" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[42px] border border-blue-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#edf4ff_100%)] p-5 shadow-[0_30px_90px_rgba(8,55,111,0.11)] sm:p-8 lg:p-12">
          <div aria-hidden="true" className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.7fr_1.3fr] xl:gap-16">
            <FadeUp>
              <div>
                <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-blue-700 shadow-sm">Meet Our Experts</span>
                <h2 id="doctor-preview-title" className="mt-6 max-w-[520px] text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#08376f] md:text-5xl">
                  Experienced Hands.
                  <span className="block text-blue-600">Thoughtful Dentistry.</span>
                </h2>
                <p className="mt-6 max-w-[540px] text-lg leading-8 text-slate-500">
                  Our dental team brings together clinical experience, careful diagnosis, ethical treatment planning, and a genuine focus on patient comfort.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {["Ethical Treatment", "Clear Communication", "Long-term Care"].map((item) => (
                    <span key={item} className="rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-extrabold text-[#08376f] shadow-sm">{item}</span>
                  ))}
                </div>

                <FadeUp delay={0.15}>
                  <HoverButton>
                    <Link
                      prefetch={false}
                      href="/about"
                      className="group mt-8 inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-7 py-4 font-black text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)]"
                    >
                      Meet Our Dental Team
                      <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </HoverButton>
                </FadeUp>
              </div>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {doctors.map((doctor, index) => (
                <StaggerItem key={doctor.name} className="h-full">
                  <HoverCard className="h-full">
                    <article className={`group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[34px] border shadow-[0_24px_70px_rgba(8,55,111,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(37,99,235,0.18)] ${index === 0 ? "border-[#08376f] bg-[#08376f]" : "border-blue-100 bg-white"}`}>
                      <div className="relative min-h-[360px] flex-1 overflow-hidden">
                        <Image
                          src={doctor.image}
                          alt={`${doctor.name}, dental expert at Teeth and Gums Care`}
                          fill
                          sizes="(max-width: 639px) calc(100vw - 64px), 360px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                          style={{ objectPosition: doctor.position }}
                        />
                        <div className={`absolute inset-0 ${index === 0 ? "bg-gradient-to-t from-[#08376f] via-[#08376f]/15 to-transparent" : "bg-gradient-to-t from-white via-transparent to-transparent"}`} />

                        <span className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/35 bg-white/90 px-3 py-1.5 text-xs font-black text-blue-700 shadow-sm backdrop-blur">
                          <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-1.5" />
                          Available for Consultation
                        </span>
                      </div>

                      <div className={`relative z-10 p-6 ${index === 0 ? "text-white" : "text-[#08376f]"}`}>
                        <h3 className="text-2xl font-black tracking-[-0.02em]">{doctor.name}</h3>
                        <p className={`mt-1 text-xs font-black uppercase tracking-[0.14em] ${index === 0 ? "text-blue-200" : "text-blue-600"}`}>{doctor.role}</p>
                        <p className={`mt-4 text-sm leading-7 ${index === 0 ? "text-blue-50/75" : "text-slate-500"}`}>{doctor.text}</p>
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

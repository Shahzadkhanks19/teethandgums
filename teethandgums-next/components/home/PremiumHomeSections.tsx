import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCalendarCheck,
  faCheck,
  faCircleCheck,
  faHeartCircleCheck,
  faMicroscope,
  faShieldHeart,
  faStar,
  faTooth,
  faUserDoctor,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import { servicesData } from "@/data/services";
import { processSteps } from "@/data/processSteps";

interface RawService {
  title: string;
  slug: string;
  image?: ImageProps["src"];
  heroImage?: ImageProps["src"];
  serviceImage?: ImageProps["src"];
  description?: string;
  shortDescription?: string;
  excerpt?: string;
  hero?: { description?: string; image?: ImageProps["src"] };
}

interface FeaturePoint {
  icon: IconDefinition;
  title: string;
  text: string;
}

const featuredServices = (servicesData as unknown as RawService[])
  .slice(0, 6)
  .map((service) => ({
    title: service.title,
    slug: service.slug,
    image:
      service.image ??
      service.heroImage ??
      service.serviceImage ??
      service.hero?.image ??
      "/images/services/service-placeholder.webp",
    description:
      service.shortDescription ??
      service.description ??
      service.excerpt ??
      service.hero?.description ??
      `Explore ${service.title} at Teeth and Gums Care.`,
  }));

const standards: FeaturePoint[] = [
  {
    icon: faShieldHeart,
    title: "Clinical Safety First",
    text: "Thoughtful sterilisation, hygiene, and patient-safety protocols at every stage.",
  },
  {
    icon: faMicroscope,
    title: "Precision Dentistry",
    text: "Modern diagnostic and treatment technology used with clinical judgment and care.",
  },
  {
    icon: faHeartCircleCheck,
    title: "Comfort-Led Care",
    text: "Clear communication, gentle treatment planning, and a calm patient experience.",
  },
  {
    icon: faUserDoctor,
    title: "Experienced Hands",
    text: "Long-standing clinical experience focused on ethical, personalised dentistry.",
  },
];

const metrics = [
  { value: "5000+", label: "Happy Patients", icon: faUsers },
  { value: "25+", label: "Years of Experience", icon: faUserDoctor },
  { value: "1200+", label: "Smiles Transformed", icon: faTooth },
  { value: "4.9/5", label: "Patient Rating", icon: faStar },
];

const doctors = [
  {
    name: "Dr. Sunita Khetani",
    image: "/images/common/sunita.webp",
    note: "Compassionate, patient-first dental care with a focus on comfort and long-term oral health.",
  },
  {
    name: "Dr. Vishal Khetani",
    image: "/images/common/vishal.webp",
    note: "Modern, precise dentistry with careful diagnosis and personalised treatment planning.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      {children}
    </span>
  );
}

export default function PremiumHomeSections() {
  return (
    <div className="bg-white">
      <section className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-32" aria-labelledby="home-story-title">
        <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-50 blur-3xl" />
        <div className="mx-auto grid max-w-[1380px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:px-8">
          <div>
            <SectionLabel>Our Philosophy</SectionLabel>
            <h2 id="home-story-title" className="mt-6 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl">
              Dentistry should feel <span className="text-blue-600">clear, calm, and considered.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Teeth and Gums Care brings together experienced dentistry, modern clinical tools, and a deeply patient-focused approach in Jodhpur.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Personalised treatment planning", "Modern dental technology", "Transparent communication", "Comfort-focused appointments"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3.5 shadow-[0_8px_28px_rgba(8,55,111,0.05)]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700">
                    <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="text-xs" />
                  </span>
                  <span className="text-sm font-extrabold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/about" prefetch={false} className="inline-flex items-center justify-center rounded-2xl bg-[#08376f] px-6 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#0b3c91]">
                Discover Our Clinic
                <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
              </Link>
              <Link href="/book-appointment" prefetch={false} className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-4 font-black text-[#08376f] transition hover:bg-blue-50">
                Book a Consultation
              </Link>
            </div>
          </div>

          <div className="grid min-h-[560px] grid-cols-12 grid-rows-12 gap-3 sm:gap-4">
            <div className="relative col-span-12 row-span-7 overflow-hidden rounded-[32px] border border-blue-100 shadow-[0_24px_70px_rgba(8,55,111,0.12)] sm:col-span-8 sm:row-span-12">
              <Image src="/images/common/interior.webp" alt="Interior of Teeth and Gums Care dental clinic" fill sizes="(max-width: 639px) 100vw, 55vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08376f]/85 to-transparent p-6 pt-20 text-white sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">Modern clinical environment</p>
                <p className="mt-2 max-w-md text-xl font-black">Designed around precision, hygiene, and patient comfort.</p>
              </div>
            </div>
            <div className="relative col-span-7 row-span-5 overflow-hidden rounded-[28px] border border-blue-100 sm:col-span-4 sm:row-span-7">
              <Image src="/images/common/about.webp" alt="Dental care at Teeth and Gums Care" fill sizes="(max-width: 639px) 60vw, 25vw" className="object-cover" />
            </div>
            <div className="col-span-5 row-span-5 flex flex-col justify-end rounded-[28px] bg-gradient-to-br from-[#08376f] to-[#0b3c91] p-5 text-white shadow-[0_20px_60px_rgba(8,55,111,0.24)] sm:col-span-4 sm:row-span-5 sm:p-7">
              <div className="text-4xl font-black sm:text-5xl">25+</div>
              <div className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100">Years of Experience</div>
              <p className="mt-4 hidden text-sm leading-6 text-white/75 sm:block">Long-standing care built on trust, consistency, and clinical experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 lg:px-8" aria-label="Clinic achievements">
        <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[30px] border border-blue-100 bg-[#08376f] shadow-[0_22px_65px_rgba(8,55,111,0.18)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {metrics.map((item) => (
              <article key={item.label} className="group border-b border-r border-white/10 p-6 last:border-r-0 sm:p-8 lg:border-b-0">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-lg text-blue-200 transition group-hover:bg-white group-hover:text-blue-700">
                    <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-2xl font-black text-white sm:text-3xl">{item.value}</div>
                    <div className="mt-1 text-xs font-bold text-blue-100/80 sm:text-sm">{item.label}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="relative overflow-hidden py-20 sm:py-24 lg:py-32" aria-labelledby="premium-services-title">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <SectionLabel>Clinical Expertise</SectionLabel>
              <h2 id="premium-services-title" className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl">
                Care that adapts to <span className="text-blue-600">your smile.</span>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-2xl text-lg leading-8 text-slate-600">From preventive care to restorative and cosmetic dentistry, treatments are planned with clarity, precision, and long-term oral health in mind.</p>
              <Link href="/services" prefetch={false} className="mt-5 inline-flex items-center font-black text-blue-700 transition hover:text-[#08376f]">
                Explore all treatments <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {featuredServices.map((service, index) => {
              const layout = [
                "lg:col-span-5 lg:row-span-2",
                "lg:col-span-4",
                "lg:col-span-3",
                "lg:col-span-3",
                "lg:col-span-4",
                "lg:col-span-7",
              ][index];
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  prefetch={false}
                  className={`group relative overflow-hidden rounded-[28px] border border-blue-100 bg-blue-50 shadow-[0_14px_45px_rgba(8,55,111,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(8,55,111,0.12)] ${layout}`}
                >
                  <Image src={service.image} alt={service.title} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 40vw" className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="max-w-md rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                      <h3 className="text-lg font-black text-[#08376f] sm:text-xl">{service.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{service.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7faff] py-20 sm:py-24 lg:py-32" aria-labelledby="standards-title">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative min-h-[560px] overflow-hidden rounded-[36px] bg-[#08376f] shadow-[0_28px_80px_rgba(8,55,111,0.2)]">
              <Image src="/images/common/slider3.webp" alt="Modern treatment space at Teeth and Gums Care" fill sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062c5a] via-[#08376f]/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
                <SectionLabel>Our Standards</SectionLabel>
                <h2 id="standards-title" className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  High standards should be <span className="text-blue-200">felt in every detail.</span>
                </h2>
                <p className="mt-5 max-w-lg leading-7 text-blue-50/85">From diagnosis to treatment planning and follow-up, the experience is designed to feel professional, transparent, and reassuring.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {standards.map((item, index) => (
                <article key={item.title} className={`rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_12px_40px_rgba(8,55,111,0.06)] sm:p-7 ${index === 0 || index === 3 ? "sm:translate-y-8" : ""}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-xl text-blue-700">
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </span>
                    <span className="text-4xl font-black text-blue-50">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black text-[#08376f]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-32" aria-labelledby="journey-title">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-[#062c5a] via-[#08376f] to-[#0b3c91] p-6 shadow-[0_28px_85px_rgba(8,55,111,0.22)] sm:p-9 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <SectionLabel>Your Visit</SectionLabel>
                <h2 id="journey-title" className="mt-5 text-4xl font-black leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl">A simpler path to a healthier smile.</h2>
                <p className="mt-5 leading-7 text-blue-50/80">Every visit follows a clear journey, so you always know what happens next.</p>
                <Link href="/book-appointment" prefetch={false} className="mt-7 inline-flex items-center rounded-2xl bg-white px-6 py-4 font-black text-[#08376f] transition hover:-translate-y-0.5">
                  Start with a Consultation
                  <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {processSteps.slice(0, 4).map((step, index) => (
                  <article key={step.number} className="rounded-[24px] border border-white/10 bg-white/[0.08] p-5 backdrop-blur-sm sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#08376f]">
                        <span className="text-sm font-black">0{index + 1}</span>
                      </span>
                      <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" className="text-blue-200" />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-blue-50/75">{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7faff] py-20 sm:py-24 lg:py-32" aria-labelledby="doctors-title">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Meet the Dentists</SectionLabel>
            <h2 id="doctors-title" className="mt-6 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl">Experience you can trust. Care you can feel.</h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {doctors.map((doctor, index) => (
              <article key={doctor.name} className="group grid overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_18px_60px_rgba(8,55,111,0.08)] sm:grid-cols-[0.8fr_1.2fr]">
                <div className="relative min-h-[340px] overflow-hidden bg-blue-50 sm:min-h-[400px]">
                  <Image src={doctor.image} alt={`${doctor.name} at Teeth and Gums Care`} fill sizes="(max-width: 639px) 100vw, 25vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.02]" />
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-8">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">Dental Expert · 0{index + 1}</span>
                    <h3 className="mt-3 text-3xl font-black tracking-tight text-[#08376f]">{doctor.name}</h3>
                    <p className="mt-5 leading-7 text-slate-500">{doctor.note}</p>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
                      <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" className="text-blue-600" />
                      Available for consultation
                    </div>
                    <Link href="/about" prefetch={false} className="mt-5 inline-flex items-center font-black text-blue-700 hover:text-[#08376f]">
                      Know our team <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="booking-cta-title">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] bg-[#08376f] px-6 py-10 text-white shadow-[0_28px_85px_rgba(8,55,111,0.22)] sm:px-10 lg:px-14 lg:py-14">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[34px] border-white/5" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <SectionLabel>Ready When You Are</SectionLabel>
                <h2 id="booking-cta-title" className="mt-5 max-w-3xl text-4xl font-black leading-[1.03] tracking-[-0.04em] sm:text-5xl">Your next confident smile can start with one conversation.</h2>
                <p className="mt-5 max-w-2xl leading-7 text-blue-50/80">Book a consultation and let our team guide you through the right treatment options for your needs.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/book-appointment" prefetch={false} className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 font-black text-[#08376f] transition hover:-translate-y-0.5">
                  <FontAwesomeIcon icon={faCalendarCheck} aria-hidden="true" className="mr-2 text-blue-600" />
                  Book Appointment
                </Link>
                <a href="tel:+919829824356" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-black text-white transition hover:bg-white/15">Call +91 98298 24356</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

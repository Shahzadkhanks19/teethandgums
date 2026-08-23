import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCalendarCheck,
  faCheck,
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

const metrics = [
  { value: "5000+", label: "Happy Patients", icon: faUsers },
  { value: "25+", label: "Years of Experience", icon: faUserDoctor },
  { value: "1200+", label: "Smiles Transformed", icon: faTooth },
  { value: "4.9/5", label: "Patient Rating", icon: faStar },
];

const standards = [
  {
    icon: faShieldHeart,
    title: "Clinical Safety",
    text: "Careful sterilisation, hygiene and patient-safety protocols throughout your visit.",
  },
  {
    icon: faMicroscope,
    title: "Modern Dentistry",
    text: "Contemporary diagnostic and treatment tools used for precise, comfortable care.",
  },
  {
    icon: faHeartCircleCheck,
    title: "Patient-First Care",
    text: "Clear communication, calm appointments and treatment plans tailored to your needs.",
  },
  {
    icon: faUserDoctor,
    title: "Experienced Team",
    text: "Decades of combined clinical experience focused on ethical and personalised dentistry.",
  },
];

const doctors = [
  {
    name: "Dr. Sunita Khetani",
    image: "/images/common/sunita.webp",
    text: "Compassionate dental care focused on comfort, clarity and long-term oral health.",
  },
  {
    name: "Dr. Vishal Khetani",
    image: "/images/common/vishal.webp",
    text: "Modern dentistry built around careful diagnosis, precision and personalised treatment planning.",
  },
];

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      {children}
    </span>
  );
}

export default function PremiumHomeSections() {
  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28" aria-labelledby="home-intro-title">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-50/80 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionEyebrow>Teeth &amp; Gums Care</SectionEyebrow>
            <h2 id="home-intro-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#08376f] sm:text-5xl lg:text-6xl">
              World-class thinking.
              <span className="block text-blue-600">Personal dental care.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              A modern dental clinic built around thoughtful diagnosis, transparent communication, clinical precision and a calm patient experience.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Personalised treatment plans",
                "Modern dental technology",
                "Clear, ethical communication",
                "Comfort-focused appointments",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700">
                    <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="text-xs" />
                  </span>
                  <span className="text-sm font-extrabold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/about" prefetch={false} className="inline-flex items-center justify-center rounded-2xl bg-[#08376f] px-6 py-4 font-black text-white transition hover:bg-[#0b3c91]">
                Discover Our Clinic
                <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
              </Link>
              <Link href="/book-appointment" prefetch={false} className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-4 font-black text-[#08376f] transition hover:bg-blue-50">
                Book Appointment
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-blue-100 bg-blue-50 shadow-[0_24px_70px_rgba(8,55,111,0.12)] sm:row-span-2">
              <Image
                src="/images/common/interior.webp"
                alt="Interior of Teeth and Gums Care dental clinic"
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 320px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08376f]/90 via-[#08376f]/40 to-transparent p-6 pt-20 text-white">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-100">Modern Clinical Environment</p>
                <p className="mt-2 text-xl font-black">Designed around precision, hygiene and comfort.</p>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-blue-100 bg-blue-50 shadow-[0_16px_45px_rgba(8,55,111,0.08)]">
              <Image
                src="/images/common/about.webp"
                alt="Dental care at Teeth and Gums Care"
                fill
                sizes="(max-width: 639px) 100vw, 320px"
                className="object-cover"
              />
            </div>

            <div className="flex min-h-44 flex-col justify-end rounded-[28px] bg-gradient-to-br from-[#08376f] to-[#0b3c91] p-6 text-white shadow-[0_18px_50px_rgba(8,55,111,0.2)]">
              <div className="text-4xl font-black">25+</div>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100">Years of Experience</p>
              <p className="mt-3 text-sm leading-6 text-white/75">Trusted care built through consistency, experience and clinical judgment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8" aria-label="Clinic achievements">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#08376f] shadow-[0_20px_60px_rgba(8,55,111,0.18)]">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {metrics.map((item) => (
              <article key={item.label} className="border-b border-r border-white/10 p-5 sm:p-7 lg:border-b-0">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-blue-200 sm:h-12 sm:w-12">
                    <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-2xl font-black text-white sm:text-3xl">{item.value}</div>
                    <div className="mt-1 text-xs font-bold text-blue-100/80 sm:text-sm">{item.label}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#f7faff] py-20 sm:py-24 lg:py-28" aria-labelledby="home-services-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionEyebrow>Our Services</SectionEyebrow>
            <h2 id="home-services-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#08376f] sm:text-5xl lg:text-6xl">
              Complete dental care,
              <span className="block text-blue-600">beautifully organised.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Explore treatments designed around comfort, precision and long-term oral health.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                prefetch={false}
                className="group overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_12px_38px_rgba(8,55,111,0.06)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_55px_rgba(8,55,111,0.1)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[#08376f]">{service.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">{service.description}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-black text-blue-700">
                    Explore Treatment
                    <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services" prefetch={false} className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-4 font-black text-[#08376f] transition hover:bg-blue-50">
              View All Services
              <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="standards-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionEyebrow>Our Standards</SectionEyebrow>
              <h2 id="standards-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#08376f] sm:text-5xl">
                Premium care is not decoration.
                <span className="block text-blue-600">It is how every detail feels.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                The clinic experience is designed to feel professional, reassuring and considered from the first conversation through follow-up care.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {standards.map((item) => (
                  <article key={item.title} className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_10px_32px_rgba(8,55,111,0.05)]">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-lg text-blue-700">
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-black text-[#08376f]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] bg-[#08376f] shadow-[0_28px_80px_rgba(8,55,111,0.18)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/common/slider3.webp"
                alt="Treatment space at Teeth and Gums Care"
                fill
                sizes="(max-width: 1023px) 100vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062c5a]/95 via-[#08376f]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">A calmer dental experience</p>
                <p className="mt-3 max-w-xl text-2xl font-black leading-tight sm:text-3xl">Advanced care in a modern, comfortable clinical environment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#08376f] py-20 text-white sm:py-24 lg:py-28" aria-labelledby="journey-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-100">Your Visit</span>
            <h2 id="journey-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              A simple journey from concern to confidence.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.slice(0, 4).map((step, index) => (
              <article key={step.number} className="rounded-[26px] border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-sm font-black text-[#08376f]">0{index + 1}</span>
                  <span className="text-4xl font-black text-white/10">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-blue-50/75">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="doctors-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionEyebrow>Our Doctors</SectionEyebrow>
              <h2 id="doctors-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#08376f] sm:text-5xl">
                Experienced hands.
                <span className="block text-blue-600">Thoughtful care.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-600 sm:text-lg">
                Meet the clinicians behind a patient-first approach to modern dentistry.
              </p>
              <Link href="/about" prefetch={false} className="mt-7 inline-flex items-center font-black text-blue-700">
                Learn more about our team
                <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <article key={doctor.name} className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_16px_50px_rgba(8,55,111,0.08)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-blue-50">
                    <Image
                      src={doctor.image}
                      alt={`${doctor.name} at Teeth and Gums Care`}
                      fill
                      sizes="(max-width: 639px) 100vw, 50vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-[#08376f]">{doctor.name}</h3>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-blue-600">Dental Expert</p>
                    <p className="mt-4 text-sm leading-7 text-slate-500">{doctor.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28" aria-labelledby="home-booking-title">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] bg-gradient-to-r from-[#08376f] via-[#0b3c91] to-blue-600 p-7 text-white shadow-[0_24px_75px_rgba(8,55,111,0.22)] sm:p-9 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
                <FontAwesomeIcon icon={faCalendarCheck} aria-hidden="true" />
              </div>
              <h2 id="home-booking-title" className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">Ready to take the next step for your smile?</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50/80 sm:text-lg">Book a consultation and speak with our team about the right treatment plan for you.</p>
            </div>
            <Link href="/book-appointment" prefetch={false} className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-7 py-4 font-black text-[#08376f] transition hover:bg-blue-50 lg:w-auto">
              Book Appointment
              <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

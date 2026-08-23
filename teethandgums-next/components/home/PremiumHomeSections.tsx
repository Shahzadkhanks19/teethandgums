import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCalendarCheck,
  faCheck,
  faCircleCheck,
  faMicroscope,
  faShieldHeart,
  faStar,
  faTooth,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import { homeFaqs } from "@/data/homeFaqs";
import { servicesData } from "@/data/services";

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

const services = (servicesData as unknown as RawService[])
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
      `Learn more about ${service.title} at Teeth and Gums Care.`,
  }));

const clinicPromises = [
  {
    icon: faShieldHeart,
    title: "Safety without compromise",
    text: "Sterilisation, hygiene and clinical protocols are built into every appointment.",
  },
  {
    icon: faMicroscope,
    title: "Precision before procedure",
    text: "Modern diagnostics support careful treatment planning and clearer decisions.",
  },
  {
    icon: faUserDoctor,
    title: "Experience that reassures",
    text: "Long-standing clinical experience combined with a calm, patient-first approach.",
  },
];

const reviews = [
  {
    name: "Lovekush Upadhyay",
    text: "The treatment quality is excellent, the explanation was clear, and the entire experience felt comfortable and professional.",
  },
  {
    name: "Pramod Khanna",
    text: "Knowledgeable and meticulous doctors made the root canal and implant process smooth and reassuring.",
  },
  {
    name: "Harshraj Singh",
    text: "A warm, welcoming and highly professional clinic where every step of the treatment was explained clearly.",
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      {children}
    </span>
  );
}

export default function PremiumHomeSections() {
  const leadService = services[0];
  const secondaryServices = services.slice(1, 5);

  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-blue-100/70 py-20 sm:py-24 lg:py-28" aria-labelledby="clinic-standard-title">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-blue-50/80 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>The Teeth &amp; Gums Standard</Eyebrow>
              <h2 id="clinic-standard-title" className="mt-6 max-w-3xl text-4xl font-black leading-[1.03] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-[64px]">
                Modern dentistry should feel
                <span className="block text-blue-600">calm, precise and human.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Our approach combines experienced clinicians, thoughtful diagnosis and a modern clinical environment so patients understand their options and feel confident about every step of care.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Transparent treatment planning", "Comfort-focused appointments", "Modern clinical technology", "Long-term oral health focus"].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-blue-100 py-3 text-sm font-extrabold text-slate-700">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700">
                      <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="text-xs" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/book-appointment" prefetch={false} className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-6 py-4 font-black text-white shadow-[0_16px_40px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5">
                  <FontAwesomeIcon icon={faCalendarCheck} aria-hidden="true" className="mr-2" />
                  Book Appointment
                </Link>
                <Link href="/about" prefetch={false} className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-4 font-black text-[#08376f] transition hover:bg-blue-50">
                  Meet the Clinic
                  <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.25fr_0.75fr]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-blue-50 shadow-[0_28px_80px_rgba(8,55,111,0.14)] sm:aspect-auto sm:min-h-[560px]">
                <Image src="/images/common/interior.webp" alt="Modern interior of Teeth and Gums Care" fill sizes="(max-width: 639px) 100vw, 48vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062c5a]/95 via-[#08376f]/55 to-transparent p-6 pt-24 text-white sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">Clinical environment</p>
                  <p className="mt-3 text-2xl font-black leading-tight">Designed around hygiene, precision and patient comfort.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-rows-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-blue-50 sm:aspect-auto">
                  <Image src="/images/common/about.webp" alt="Dental care at Teeth and Gums Care" fill sizes="(max-width: 639px) 100vw, 24vw" className="object-cover" />
                </div>
                <div className="flex min-h-48 flex-col justify-end rounded-[28px] bg-[#08376f] p-6 text-white">
                  <div className="text-5xl font-black">25+</div>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100">Years of experience</p>
                  <p className="mt-4 text-sm leading-6 text-blue-50/80">Experience built through consistent, ethical and personalised dental care.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 sm:py-24 lg:py-28" aria-labelledby="signature-care-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Eyebrow>Signature Care</Eyebrow>
              <h2 id="signature-care-title" className="mt-6 text-4xl font-black leading-[1.04] tracking-[-0.04em] text-[#08376f] sm:text-5xl lg:text-6xl">
                Treatment, without the template feeling.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Every treatment plan starts with your needs, your diagnosis and the outcome that makes sense for your oral health.
            </p>
          </div>

          {leadService ? (
            <div className="mt-12 grid overflow-hidden rounded-[34px] border border-blue-100 bg-[#f7faff] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative aspect-[16/10] min-h-0 bg-white lg:aspect-auto lg:min-h-[480px]">
                <Image src={leadService.image} alt={leadService.title} fill sizes="(max-width: 1023px) 100vw, 54vw" className="object-contain p-6 sm:p-10" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Featured treatment</span>
                <h3 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#08376f] sm:text-4xl">{leadService.title}</h3>
                <p className="mt-5 text-base leading-8 text-slate-600">{leadService.description}</p>
                <Link href={`/services/${leadService.slug}`} prefetch={false} className="mt-7 inline-flex items-center self-start font-black text-blue-700">
                  Explore treatment
                  <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {secondaryServices.map((service, index) => (
              <Link key={service.slug} href={`/services/${service.slug}`} prefetch={false} className="group grid overflow-hidden rounded-[26px] border border-blue-100 bg-white sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-[4/3] bg-blue-50 sm:aspect-auto sm:min-h-[150px]">
                  <Image src={service.image} alt={service.title} fill sizes="(max-width: 639px) 100vw, 140px" className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex min-w-0 items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-500">0{index + 2}</span>
                    <h3 className="mt-1 text-lg font-black text-[#08376f]">{service.title}</h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/services" prefetch={false} className="inline-flex items-center rounded-2xl border border-blue-200 bg-white px-6 py-4 font-black text-[#08376f] transition hover:bg-blue-50">
              View All Treatments
              <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#08376f] py-20 text-white sm:py-24 lg:py-28" aria-labelledby="clinical-promise-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[34px] bg-[#062c5a] lg:aspect-[4/5]">
              <Image src="/images/common/slider3.webp" alt="Treatment space at Teeth and Gums Care" fill sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062c5a]/95 via-[#08376f]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-blue-100">Clinical promise</span>
                <h2 id="clinical-promise-title" className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                  Premium care is what happens before, during and after treatment.
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {clinicPromises.map((item, index) => (
                <article key={item.title} className="grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[72px_1fr] sm:items-start">
                  <div className="flex items-center gap-3 sm:block">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-blue-200">
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-blue-200 sm:mt-3 sm:block">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{item.title}</h3>
                    <p className="mt-3 max-w-xl leading-8 text-blue-50/75">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="specialists-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Your Dentists</Eyebrow>
            <h2 id="specialists-title" className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#08376f] sm:text-5xl lg:text-6xl">
              Two experienced clinicians. One shared standard of care.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              { name: "Dr. Sunita Khetani", image: "/images/common/sunita.webp", text: "Compassionate, patient-focused dentistry with emphasis on comfort, clarity and long-term oral health." },
              { name: "Dr. Vishal Khetani", image: "/images/common/vishal.webp", text: "Modern dentistry centered on careful diagnosis, precision and personalised treatment planning." },
            ].map((doctor) => (
              <article key={doctor.name} className="grid overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(8,55,111,0.08)] sm:grid-cols-[0.9fr_1.1fr]">
                <div className="relative aspect-[4/5] min-h-0 bg-blue-50 sm:aspect-auto sm:min-h-[390px]">
                  <Image src={doctor.image} alt={`${doctor.name}, dentist at Teeth and Gums Care`} fill sizes="(max-width: 639px) 100vw, 320px" className="object-cover object-top" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">Dental expert</span>
                  <h3 className="mt-3 text-2xl font-black text-[#08376f] sm:text-3xl">{doctor.name}</h3>
                  <p className="mt-5 leading-8 text-slate-600">{doctor.text}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-black text-blue-700">
                    <FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" />
                    Available for consultation
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7faff] py-20 sm:py-24 lg:py-28" aria-labelledby="patient-proof-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Eyebrow>Patient Proof</Eyebrow>
              <h2 id="patient-proof-title" className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#08376f] sm:text-5xl">
                Trust is earned in the chair, not in the brochure.
              </h2>
              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
                <div className="text-3xl font-black text-[#08376f]">4.9/5</div>
                <div>
                  <div className="flex gap-1 text-[#FBBC05]" aria-label="5 star rating">
                    {[0, 1, 2, 3, 4].map((star) => <FontAwesomeIcon key={star} icon={faStar} aria-hidden="true" />)}
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-500">Google patient rating</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote key={review.name} className="rounded-[26px] border border-blue-100 bg-white p-6 shadow-[0_12px_36px_rgba(8,55,111,0.05)]">
                  <div className="flex gap-1 text-[#FBBC05]">
                    {[0, 1, 2, 3, 4].map((star) => <FontAwesomeIcon key={star} icon={faStar} aria-hidden="true" className="text-sm" />)}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-600">“{review.text}”</p>
                  <footer className="mt-5 text-sm font-black text-[#08376f]">{review.name}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="home-faq-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <Eyebrow>Before Your Visit</Eyebrow>
              <h2 id="home-faq-title" className="mt-6 text-4xl font-black tracking-[-0.04em] text-[#08376f] sm:text-5xl">
                Straight answers to common questions.
              </h2>
              <p className="mt-5 max-w-lg leading-8 text-slate-600">Clear information helps make the first visit easier and more comfortable.</p>
            </div>

            <div className="divide-y divide-blue-100 border-y border-blue-100">
              {homeFaqs.map((faq, index) => (
                <details key={faq.id} open={index === 0} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-black text-[#08376f] marker:hidden sm:text-lg">
                    <span>{faq.question}</span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24" aria-labelledby="home-final-cta-title">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[34px] bg-gradient-to-r from-[#08376f] via-[#0b3c91] to-blue-600 px-6 py-10 text-white shadow-[0_26px_75px_rgba(8,55,111,0.22)] sm:px-10 sm:py-12 lg:px-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-100">Your next visit</p>
              <h2 id="home-final-cta-title" className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl lg:text-5xl">A healthier smile starts with one clear conversation.</h2>
            </div>
            <Link href="/book-appointment" prefetch={false} className="inline-flex w-full shrink-0 items-center justify-center rounded-2xl bg-white px-7 py-4 font-black text-[#08376f] shadow-lg transition hover:-translate-y-0.5 lg:w-auto">
              <FontAwesomeIcon icon={faTooth} aria-hidden="true" className="mr-2 text-blue-600" />
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

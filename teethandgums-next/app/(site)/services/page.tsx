import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowRight,
  faAward,
  faCalendarCheck,
  faCircleCheck,
  faPhone,
  faShieldHeart,
  faStar,
  faTooth,
  faUserDoctor,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { servicesData } from "@/data/services";
import ServicesCounterCard from "@/components/services/ServicesCounterCard";
import { createMetadata } from "@/lib/seo";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";


const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata = createMetadata({
  title: "Dental Services in Jodhpur",
  description:
    "Explore comprehensive dental services at Teeth and Gums Care, Jodhpur including dental implants, root canal treatment, cosmetic dentistry, smile designing, braces, aligners, veneers, teeth whitening and preventive dental care.",
  canonical: "/services",
  image: "/images/og/services.jpeg",
  imageAlt: "Dental services offered at Teeth and Gums Care in Jodhpur",
  keywords: [
    "Dental Services in Jodhpur",
    "Best Dental Clinic in Jodhpur",
    "Dentist in Jodhpur",
    "Dental Implants Jodhpur",
    "Root Canal Treatment Jodhpur",
    "Single Sitting Root Canal Jodhpur",
    "Root Canal Retreatment Jodhpur",
    "Smile Designing Jodhpur",
    "Cosmetic Dentistry Jodhpur",
    "Dental Veneers Jodhpur",
    "Braces Treatment Jodhpur",
    "Orthodontic Treatment Jodhpur",
    "Dental Aligners Jodhpur",
    "Teeth Whitening Jodhpur",
    "Painless Tooth Extraction Jodhpur",
    "Apicectomy Jodhpur",
    "Periodontal Treatment Jodhpur",
    "Preventive Dentistry Jodhpur",
    "Family Dentist Jodhpur",
    "Teeth and Gums Care",
  ],
});

const introCards: Array<{ icon: IconDefinition; title: string; text: string }> = [
  {
    icon: faUserDoctor,
    title: "Expert Dentists",
    text: "Personalized care from experienced dental professionals.",
  },
  {
    icon: faTooth,
    title: "Complete Care",
    text: "From preventive care to advanced smile treatments.",
  },
  {
    icon: faShieldHeart,
    title: "Comfort First",
    text: "Safe, hygienic, and comfortable dental experience.",
  },
];

const highlights: Array<{ icon: IconDefinition; end: number; suffix: string; title: string; decimals?: number }> = [
  {
    icon: faTooth,
    end: servicesData.length,
    suffix: "",
    title: "Dental Treatments",
  },
  {
    icon: faUsers,
    end: 5000,
    suffix: "+",
    title: "Happy Patients",
  },
  {
    icon: faAward,
    end: 25,
    suffix: "+",
    title: "Years Experience",
  },
  {
    icon: faStar,
    end: 4.9,
    suffix: "/5",
    title: "Patient Rating",
    decimals: 1,
  },
];

const whyChooseItems = [
  "Modern equipment",
  "Personalized treatment planning",
  "Clean and patient-friendly clinic",
];

export default function ServicesPage() {
  const servicesPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dental Services in Jodhpur",
    description:
      "Explore complete dental treatments at Teeth and Gums Care in Jodhpur, including implants, root canal treatment, cosmetic dentistry, orthodontics, gum care, and preventive dentistry.",
    url: `${siteUrl}/services`,
    isPartOf: {
      "@type": "WebSite",
      name: "Teeth and Gums Care",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Dental Treatments",
      numberOfItems: servicesData.length,
      itemListElement: servicesData.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: `${siteUrl}/services/${service.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${siteUrl}/services`,
      },
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="overflow-x-hidden outline-none"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(servicesPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />
      <section
        aria-labelledby="services-title"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-5 py-28 text-center text-white lg:py-36"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,.12),transparent_35%)]"
        />

        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-2xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto max-w-5xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-6 py-3 text-sm font-black backdrop-blur">
              Advanced Dental Care
            </span>

            <h1
              id="services-title"
              className="mt-6 text-4xl font-black leading-tight md:text-6xl"
            >
              Complete Dental Services
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
              Comprehensive dental treatments designed to keep your smile
              healthy, beautiful, comfortable and confident.
            </p>

            <StaggerContainer className="relative z-10 mx-auto mt-10 grid w-full max-w-[280px] grid-cols-1 gap-4 sm:max-w-none sm:grid-cols-2 sm:justify-center md:flex">
              <StaggerItem className="w-full sm:w-auto">
                <HoverButton className="block w-full sm:w-auto">
                  <Link prefetch={false}
                    href="/book-appointment"
                    aria-label="Book a dental appointment"
                    className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-white px-6 py-4 text-center text-sm font-black text-blue-700 shadow-xl transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto sm:min-w-[210px]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-3" />
                    Book Appointment
                  </Link>
                </HoverButton>
              </StaggerItem>

              <StaggerItem className="w-full sm:w-auto">
                <HoverButton className="block w-full sm:w-auto">
                  <Link prefetch={false}
                    href="/contact"
                    aria-label="Contact Teeth and Gums Care"
                    className="inline-flex min-h-[56px] w-full items-center justify-center rounded-full border-2 border-white/70 px-6 py-4 text-center text-sm font-black text-white transition duration-300 motion-safe:hover:-translate-y-1 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto sm:min-w-[190px]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="mr-3" />
                    Contact Clinic
                  </Link>
                </HoverButton>
              </StaggerItem>
            </StaggerContainer>
        </div>
      </section>

      <section className="-mt-16 scroll-mt-24 pb-12 lg:-mt-20">
        <div className="mx-auto max-w-6xl px-4">
          <StaggerContainer className="grid items-stretch gap-7 md:grid-cols-3">
            {introCards.map((card) => (
              <StaggerItem key={card.title}>
                <HoverCard className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)]">
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <RotateIn>
                      <div aria-hidden="true" className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-2xl text-white shadow-lg shadow-blue-200 transition duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110 group-hover:shadow-2xl">
                        <FontAwesomeIcon icon={card.icon} />
                      </div>
                    </RotateIn>

                    <h3 className="text-xl font-black text-slate-900">
                      {card.title}
                    </h3>

                    <p className="mt-4 flex-1 leading-7 text-slate-500">
                      {card.text}
                    </p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="scroll-mt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, index) => (
              <ServicesCounterCard
                key={item.title}
                index={index}
                icon={item.icon}
                end={item.end}
                suffix={item.suffix}
                title={item.title}
                decimals={item.decimals}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="services-grid-title" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-white to-blue-50 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
                What We Offer
              </span>

              <h2 id="services-grid-title" className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                {servicesData.length} Specialized Dental Treatments
                <br />
                Under One Roof
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                From routine dental care and smile enhancement to advanced root
                canal procedures, dental implants, aligners, braces and cosmetic
                dentistry — we provide complete oral healthcare for patients of
                every age.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid items-stretch gap-7 md:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((service, index) => (
              <StaggerItem key={service.slug} className="h-full">
                <HoverCard className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)]">
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-0 z-20 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <figure className="relative aspect-square w-full shrink-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                        <Image
                          src={service.image}
                          alt={`${service.title} treatment at Teeth and Gums Care Dental Clinic in Jodhpur`}
                          fill
                          sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 42px), 390px"
                          quality={65}
                          loading={index < 3 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "low"}
                          decoding="async"
                          className="object-contain p-2 transition duration-500 motion-safe:group-hover:scale-[1.03]"
                        />

                        <RotateIn>
                          <div className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-black text-blue-600 shadow-lg transition duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                        </RotateIn>
                    </figure>

                    <div className="relative flex min-h-0 flex-1 flex-col p-8">
                      <RotateIn>
                        <div
                          aria-hidden="true"
                          className="-mt-16 mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-xl text-white shadow-xl shadow-blue-200 transition duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110"
                        >
                          <FontAwesomeIcon aria-hidden="true" icon={faTooth} />
                        </div>
                      </RotateIn>

                      <h3 className="text-xl font-black leading-tight text-slate-900">
                        {service.title}
                      </h3>

                      <p className="mt-4 flex-1 leading-7 text-slate-500">
                        {service.shortDesc}
                      </p>

                      <HoverButton>
                        <Link prefetch={false}
                          href={`/services/${service.slug}`}
                          aria-label={`Learn more about ${service.title}`}
                          className="group/link mt-6 inline-flex self-start items-center gap-2 rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-600 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                          Learn More about {service.title}
                          <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="transition duration-300 motion-safe:group-hover/link:translate-x-1" />
                        </Link>
                      </HoverButton>
                    </div>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section aria-labelledby="services-why-title" className="[content-visibility:auto] [contain-intrinsic-size:650px] relative scroll-mt-24 overflow-hidden bg-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <HoverCard>
              <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 p-8 text-white shadow-[0_30px_90px_rgba(37,99,235,.18)] md:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl"
                />

                <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
                  <div>
                    <span className="inline-flex rounded-full border border-white/15 bg-white/15 px-5 py-2 text-sm font-black backdrop-blur">
                      Why Choose Us?
                    </span>

                    <h2 id="services-why-title" className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                      Dental Care That Feels Comfortable & Reliable
                    </h2>

                    <p className="mt-4 max-w-xl leading-8 text-white/90">
                      We combine skilled dentists, modern equipment, transparent
                      guidance, and patient-first treatment planning.
                    </p>
                  </div>

                  <StaggerContainer className="grid gap-4">
                    {whyChooseItems.map((item) => (
                      <StaggerItem key={item}>
                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/15 p-4 font-bold backdrop-blur transition hover:bg-white/25">
                          <RotateIn>
                            <span
                              aria-hidden="true"
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm text-blue-700"
                            >
                              <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} />
                            </span>
                          </RotateIn>

                          {item}
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </HoverCard>
          </FadeUp>
        </div>
      </section>

      <section aria-labelledby="services-cta-title" className="[content-visibility:auto] [contain-intrinsic-size:650px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <FadeUp>
            <HoverCard>
              <div className="relative overflow-hidden rounded-[38px] border border-blue-100 bg-white px-6 py-14 text-center shadow-[0_28px_80px_rgba(37,99,235,.12)] md:px-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-100/60 blur-2xl"
                />

                <div className="relative z-10">
                  <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
                    Book Your Visit
                  </span>

                  <h2 id="services-cta-title" className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                    Ready To Transform Your Smile?
                  </h2>

                  <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                    Book your consultation today and let our experts help you
                    achieve optimal oral health with confidence.
                  </p>

                  <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                    <HoverButton>
                      <Link prefetch={false}
                        href="/book-appointment"
                        aria-label="Book a dental appointment"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 px-8 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                      >
                        Book Appointment
                        <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="ml-3" />
                      </Link>
                    </HoverButton>

                    <HoverButton>
                      <Link prefetch={false}
                        href="/contact"
                        aria-label="Contact Teeth and Gums Care clinic"
                        className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 px-8 py-4 font-black text-blue-600 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                      >
                        Contact Clinic
                        <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="ml-3" />
                      </Link>
                    </HoverButton>
                  </div>
                </div>
              </div>
            </HoverCard>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
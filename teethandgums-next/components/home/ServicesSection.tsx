import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import { servicesData } from "@/data/services";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

/* =========================================
   TYPES
========================================= */

interface HomeService {
  title: string;
  slug: string;
  image: ImageProps["src"];
  description: string;
}

interface RawService {
  title: string;
  slug: string;
  image?: ImageProps["src"];
  heroImage?: ImageProps["src"];
  serviceImage?: ImageProps["src"];
  description?: string;
  shortDescription?: string;
  excerpt?: string;
  hero?: {
    description?: string;
    image?: ImageProps["src"];
  };
}

/* =========================================
   HOMEPAGE SERVICE DATA
========================================= */

/**
 * The homepage now uses the central modular servicesData source.
 *
 * It supports common field names so the component remains compatible
 * if individual service files use image, heroImage, serviceImage,
 * description, shortDescription, excerpt, or hero.description.
 */
const featuredServices: HomeService[] = (
  servicesData as unknown as RawService[]
)
  .slice(0, 8)
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
      `Learn more about ${service.title} treatment at Teeth & Gums Care.`,
  }));

/* =========================================
   SERVICES SECTION
========================================= */

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="home-services-title"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-10 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-50 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-100">
              Our Dental Services
            </span>

            <h2
              id="home-services-title"
              className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Complete Care For Every Smile
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              Premium dental treatments designed for comfort, safety, and
              long-lasting oral health.
            </p>
          </div>
        </FadeUp>

        {/* Services grid */}
        <StaggerContainer className="mt-14 grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => (
            <StaggerItem key={service.slug} className="h-full">
              <HoverCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.10)] transition duration-300 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)]">
                  {/* Top hover accent */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 z-20 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {/* Service image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                      <Image
                        src={service.image}
                        alt={`Professional ${service.title} treatment at Teeth & Gums Care`}
                        fill
                        sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 34px), 292px"
                        quality={65}
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "low"}
                        decoding="async"
                        className="object-contain p-2 transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
                      />
                  </div>

                  {/* Card content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="min-h-[56px] text-xl font-black leading-tight text-slate-900">
                      {service.title}
                    </h3>

                    <p className="mt-4 flex-1 leading-7 text-slate-500">
                      {service.description}
                    </p>

                    <HoverButton>
                      <Link prefetch={false}
                        href={`/services/${service.slug}`}
                        aria-label={`Learn more about ${service.title}`}
                        className="mt-6 inline-flex self-start items-center rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                      >
                        Learn More about {service.title}

                        <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ms-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </HoverButton>
                  </div>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View all services */}
        <FadeUp delay={0.2}>
          <div className="mt-14 text-center">
            <HoverButton>
              <Link prefetch={false}
                href="/services"
                aria-label="View all dental services"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-9 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] transition-shadow duration-300 hover:shadow-[0_22px_45px_rgba(37,99,235,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                View More Services

                <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ms-3" />
              </Link>
            </HoverButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
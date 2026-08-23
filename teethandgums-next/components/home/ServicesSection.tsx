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
  hero?: { description?: string; image?: ImageProps["src"] };
}

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

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="home-services-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-20 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-24 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              Our Dental Services
            </span>
            <h2
              id="home-services-title"
              className="mt-5 text-4xl font-black leading-tight tracking-[-0.035em] text-[#08376f] md:text-5xl"
            >
              Comprehensive <span className="text-blue-600">Dental Solutions</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
              Modern treatments designed around comfort, precision, safety, and lasting oral health.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => (
            <StaggerItem key={service.slug} className="h-full">
              <HoverCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_16px_45px_rgba(8,55,111,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_26px_65px_rgba(37,99,235,0.14)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                    <Image
                      src={service.image}
                      alt={`Professional ${service.title} treatment at Teeth & Gums Care`}
                      fill
                      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 34px), 292px"
                      quality={68}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "low"}
                      decoding="async"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-6 pt-4">
                    <div className="mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-blue-600 to-[#0b3c91] transition-all duration-300 group-hover:w-16" />
                    <h3 className="text-xl font-black leading-tight text-[#08376f]">{service.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">{service.description}</p>
                    <Link
                      prefetch={false}
                      href={`/services/${service.slug}`}
                      aria-label={`Learn more about ${service.title}`}
                      className="mt-5 inline-flex items-center self-start text-sm font-black text-blue-700 transition hover:text-[#08376f]"
                    >
                      Learn More
                      <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.2}>
          <div className="mt-12 text-center">
            <HoverButton>
              <Link
                prefetch={false}
                href="/services"
                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-8 py-4 font-black text-white shadow-[0_16px_36px_rgba(37,99,235,0.24)]"
              >
                View All Services
                <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3" />
              </Link>
            </HoverButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

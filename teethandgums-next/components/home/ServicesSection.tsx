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
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-24 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-28 h-96 w-96 rounded-full bg-blue-100/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 bottom-12 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-blue-700 shadow-sm">
                Our Dental Services
              </span>
              <h2
                id="home-services-title"
                className="mt-5 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#08376f] md:text-5xl xl:text-[60px]"
              >
                Complete Care for Every
                <span className="block text-blue-600">Stage of Your Smile.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                From preventive care to advanced restorative and cosmetic dentistry, explore treatments designed around precision, comfort, and lasting results.
              </p>
            </div>

            <HoverButton>
              <Link
                prefetch={false}
                href="/services"
                className="group inline-flex items-center self-start rounded-2xl border border-blue-200 bg-white px-6 py-3.5 font-black text-[#08376f] shadow-sm transition hover:bg-blue-50 lg:self-auto"
              >
                View All Services
                <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-3 text-blue-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </HoverButton>
          </div>
        </FadeUp>

        <StaggerContainer className="mt-14 grid auto-rows-[minmax(330px,auto)] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, index) => {
            const featured = index === 0 || index === 1;

            return (
              <StaggerItem
                key={service.slug}
                className={featured ? "lg:col-span-2" : ""}
              >
                <HoverCard className="h-full">
                  <article className="group relative h-full min-h-[330px] overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(8,55,111,0.09)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_75px_rgba(37,99,235,0.15)]">
                    <div className="absolute inset-0">
                      <Image
                        src={service.image}
                        alt={`Professional ${service.title} treatment at Teeth & Gums Care`}
                        fill
                        sizes={featured ? "(max-width: 1023px) calc(100vw - 32px), 50vw" : "(max-width: 1023px) calc(50vw - 34px), 25vw"}
                        quality={70}
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "low"}
                        decoding="async"
                        className={`transition-transform duration-700 group-hover:scale-[1.04] ${featured ? "object-cover" : "object-contain p-8"}`}
                      />
                      <div className={`absolute inset-0 ${featured ? "bg-gradient-to-t from-[#062d5c]/95 via-[#08376f]/45 to-transparent" : "bg-gradient-to-t from-white via-white/75 to-white/15"}`} />
                    </div>

                    <div className={`relative z-10 flex h-full min-h-[330px] flex-col justify-end p-6 ${featured ? "text-white sm:p-8" : "text-[#08376f]"}`}>
                      <span className={`mb-4 inline-flex self-start rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${featured ? "border border-white/20 bg-white/10 text-blue-100 backdrop-blur" : "border border-blue-100 bg-blue-50 text-blue-700"}`}>
                        Dental Care
                      </span>

                      <h3 className={`max-w-[520px] text-2xl font-black leading-tight tracking-[-0.025em] ${featured ? "sm:text-3xl" : ""}`}>
                        {service.title}
                      </h3>

                      <p className={`mt-3 max-w-[560px] text-sm leading-7 ${featured ? "text-white/80" : "text-slate-500"}`}>
                        {service.description}
                      </p>

                      <Link
                        prefetch={false}
                        href={`/services/${service.slug}`}
                        aria-label={`Learn more about ${service.title}`}
                        className={`mt-5 inline-flex items-center self-start text-sm font-black transition ${featured ? "text-white hover:text-blue-100" : "text-blue-700 hover:text-[#08376f]"}`}
                      >
                        Explore Treatment
                        <FontAwesomeIcon aria-hidden="true" icon={faArrowRightLong} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

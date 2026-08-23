import Image from "next/image";

import type { Service } from "@/data/services";

import {
  FadeUp,
  HoverCard,
  HoverImage,
  RotateIn,
  SlideLeft,
  SlideRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import ServiceIcon from "./ServiceIcon";
interface Props {
  service: Service;
}

export default function ServiceAbout({ service }: Props) {
  const hasBenefits =
    Array.isArray(service.benefits) && service.benefits.length > 0;

  return (
    <section
      aria-labelledby={`service-about-title-${service.slug}`}
      className="[content-visibility:auto] [contain-intrinsic-size:1100px] relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 xl:gap-20">
        <SlideRight>
          <HoverImage>
            <figure className="relative">
              <div className="overflow-hidden rounded-[36px] bg-white p-2 shadow-[0_30px_80px_rgba(37,99,235,.12)]">
                <Image
                  src={service.image}
                  alt={`${service.title} treatment at Teeth and Gums Care Dental Clinic in Jodhpur`}
                  width={700}
                  height={700}
                  sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 560px"
                  quality={72}
                  className="aspect-square h-auto w-full rounded-[30px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 object-contain p-2 transition duration-500 motion-safe:group-hover:scale-[1.03]"
                />
              </div>

              <figcaption className="absolute bottom-6 left-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 px-6 py-4 font-black text-white shadow-[0_22px_55px_rgba(37,99,235,.30)]">
                {service.title} in Jodhpur
              </figcaption>
            </figure>
          </HoverImage>
        </SlideRight>

        <SlideLeft>
          <div className="lg:pl-4">
            <FadeUp>
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black uppercase text-blue-600 ring-1 ring-blue-200/60">
                About This Treatment
              </span>

              <h2
                id={`service-about-title-${service.slug}`}
                className="mt-5 max-w-[620px] text-4xl font-black leading-tight text-slate-900 md:text-5xl"
              >
                About {service.title}
              </h2>

              <p className="mt-6 max-w-[610px] leading-8 text-slate-500">
                {service.description}
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <HoverCard>
                <aside
                  aria-labelledby={`service-definition-title-${service.slug}`}
                  className="mt-8 rounded-[30px] border border-blue-100 border-l-4 border-l-blue-600 bg-blue-50/70 p-7 shadow-[0_18px_50px_rgba(37,99,235,.08)] transition duration-300 hover:shadow-[0_24px_65px_rgba(37,99,235,.12)]"
                >
                  <RotateIn>
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white"
                      >
                        <ServiceIcon className="fa-solid fa-circle-info" />
                      </div>

                      <h3
                        id={`service-definition-title-${service.slug}`}
                        className="text-xl font-black text-blue-700"
                      >
                        What Is {service.title}?
                      </h3>
                    </div>
                  </RotateIn>

                  <p className="leading-8 text-slate-600">
                    {service.definition}
                  </p>
                </aside>
              </HoverCard>
            </FadeUp>

            {hasBenefits && (
              <section
                aria-labelledby={`service-benefits-title-${service.slug}`}
                className="mt-8"
              >
                <h3
                  id={`service-benefits-title-${service.slug}`}
                  className="sr-only"
                >
                  Benefits of {service.title}
                </h3>

                <StaggerContainer className="grid gap-4">
                  {service.benefits.map((benefit) => (
                    <StaggerItem key={benefit}>
                      <HoverCard>
                        <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-white p-5 font-semibold leading-7 text-slate-700 shadow-sm transition duration-300 hover:border-blue-300 hover:bg-blue-50/60 hover:shadow-lg">
                          <RotateIn>
                            <span
                              aria-hidden="true"
                              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-600 text-xs text-white"
                            >
                              <ServiceIcon className="fa-solid fa-check" />
                            </span>
                          </RotateIn>

                          <span>{benefit}</span>
                        </div>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            )}
          </div>
        </SlideLeft>
      </div>
    </section>
  );
}

import type { Service } from "@/data/services";

import {
  FadeUp,
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import ServiceIcon from "./ServiceIcon";
interface Props {
  service: Service;
}

export default function ServiceInfoCards({ service }: Props) {
  const causes = Array.isArray(service.causes)
    ? service.causes
    : [];

  const whenRequired = Array.isArray(service.whenRequired)
    ? service.whenRequired
    : [];

  if (!causes.length && !whenRequired.length) {
    return null;
  }

  return (
    <section
      aria-labelledby={`service-info-title-${service.slug}`}
      className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
              Treatment Information
            </span>

            <h2
              id={`service-info-title-${service.slug}`}
              className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Everything About {service.title}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              Understand the common causes, symptoms and situations where{" "}
              {service.title} treatment may be recommended by dental
              professionals.
            </p>
          </div>
        </FadeUp>

        <div
          className={`grid items-stretch gap-8 ${
            causes.length && whenRequired.length
              ? "lg:grid-cols-2"
              : "mx-auto max-w-3xl"
          }`}
        >
          {causes.length > 0 && (
            <InfoCard
              icon="fa-solid fa-triangle-exclamation"
              title="Common Causes"
              items={causes}
            />
          )}

          {whenRequired.length > 0 && (
            <InfoCard
              icon="fa-solid fa-notes-medical"
              title="When Is Treatment Required?"
              items={whenRequired}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <HoverCard className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)] lg:p-10">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <RotateIn>
          <div
            aria-hidden="true"
            className="mb-7 grid h-[76px] w-[76px] place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
          >
            <ServiceIcon className={icon} />
          </div>
        </RotateIn>

        <h3 className="mb-8 text-3xl font-black leading-tight text-slate-900">
          {title}
        </h3>

        <StaggerContainer className="grid flex-1 content-start gap-4">
          {items.map((item, index) => (
            <StaggerItem
              key={`${title}-${index}-${item}`}
            >
              <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 font-semibold leading-7 text-slate-600 transition duration-300 hover:border-blue-300 hover:bg-white hover:shadow-lg">
                <RotateIn delay={index * 0.04}>
                  <span
                    aria-hidden="true"
                    className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-[11px] text-white"
                  >
                    <ServiceIcon className="fa-solid fa-check" />
                  </span>
                </RotateIn>

                <span>{item}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </article>
    </HoverCard>
  );
}

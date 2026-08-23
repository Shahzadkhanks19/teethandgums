import type { Service } from "@/data/services";

import {
  FadeUp,
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

interface Props {
  service: Service;
}

export default function ServiceProcess({ service }: Props) {
  const procedure = Array.isArray(service.procedure)
    ? service.procedure
    : [];

  if (procedure.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby={`service-process-title-${service.slug}`}
      className="[content-visibility:auto] [contain-intrinsic-size:1100px] relative scroll-mt-24 overflow-hidden bg-blue-50 py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black uppercase text-blue-600 ring-1 ring-blue-200/60">
              Treatment Journey
            </span>

            <h2
              id={`service-process-title-${service.slug}`}
              className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              {service.title} Treatment Process
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              Understand the typical steps involved in {service.title}, from
              consultation and diagnosis to treatment, aftercare and follow-up.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {procedure.map((step, index) => (
            <StaggerItem
              key={`${service.slug}-procedure-${index}-${step}`}
            >
              <HoverCard className="h-full">
                <article
                  aria-label={`Step ${index + 1} of the ${service.title} treatment process`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <RotateIn>
                    <div
                      aria-hidden="true"
                      className="mb-6 grid h-[64px] w-[64px] place-items-center rounded-[22px] bg-gradient-to-br from-blue-600 to-blue-900 text-xl font-black text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </RotateIn>

                  <span className="mb-3 text-xs font-black uppercase tracking-wider text-blue-600">
                    Step {index + 1}
                  </span>

                  <p className="flex-1 font-semibold leading-8 text-slate-500">
                    {step}
                  </p>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.15}>
          <p className="mx-auto mt-10 max-w-3xl rounded-2xl border border-blue-100 bg-white px-5 py-4 text-center text-sm font-semibold leading-7 text-slate-500 shadow-sm">
            The exact treatment process may vary depending on your oral health,
            clinical examination and personalized treatment plan.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
import {
  FadeUp,
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import ServiceIcon from "./ServiceIcon";
const whyItems = [
  {
    icon: "fa-solid fa-user-doctor",
    title: "Experienced Dentists",
    text: "Receive ethical, personalized and evidence-based dental care from experienced dentists focused on your long-term oral health.",
  },
  {
    icon: "fa-solid fa-microscope",
    title: "Advanced Dental Technology",
    text: "Modern dental equipment supports accurate diagnosis, comfortable procedures and more predictable treatment outcomes.",
  },
  {
    icon: "fa-solid fa-heart",
    title: "Comfortable Patient Care",
    text: "A gentle, patient-first approach helps reduce anxiety and makes every stage of treatment more comfortable.",
  },
  {
    icon: "fa-solid fa-tooth",
    title: "Personalized Treatment Plans",
    text: "Every treatment plan is tailored to your dental condition, lifestyle, oral health needs and smile goals.",
  },
];

export default function ServiceWhyChoose() {
  return (
    <section
      aria-labelledby="service-why-choose-title"
      className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black uppercase tracking-wide text-blue-600 ring-1 ring-blue-200/60">
              Why Choose Our Clinic
            </span>

            <h2
              id="service-why-choose-title"
              className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Why Choose Teeth and Gums Care in Jodhpur?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              We combine experienced dentists, advanced dental technology,
              transparent guidance and personalized care to provide a safe,
              comfortable and reliable treatment experience.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {whyItems.map((item) => (
            <StaggerItem key={item.title}>
              <HoverCard className="h-full">
                <article
                  aria-label={item.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_30px_90px_rgba(37,99,235,.16)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <RotateIn>
                    <div
                      aria-hidden="true"
                      className="mx-auto mb-7 grid h-[78px] w-[78px] place-items-center rounded-[26px] bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
                    >
                      <ServiceIcon className={item.icon} />
                    </div>
                  </RotateIn>

                  <h3 className="text-xl font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 flex-1 leading-8 text-slate-500">
                    {item.text}
                  </p>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

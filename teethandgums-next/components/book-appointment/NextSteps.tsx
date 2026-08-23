import {
  FadeUp,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import { nextSteps } from "./appointmentData";

import AppointmentIcon from "./AppointmentIcon";
const stepIcons = [
  "fa-solid fa-paper-plane",
  "fa-solid fa-calendar-check",
  "fa-solid fa-phone-volume",
  "fa-solid fa-hospital-user",
];

export default function NextSteps() {
  return (
    <section
      aria-labelledby="next-steps-title"
      className="relative overflow-hidden rounded-[38px] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-white px-5 py-14 shadow-[0_28px_80px_rgba(37,99,235,.10)] sm:px-8 lg:px-12 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10">
        <FadeUp delay={0.15}>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
              Simple Appointment Process
            </span>

            <h2
              id="next-steps-title"
              className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl"
            >
              What Happens After You Submit?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              After you submit your dental appointment request, our team
              reviews your preferred dentist, date and time before confirming
              the final appointment details.
            </p>
          </div>
        </FadeUp>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-blue-600 via-blue-300 to-blue-100 md:block lg:left-[12.5%] lg:right-[12.5%] lg:top-8 lg:h-px lg:w-auto"
          />

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {nextSteps.map((step, index) => (
              <StaggerItem key={step}>
                <HoverCard className="h-full">
                  <article className="group relative flex h-full flex-col rounded-[30px] border border-blue-100 bg-white p-6 shadow-[0_16px_45px_rgba(37,99,235,.08)] transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_26px_70px_rgba(37,99,235,.14)]">
                    <div className="relative z-10 flex items-start gap-5 lg:flex-col lg:items-center lg:text-center">
                      <div className="relative shrink-0">
                        <div
                          aria-hidden="true"
                          className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 text-xl text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:scale-110"
                        >
                          <AppointmentIcon
                            className={
                              stepIcons[index] || "fa-solid fa-check"
                            }
                          />
                        </div>

                        <span
                          aria-hidden="true"
                          className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-cyan-400 text-xs font-black text-slate-900 shadow-md"
                        >
                          {index + 1}
                        </span>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-blue-600">
                          Step {index + 1}
                        </span>

                        <h3 className="mt-3 text-lg font-black leading-tight text-slate-900">
                          {step}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-slate-500">
                          {getStepDescription(index)}
                        </p>
                      </div>
                    </div>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <FadeUp delay={0.25}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[26px] border border-blue-100 bg-blue-50/70 p-5 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <div
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-lg text-white shadow-lg shadow-blue-100"
              >
                <AppointmentIcon className="fa-solid fa-circle-info" />
              </div>

              <div>
                <h3 className="font-black text-slate-900">
                  Need Help With Your Appointment?
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Call Teeth and Gums Care and our clinic team will help you
                  choose a treatment, dentist and available appointment slot.
                </p>
              </div>
            </div>

            <a
              href="tel:+919829824356"
              aria-label="Call Teeth and Gums Care for appointment assistance"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 font-black text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              <AppointmentIcon
                aria-hidden="true"
                className="fa-solid fa-phone mr-2"
              />
              Call Clinic
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function getStepDescription(index: number) {
  const descriptions = [
    "Enter your details and choose your preferred dental treatment, dentist, date and available appointment time.",
    "Our clinic team reviews your request and checks dentist and appointment slot availability.",
    "You receive confirmation by phone call, WhatsApp or email with the final appointment details.",
    "Visit Teeth and Gums Care at the confirmed time and meet your selected dentist.",
  ];

  return descriptions[index] || "";
}

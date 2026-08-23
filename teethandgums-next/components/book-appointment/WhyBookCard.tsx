import {
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

import { clinicFeatures } from "./appointmentData";

import AppointmentIcon from "./AppointmentIcon";
const timings = [
  {
    day: "Monday – Saturday",
    session: "Morning Session",
    hours: "10:00 AM – 3:00 PM",
  },
  {
    day: "Monday – Saturday",
    session: "Evening Session",
    hours: "5:30 PM – 8:30 PM",
  },
  {
    day: "Sunday",
    session: "Morning Session",
    hours: "10:00 AM – 3:00 PM",
  },
];

const trustHighlights = [
  {
    icon: "fa-solid fa-user-doctor",
    title: "Experienced Dentists",
  },
  {
    icon: "fa-solid fa-shield-heart",
    title: "Safe & Sterile Care",
  },
  {
    icon: "fa-solid fa-heart-circle-check",
    title: "Patient-First Approach",
  },
];

export default function WhyBookCard() {
  return (
    <HoverCard>
      <aside
        aria-labelledby="why-book-title"
        className="relative overflow-hidden rounded-[38px] border border-blue-100 bg-gradient-to-br from-white via-blue-50/20 to-white p-5 min-[420px]:p-8 shadow-[0_30px_90px_rgba(37,99,235,.10)] lg:p-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"
        />

        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
            Why Choose Teeth and Gums Care
          </span>

          <h2
            id="why-book-title"
            className="mt-5 text-4xl font-black leading-tight text-slate-900"
          >
            Comfortable, Ethical &amp;
            <span className="text-blue-600">
              {" "}
              Advanced Dental Care
            </span>
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-500">
            Every appointment is carefully planned to provide transparent,
            comfortable and patient-focused dental care using modern technology
            and experienced dentists in Jodhpur.
          </p>

          <StaggerContainer className="mt-10 grid gap-5">
            {clinicFeatures.map((feature) => (
              <StaggerItem key={feature.title}>
                <HoverCard>
                  <article className="group flex flex-col items-start gap-4 rounded-[26px] border border-blue-100 bg-white p-5 min-[420px]:flex-row min-[420px]:gap-5 shadow-sm transition duration-300 motion-safe:hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">
                    <RotateIn>
                      <div
                        aria-hidden="true"
                        className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-gradient-to-br from-blue-600 to-blue-900 text-2xl text-white shadow-lg shadow-blue-200 transition motion-safe:group-hover:scale-110"
                      >
                        <AppointmentIcon className={feature.icon} />
                      </div>
                    </RotateIn>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {feature.title}
                      </h3>

                      <p className="mt-2 leading-7 text-slate-500">
                        {feature.text}
                      </p>
                    </div>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div
            aria-hidden="true"
            className="my-10 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"
          />

          <section aria-labelledby="clinic-hours-title">
            <div className="flex items-start gap-3">
              <div
                aria-hidden="true"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white shadow-lg"
              >
                <AppointmentIcon className="fa-solid fa-clock" />
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  id="clinic-hours-title"
                  className="text-2xl font-black text-slate-900"
                >
                  Dental Clinic Timings
                </h3>

                <p className="text-slate-500">
                  Visit Teeth and Gums Care during our consultation hours.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {timings.map((item) => (
                <div
                  key={`${item.day}-${item.session}`}
                  className="grid grid-cols-1 gap-4 rounded-2xl border border-blue-100 bg-white p-4 transition hover:border-blue-300 hover:shadow-md min-[420px]:grid-cols-[minmax(0,1fr)_auto] min-[420px]:items-center min-[420px]:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700"
                    >
                      <AppointmentIcon className="fa-solid fa-calendar-day" />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words font-black text-slate-900">{item.day}</p>

                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {item.session}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 min-[420px]:justify-self-end min-[420px]:px-4 min-[420px]:text-sm">
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-sm font-semibold leading-7 text-blue-700">
              Appointment availability may vary. Please book online or call the
              clinic before visiting.
            </p>
          </section>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {trustHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-blue-50 p-4 text-center ring-1 ring-blue-100"
              >
                <AppointmentIcon
                  aria-hidden="true"
                  className={`${item.icon} text-2xl text-blue-600`}
                />

                <p className="mt-2 text-sm font-black text-slate-800">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </HoverCard>
  );
}

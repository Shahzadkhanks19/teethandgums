import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import { FadeUp, HoverButton, HoverCard } from "@/components/animations";

export default function EmergencySection() {
  return (
    <section
      aria-labelledby="emergency-section-title"
      className="relative overflow-hidden bg-blue-50 py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-cyan-100/50 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <HoverCard>
            <aside className="relative overflow-hidden rounded-[32px] border border-blue-100 bg-white p-7 text-center shadow-[0_20px_55px_rgba(37,99,235,0.10)] md:p-8 md:text-left">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/70 blur-2xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-cyan-100/50 blur-3xl"
              />

              <div className="relative z-10 flex flex-col items-center justify-between gap-7 md:flex-row">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-100">
                    <FontAwesomeIcon aria-hidden="true" icon={faTriangleExclamation} className="mr-2" />
                    Dental Emergency?
                  </span>

                  <h2
                    id="emergency-section-title"
                    className="mt-3 text-2xl font-black leading-tight text-slate-900 md:text-3xl"
                  >
                    Call Us for Prompt Dental Assistance
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                    Contact our dental team for severe tooth pain, swelling,
                    broken teeth, dental injuries, or other urgent concerns
                    during clinic hours.
                  </p>
                </div>

                <HoverButton>
                  <a
                    href="tel:+919829824356"
                    itemProp="telephone"
                    aria-label="Call Teeth and Gums Care for emergency dental assistance"
                    className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-4 text-center font-black text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] transition-shadow duration-300 hover:shadow-[0_22px_45px_rgba(37,99,235,0.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:w-auto"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="mr-2 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
                    +91 98298 24356
                  </a>
                </HoverButton>
              </div>
            </aside>
          </HoverCard>
        </FadeUp>
      </div>
    </section>
  );
}
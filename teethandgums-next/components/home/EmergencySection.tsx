import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import { FadeUp, HoverButton } from "@/components/animations";

export default function EmergencySection() {
  return (
    <section aria-labelledby="emergency-section-title" className="relative overflow-hidden bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <aside className="relative overflow-hidden rounded-[30px] border border-blue-100 bg-[linear-gradient(110deg,#f8fbff_0%,#ffffff_48%,#eef5ff_100%)] p-6 shadow-[0_18px_50px_rgba(8,55,111,0.08)] md:p-8">
            <div aria-hidden="true" className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-blue-100/70 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-[#0b3c91] text-xl text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)]">
                  <FontAwesomeIcon aria-hidden="true" icon={faTriangleExclamation} />
                </div>
                <div className="max-w-3xl">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">Dental Emergency?</span>
                  <h2 id="emergency-section-title" className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#08376f] md:text-3xl">
                    Prompt Dental Assistance When You Need It
                  </h2>
                  <p className="mt-2 max-w-2xl leading-7 text-slate-500">
                    Contact our dental team for severe tooth pain, swelling, broken teeth, dental injuries, or other urgent concerns during clinic hours.
                  </p>
                </div>
              </div>

              <HoverButton>
                <a href="tel:+919829824356" itemProp="telephone" className="inline-flex w-full items-center justify-center rounded-2xl bg-[#08376f] px-7 py-4 font-black text-white shadow-[0_14px_32px_rgba(8,55,111,0.2)] transition hover:bg-[#0b3c91] md:w-auto">
                  <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="mr-2" />
                  +91 98298 24356
                </a>
              </HoverButton>
            </div>
          </aside>
        </FadeUp>
      </div>
    </section>
  );
}

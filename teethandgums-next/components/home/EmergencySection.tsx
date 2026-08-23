import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

import { FadeUp, HoverButton } from "@/components/animations";

export default function EmergencySection() {
  return (
    <section aria-labelledby="emergency-section-title" className="relative overflow-hidden bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <aside className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 shadow-[0_16px_45px_rgba(8,55,111,0.07)] md:p-7">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-100">
                  <FontAwesomeIcon aria-hidden="true" icon={faTriangleExclamation} className="mr-2" />
                  Dental Emergency?
                </span>
                <h2 id="emergency-section-title" className="mt-3 text-2xl font-black tracking-tight text-[#08376f] md:text-3xl">
                  Prompt Dental Assistance When You Need It
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-slate-500">
                  Contact our dental team for severe tooth pain, swelling, broken teeth, dental injuries, or other urgent concerns during clinic hours.
                </p>
              </div>

              <HoverButton>
                <a href="tel:+919829824356" itemProp="telephone" className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-7 py-4 font-black text-white shadow-[0_14px_32px_rgba(37,99,235,0.22)] md:w-auto">
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

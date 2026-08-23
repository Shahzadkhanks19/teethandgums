import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPhone } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { homeFaqs } from "@/data/homeFaqs";

export default function FAQSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="home-faq-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
            Frequently Asked Questions
          </span>
          <h2 id="home-faq-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#08376f] sm:text-5xl">
            Clear answers before your visit.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
            Helpful information about appointments, treatments, comfort and routine dental care.
          </p>

          <div className="mt-8 rounded-[26px] bg-[#08376f] p-6 text-white shadow-[0_18px_55px_rgba(8,55,111,0.18)]">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-blue-100">
              <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-black">Still have a question?</h3>
            <p className="mt-2 text-sm leading-7 text-blue-50/75">Speak directly with our clinic team for appointment support or treatment guidance.</p>
            <a href="tel:+919829824356" className="mt-5 inline-flex items-center font-black text-white">
              Call +91 98298 24356
              <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" className="ml-2" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, index) => (
            <details key={faq.id} open={index === 0} className="group overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_8px_28px_rgba(8,55,111,0.05)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 font-black text-[#08376f] marker:hidden sm:px-6">
                <span className="min-w-0">{faq.question}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-lg text-blue-700 transition group-open:rotate-45">+</span>
              </summary>
              <div className="border-t border-blue-100 px-5 py-5 text-sm leading-7 text-slate-600 sm:px-6">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[26px] border border-blue-100 bg-blue-50 px-6 py-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-black text-[#08376f]">Prefer to book directly?</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">Choose a convenient date and time for your consultation.</p>
          </div>
          <Link href="/book-appointment" prefetch={false} className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 font-black text-white transition hover:bg-[#0b3c91] sm:w-auto">
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}

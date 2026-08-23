import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faCircleQuestion, faPhone } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import { homeFaqs } from "@/data/homeFaqs";

export default function FAQSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32" aria-labelledby="home-faq-title">
      <div aria-hidden="true" className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />
      <div className="relative z-10 mx-auto grid max-w-[1380px] gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
            <FontAwesomeIcon icon={faCircleQuestion} aria-hidden="true" />
            Patient Questions
          </span>
          <h2 id="home-faq-title" className="mt-6 max-w-xl text-4xl font-black leading-[1.03] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl">
            Clear answers before you even visit.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Helpful answers about appointments, treatments, preventive care, and visiting Teeth and Gums Care.
          </p>

          <div className="mt-8 rounded-[28px] bg-[#08376f] p-6 text-white shadow-[0_20px_60px_rgba(8,55,111,0.18)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-blue-200">
                <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-black">Still have a question?</h3>
                <p className="mt-2 text-sm leading-6 text-blue-50/75">Speak directly with the clinic team for appointment support or treatment guidance.</p>
                <a href="tel:+919829824356" className="mt-4 inline-flex items-center font-black text-white">
                  Call the clinic
                  <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {homeFaqs.map((faq, index) => (
            <details key={faq.id} open={index === 0} className="group overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-[0_10px_35px_rgba(8,55,111,0.05)] open:border-blue-200 open:shadow-[0_18px_48px_rgba(8,55,111,0.08)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-left sm:px-6 sm:py-6 [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 items-center gap-4">
                  <span className="hidden text-xs font-black tracking-[0.14em] text-blue-300 sm:inline">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base font-black leading-6 text-[#08376f] sm:text-lg">{faq.question}</span>
                </span>
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
                  <span className="absolute h-0.5 w-3 bg-current" />
                  <span className="absolute h-3 w-0.5 bg-current" />
                </span>
              </summary>
              <div className="border-t border-blue-100 px-5 pb-6 pt-5 sm:px-[4.5rem] sm:pb-7">
                <p className="max-w-3xl leading-8 text-slate-600">{faq.answer}</p>
              </div>
            </details>
          ))}

          <div className="mt-4 flex justify-end">
            <Link href="/contact" prefetch={false} className="inline-flex items-center rounded-2xl border border-blue-200 bg-white px-5 py-3.5 font-black text-[#08376f] transition hover:bg-blue-50">
              Contact our team
              <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-2 text-blue-600" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

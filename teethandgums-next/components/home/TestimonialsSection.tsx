import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const testimonials = [
  {
    name: "Lovekush Upadhyay",
    location: "Jodhpur",
    review:
      "Dr. Sunita Khetani treated my tooth and gum problem very effectively. She explained everything clearly and made me feel comfortable throughout the treatment.",
  },
  {
    name: "Pramod Khanna",
    location: "Jodhpur",
    review:
      "Excellent root canal and implant service. The doctors are knowledgeable and meticulous, and the whole process felt smooth and comfortable.",
  },
  {
    name: "Harshraj Singh",
    location: "Jodhpur",
    review:
      "The entire team was warm, welcoming and professional. Every step was explained clearly, which made the experience reassuring and easy.",
  },
];

const googleReviewsLink = "https://share.google/X1DeFzBmXM8WkGAuc";

export default function TestimonialsSection() {
  return (
    <section className="bg-[#f7faff] py-20 sm:py-24 lg:py-28" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
              Patient Stories
            </span>
            <h2 id="testimonials-title" className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#08376f] sm:text-5xl lg:text-6xl">
              Trusted by patients.
              <span className="block text-blue-600">Remembered for the experience.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Real feedback from patients who chose Teeth and Gums Care for thoughtful, comfortable dentistry.
            </p>
          </div>

          <a
            href={googleReviewsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-white px-5 py-4 font-black text-[#08376f] shadow-sm transition hover:bg-blue-50 sm:w-auto"
          >
            <Image src="/images/google.svg" alt="" aria-hidden="true" width={22} height={22} />
            4.9/5 on Google
          </a>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <a
              key={item.name}
              href={googleReviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_12px_38px_rgba(8,55,111,0.06)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_55px_rgba(8,55,111,0.1)] sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-lg text-blue-700">
                  <FontAwesomeIcon icon={faQuoteLeft} aria-hidden="true" />
                </span>
                <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} aria-hidden="true" className="text-[#FBBC05]" />
                  ))}
                </div>
              </div>

              <p className="mt-6 flex-1 text-base leading-8 text-slate-600">“{item.review}”</p>

              <div className="mt-7 border-t border-blue-100 pt-5">
                <h3 className="font-black text-[#08376f]">{item.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-400">{item.location} · Google Review</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

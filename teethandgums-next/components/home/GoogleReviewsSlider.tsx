"use client";

import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const reviews = [
  {
    name: "Lovekush Upadhyay",
    initial: "L",
    review:
      "Dr. Sunita Khetani treated my tooth and gum problem very effectively. She explained everything clearly and made me feel comfortable throughout the treatment.",
  },
  {
    name: "Pramod Khanna",
    initial: "P",
    review:
      "Excellent root canal and implant service. The doctors are knowledgeable and meticulous, and the whole process felt smooth and comfortable.",
  },
  {
    name: "Harshraj Singh",
    initial: "H",
    review:
      "The entire team was warm, welcoming and professional. Every step was explained clearly, which made the experience reassuring and easy.",
  },
];

const googleReviewsLink = "https://share.google/X1DeFzBmXM8WkGAuc";

export default function GoogleReviewsSlider() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % reviews.length);
  }, []);

  const previous = useCallback(() => {
    setActive((current) => (current - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const timer = window.setInterval(next, 5000);
    return () => window.clearInterval(timer);
  }, [next]);

  const review = reviews[active];

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24 lg:py-28" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/google.svg" alt="Google" width={34} height={34} className="h-8 w-8" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">Google Reviews</span>
            </div>
            <h2 id="reviews-title" className="mt-5 text-4xl font-black leading-[1.04] tracking-[-0.04em] text-[#08376f] sm:text-5xl">
              Real words from our patients.
            </h2>
            <div className="mt-7 flex items-center gap-4">
              <span className="text-4xl font-black text-slate-900">4.9</span>
              <div>
                <div className="flex gap-1" aria-label="4.9 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} aria-hidden="true" className="text-[#FBBC04]" />
                  ))}
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-500">Google rating</p>
              </div>
            </div>
            <a href={googleReviewsLink} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 font-black text-blue-700 hover:text-[#08376f]">
              <Image src="/images/google.svg" alt="" aria-hidden="true" width={18} height={18} />
              View on Google
            </a>
          </div>

          <div className="min-w-0">
            <article className="relative min-h-[330px] rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-600 text-base font-black text-white">{review.initial}</span>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900">{review.name}</h3>
                    <p className="mt-0.5 text-sm text-slate-500">Google Review</p>
                  </div>
                </div>
                <Image src="/images/google.svg" alt="Google" width={28} height={28} className="h-7 w-7 shrink-0" />
              </div>

              <div className="mt-6 flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FontAwesomeIcon key={index} icon={faStar} aria-hidden="true" className="text-[#FBBC04]" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-8 text-slate-700 sm:text-xl sm:leading-9">“{review.review}”</p>
              <p className="mt-7 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-400">Posted publicly on Google</p>
            </article>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex gap-2" aria-label="Select review">
                {reviews.map((item, index) => (
                  <button key={item.name} type="button" onClick={() => setActive(index)} aria-label={`Show review by ${item.name}`} aria-current={active === index ? "true" : undefined} className={`h-2.5 rounded-full transition-all ${active === index ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300 hover:bg-blue-300"}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={previous} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#08376f] transition hover:border-blue-300 hover:bg-blue-50">
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
                </button>
                <button type="button" onClick={next} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full bg-[#08376f] text-white transition hover:bg-blue-700">
                  <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

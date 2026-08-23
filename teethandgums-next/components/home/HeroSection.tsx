"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faShieldHeart,
  faStar,
  faUsers,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/images/common/slider1.webp",
    eyebrow: "Perfect Healthy Smile",
    headline: "Transform Your Smile with Expert Dental Care",
    bullets: ["Painless Treatments", "Advanced Technology", "Trusted Dentists"],
    ctaText: "Book Appointment",
    ctaLink: "/book-appointment",
  },
  {
    id: 2,
    image: "/images/common/slider2.webp",
    eyebrow: "Advanced Dental Treatments",
    headline: "Modern Dentistry You Can Trust",
    subHeadline:
      "From routine check-ups to smile makeovers — all under one roof.",
    ctaText: "Book Appointment",
    ctaLink: "/book-appointment",
  },
  {
    id: 3,
    image: "/images/common/slider3.webp",
    eyebrow: "Our Clinic",
    headline: "Treated in the Best Hands, in the Best Space",
    bullets: [
      "Fully Sterilised Equipment",
      "Modern Treatment Chairs",
      "Relaxing Environment",
    ],
    ctaText: "Book Appointment",
    ctaLink: "/book-appointment",
  },
];

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const total = slides.length;
  const slide = slides[current];

  const pauseAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total],
  );

  const resetTimer = useCallback(() => {
    pauseAutoPlay();
    if (!shouldReduceMotion) {
      timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    }
  }, [next, pauseAutoPlay, shouldReduceMotion]);

  const resumeAutoPlay = useCallback(() => resetTimer(), [resetTimer]);

  const handlePrev = useCallback(() => {
    resetTimer();
    goTo(current - 1);
  }, [current, goTo, resetTimer]);

  const handleNext = useCallback(() => {
    resetTimer();
    next();
  }, [next, resetTimer]);

  const handleDot = useCallback(
    (index: number) => {
      resetTimer();
      goTo(index);
    },
    [goTo, resetTimer],
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLElement>) => {
      pauseAutoPlay();
      touchStartXRef.current = event.touches[0]?.clientX ?? null;
      touchEndXRef.current = null;
    },
    [pauseAutoPlay],
  );

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLElement>) => {
    touchEndXRef.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const startX = touchStartXRef.current;
    const endX = touchEndXRef.current;

    if (startX !== null && endX !== null) {
      const diff = startX - endX;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) handleNext();
        else handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
    resumeAutoPlay();
  }, [handleNext, handlePrev, resumeAutoPlay]);

  useEffect(() => {
    resetTimer();
    return () => pauseAutoPlay();
  }, [pauseAutoPlay, resetTimer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) pauseAutoPlay();
      else resumeAutoPlay();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pauseAutoPlay, resumeAutoPlay]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      aria-label="Teeth and Gums Care hero slider"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-3 pb-6 pt-3 sm:px-4 sm:pb-8 lg:px-6 lg:pt-5"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_18%_24%,rgba(219,234,254,.9),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(191,219,254,.55),transparent_30%)]" />

      <div className="relative mx-auto min-h-[720px] max-w-[1480px] overflow-hidden rounded-[34px] border border-blue-100/80 bg-white shadow-[0_28px_90px_rgba(8,55,111,0.12)] sm:min-h-[760px] lg:min-h-[660px] xl:min-h-[700px] xl:rounded-[44px]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#ffffff_0%,#ffffff_40%,#f3f8ff_100%)]" />

        <div className="absolute inset-x-0 bottom-0 z-[2] h-28 bg-[linear-gradient(180deg,transparent,rgba(8,55,111,.035))]" />

        <div className="absolute inset-x-0 bottom-0 z-[2] hidden h-28 opacity-60 lg:block">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
            <path d="M0,78 C260,20 430,112 680,64 C930,16 1150,92 1440,34 L1440,120 L0,120 Z" fill="#eff6ff" />
            <path d="M0,92 C260,42 520,122 760,72 C1020,18 1230,102 1440,55" fill="none" stroke="#93c5fd" strokeOpacity="0.35" strokeWidth="2" />
          </svg>
        </div>

        <div className="absolute inset-x-4 top-4 z-[4] h-[310px] overflow-hidden rounded-[28px] sm:inset-x-5 sm:top-5 sm:h-[350px] lg:bottom-5 lg:left-auto lg:right-5 lg:top-5 lg:h-auto lg:w-[50%] xl:w-[52%] xl:rounded-[38px]">
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.headline}
            fill
            priority={current === 0}
            fetchPriority={current === 0 ? "high" : "auto"}
            loading={current === 0 ? "eager" : "lazy"}
            sizes="(max-width: 1023px) calc(100vw - 40px), 52vw"
            quality={76}
            className="object-cover object-[58%_center] sm:object-[60%_center] lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08376f]/45 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-white/5" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/25" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/25 bg-[#08376f]/80 p-4 text-white shadow-2xl backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[360px] lg:bottom-6 lg:left-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-blue-100">
                <FontAwesomeIcon aria-hidden="true" icon={faShieldHeart} />
              </span>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.12em] text-blue-200">Patient-first care</div>
                <div className="mt-0.5 text-sm font-extrabold">Comfort, precision & trust</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1480px] items-end px-5 pb-24 pt-[350px] sm:min-h-[760px] sm:px-8 sm:pt-[392px] lg:min-h-[660px] lg:items-center lg:px-10 lg:pb-24 lg:pt-16 xl:min-h-[700px] xl:px-14">
          <m.div
            key={slide.id}
            initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:max-w-[47%]"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm sm:text-[11px]">
              <FontAwesomeIcon aria-hidden="true" icon={faWandMagicSparkles} />
              {slide.eyebrow}
            </span>

            <h1 className="mt-5 max-w-[700px] text-[38px] font-black leading-[0.99] tracking-[-0.045em] text-[#08376f] sm:text-[48px] lg:text-[52px] xl:text-[64px]">
              {slide.headline}
            </h1>

            <p className="mt-5 max-w-[610px] text-[15px] font-medium leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
              {slide.subHeadline ??
                "Advanced, compassionate dental care designed around precision, comfort, and long-term confidence in your smile."}
            </p>

            {slide.bullets && (
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {slide.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 shadow-[0_8px_22px_rgba(37,99,235,0.07)] sm:text-sm"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="text-blue-600" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                prefetch={false}
                href={slide.ctaLink}
                className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-6 py-3.5 text-sm font-black text-white shadow-[0_16px_38px_rgba(37,99,235,0.27)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(37,99,235,0.34)] sm:px-7 sm:text-base"
              >
                {slide.ctaText}
                <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                prefetch={false}
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-black text-[#08376f] shadow-sm transition duration-300 hover:border-blue-400 hover:bg-blue-50 sm:px-7 sm:text-base"
              >
                Explore Services
              </Link>
            </div>

            <div className="mt-7 grid max-w-[610px] grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-[20px] border border-blue-100 bg-white p-3.5 shadow-[0_12px_28px_rgba(8,55,111,0.07)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                    <FontAwesomeIcon aria-hidden="true" icon={faUsers} />
                  </span>
                  <div>
                    <div className="text-lg font-black text-[#08376f]">5000+</div>
                    <div className="text-[11px] font-bold text-slate-500">Happy Patients</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[20px] border border-blue-100 bg-white p-3.5 shadow-[0_12px_28px_rgba(8,55,111,0.07)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                    <FontAwesomeIcon aria-hidden="true" icon={faStar} />
                  </span>
                  <div>
                    <div className="text-lg font-black text-[#08376f]">4.9/5</div>
                    <div className="text-[11px] font-bold text-slate-500">Patient Rating</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[20px] border border-blue-100 bg-white p-3.5 shadow-[0_12px_28px_rgba(8,55,111,0.07)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                    <FontAwesomeIcon aria-hidden="true" icon={faShieldHeart} />
                  </span>
                  <div>
                    <div className="text-sm font-black text-[#08376f]">Patient-first</div>
                    <div className="text-[11px] font-bold text-slate-500">Comfort & Safety</div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-blue-100 bg-white/95 p-1.5 shadow-[0_16px_38px_rgba(8,55,111,0.13)] backdrop-blur-xl lg:left-10 lg:translate-x-0 xl:left-14">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="grid h-9 w-9 place-items-center rounded-full text-blue-700 transition hover:bg-blue-50"
          >
            <FontAwesomeIcon aria-hidden="true" icon={faChevronLeft} />
          </button>
          <div role="tablist" aria-label="Hero slider navigation" className="flex items-center gap-2 px-1">
            {slides.map((item, index) => {
              const isActive = index === current;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}: ${item.headline}`}
                  onClick={() => handleDot(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-blue-600" : "w-2.5 bg-blue-200 hover:bg-blue-400"}`}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="grid h-9 w-9 place-items-center rounded-full text-blue-700 transition hover:bg-blue-50"
          >
            <FontAwesomeIcon aria-hidden="true" icon={faChevronRight} />
          </button>
        </div>

        {!shouldReduceMotion && (
          <div aria-hidden="true" className="absolute bottom-0 left-0 z-20 h-1 w-full bg-blue-100">
            <m.div
              key={current}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
              className="h-full bg-gradient-to-r from-blue-600 to-[#0b3c91]"
            />
          </div>
        )}
      </div>
    </section>
  );
}

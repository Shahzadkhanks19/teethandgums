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
      className="relative isolate min-h-[760px] touch-pan-y overflow-hidden bg-white sm:min-h-[790px] lg:min-h-[650px] xl:min-h-[720px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(219,234,254,0.9),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fbff_45%,#eaf3ff_100%)]" />

      <div className="absolute inset-y-0 right-0 z-[1] w-full lg:w-[58%]">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.headline}
          fill
          priority={current === 0}
          fetchPriority={current === 0 ? "high" : "auto"}
          loading={current === 0 ? "eager" : "lazy"}
          sizes="(max-width: 1023px) 100vw, 58vw"
          quality={74}
          className="object-cover object-[58%_center] sm:object-[60%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/55 to-transparent lg:bg-gradient-to-r lg:from-white lg:via-white/20 lg:to-transparent" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(115deg,white_0%,rgba(255,255,255,.98)_18%,rgba(255,255,255,.6)_38%,transparent_65%)] lg:block" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1560px] items-center px-4 pb-36 pt-16 sm:min-h-[790px] sm:px-6 lg:min-h-[650px] lg:px-8 lg:pb-28 lg:pt-20 xl:min-h-[720px] xl:px-10">
        <m.div
          key={slide.id}
          initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[740px]"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur sm:text-xs">
            <FontAwesomeIcon aria-hidden="true" icon={faShieldHeart} />
            {slide.eyebrow}
          </span>

          <h1 className="mt-6 max-w-[720px] text-[42px] font-black leading-[0.98] tracking-[-0.045em] text-[#08376f] sm:text-[54px] lg:text-[62px] xl:text-[76px]">
            {slide.headline}
          </h1>

          {slide.subHeadline ? (
            <p className="mt-6 max-w-[620px] text-base font-medium leading-8 text-slate-600 sm:text-lg lg:text-xl">
              {slide.subHeadline}
            </p>
          ) : (
            <p className="mt-6 max-w-[620px] text-base font-medium leading-8 text-slate-600 sm:text-lg lg:text-xl">
              Advanced, compassionate dental care designed around precision,
              comfort, and long-term confidence in your smile.
            </p>
          )}

          {slide.bullets && (
            <ul className="mt-7 flex flex-wrap gap-3">
              {slide.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-[0_8px_24px_rgba(37,99,235,0.08)] backdrop-blur"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="text-blue-600" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              prefetch={false}
              href={slide.ctaLink}
              className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-7 py-4 text-sm font-black text-white shadow-[0_18px_42px_rgba(37,99,235,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(37,99,235,0.36)] sm:px-8 sm:text-base"
            >
              {slide.ctaText}
              <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              prefetch={false}
              href="/services"
              className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white/90 px-7 py-4 text-sm font-black text-[#08376f] shadow-sm backdrop-blur transition duration-300 hover:border-blue-400 hover:bg-blue-50 sm:px-8 sm:text-base"
            >
              Explore Services
            </Link>
          </div>

          <div className="mt-9 grid max-w-[650px] grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-blue-100 bg-white/90 p-4 shadow-[0_14px_35px_rgba(8,55,111,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <FontAwesomeIcon aria-hidden="true" icon={faUsers} />
                </span>
                <div>
                  <div className="text-xl font-black text-[#08376f]">5000+</div>
                  <div className="text-xs font-bold text-slate-500">Happy Patients</div>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-blue-100 bg-white/90 p-4 shadow-[0_14px_35px_rgba(8,55,111,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <FontAwesomeIcon aria-hidden="true" icon={faStar} />
                </span>
                <div>
                  <div className="text-xl font-black text-[#08376f]">4.9/5</div>
                  <div className="text-xs font-bold text-slate-500">Patient Rating</div>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-blue-100 bg-white/90 p-4 shadow-[0_14px_35px_rgba(8,55,111,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <FontAwesomeIcon aria-hidden="true" icon={faShieldHeart} />
                </span>
                <div>
                  <div className="text-sm font-black text-[#08376f]">Patient-first</div>
                  <div className="text-xs font-bold text-slate-500">Comfort & Safety</div>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-blue-100 bg-white/90 p-2 shadow-[0_18px_45px_rgba(8,55,111,0.14)] backdrop-blur-xl lg:bottom-8">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="grid h-10 w-10 place-items-center rounded-full text-blue-700 transition hover:bg-blue-50"
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
          className="grid h-10 w-10 place-items-center rounded-full text-blue-700 transition hover:bg-blue-50"
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
    </section>
  );
}

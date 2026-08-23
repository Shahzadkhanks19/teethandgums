"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronLeft, faChevronRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

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
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total],
  );

  const resetTimer = useCallback(() => {
    pauseAutoPlay();

    if (!shouldReduceMotion) {
      timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    }
  }, [next, pauseAutoPlay, shouldReduceMotion]);

  const resumeAutoPlay = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

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
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
    resumeAutoPlay();
  }, [handleNext, handlePrev, resumeAutoPlay]);

  useEffect(() => {
    resetTimer();

    return () => {
      pauseAutoPlay();
    };
  }, [pauseAutoPlay, resetTimer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAutoPlay();
      } else {
        resumeAutoPlay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
      className="relative min-h-[700px] touch-pan-y overflow-hidden bg-slate-950 sm:min-h-[740px] md:h-[88vh] md:min-h-[560px] md:max-h-[780px]"
    >

      <div className="absolute inset-0 z-[1]">
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.headline}
          fill
          priority={current === 0}
          fetchPriority={current === 0 ? "high" : "auto"}
          loading={current === 0 ? "eager" : "lazy"}
          sizes="100vw"
          quality={72}
          className="object-cover object-[58%_center] sm:object-[60%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/96 via-slate-950/70 to-slate-950/20 md:bg-gradient-to-r md:from-slate-950/92 md:via-slate-950/60 md:to-slate-950/10" />
      </div>

      <m.div
        key={slide.id}
        initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 z-10 flex flex-col justify-center px-5 pb-28 pt-24 sm:px-6 md:bottom-[65px] md:left-0 md:top-0 md:w-[min(720px,55%)] md:px-10 md:py-10 md:pl-[7%]"
      >
        {slide.eyebrow && (
          <m.span
            initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.45,
              delay: shouldReduceMotion ? 0 : 0.05,
            }}
            className="mb-4 inline-flex self-start rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-[9px] font-black uppercase tracking-[2px] text-blue-300 backdrop-blur sm:px-5 sm:text-[10px] md:text-xs"
          >
            {slide.eyebrow}
          </m.span>
        )}

        <m.h1
          initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : 0.12,
          }}
          className="max-w-[680px] text-[30px] font-black leading-[1.08] tracking-tight text-white drop-shadow-2xl sm:text-[36px] md:text-[clamp(28px,3.6vw,60px)]"
        >
          {slide.headline}
        </m.h1>

        {slide.subHeadline && (
          <m.h2
            initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.18,
            }}
            className="mt-4 max-w-[620px] text-sm leading-7 text-white/90 sm:text-base md:mt-5 md:text-xl md:leading-8"
          >
            {slide.subHeadline}
          </m.h2>
        )}

        {slide.bullets && (
          <ul className="mt-5 grid gap-3 md:mt-7 md:gap-4">
            {slide.bullets.map((bullet, index) => (
              <m.li
                key={bullet}
                initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                  delay: shouldReduceMotion ? 0 : 0.25 + index * 0.08,
                }}
                className="group flex items-center gap-3 md:gap-4"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-300 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white md:h-10 md:w-10">
                  <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="text-xs md:text-sm" />
                </div>

                <span className="text-sm font-bold text-white/95 md:text-base">
                  {bullet}
                </span>
              </m.li>
            ))}
          </ul>
        )}

        <m.div
          initial={current === 0 || shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.45,
            delay: shouldReduceMotion ? 0 : 0.45,
          }}
          className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10 md:gap-4"
        >
          <Link prefetch={false}
            href={slide.ctaLink}
            className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 px-7 py-4 text-sm font-black text-white shadow-[0_20px_45px_rgba(37,99,235,.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(37,99,235,.45)] active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 sm:px-9 sm:text-base"
          >
            {slide.ctaText}
            <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link prefetch={false}
            href="/services"
            className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition duration-300 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 sm:px-9 sm:text-base"
          >
            Explore Services
          </Link>
        </m.div>
      </m.div>

      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute bottom-20 left-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-white/15 text-3xl text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-600 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 md:bottom-6 md:top-1/2 md:h-12 md:w-12 md:-translate-y-1/2"
      >
        <FontAwesomeIcon aria-hidden="true" icon={faChevronLeft} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute bottom-20 right-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-white/15 text-3xl text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-blue-600 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 md:bottom-6 md:top-1/2 md:h-12 md:w-12 md:-translate-y-1/2"
      >
        <FontAwesomeIcon aria-hidden="true" icon={faChevronRight} />
      </button>

      <div
        role="tablist"
        aria-label="Hero slider navigation"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 md:bottom-9"
      >
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
              className={`h-3 rounded-full border border-white/80 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 ${
                isActive
                  ? "w-9 bg-white"
                  : "w-3 bg-transparent hover:bg-white/60"
              }`}
            />
          );
        })}
      </div>

      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/10"
        >
          <m.div
            key={current}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: AUTO_PLAY_INTERVAL / 1000,
              ease: "linear",
            }}
            className="h-full bg-gradient-to-r from-blue-400 to-white"
          />
        </div>
      )}
    </section>
  );
}
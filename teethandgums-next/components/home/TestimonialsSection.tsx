"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion, type PanInfo } from "framer-motion";

import { FadeUp, HoverButton, HoverCard, StaggerContainer, StaggerItem } from "@/components/animations";

const testimonials = [
  {
    name: "Lovekush Upadhyay",
    location: "Jodhpur",
    date: "4 months ago",
    rating: 5,
    review:
      "Dr. Sunita Khetani treated my tooth and gum problem very effectively. She is a very good and highly experienced doctor. She explained everything clearly and made me feel comfortable throughout the treatment. The treatment quality is excellent and the charges are very reasonable.",
  },
  {
    name: "Pramod Khanna",
    location: "Jodhpur",
    date: "4 months ago",
    rating: 5,
    review:
      "Excellent root canal and implant service. I am satisfied with the results. Dr. Suneeta Khetani and Dr. Vishal Khetani are knowledgeable and meticulous in their work, which made the whole process smooth and painless. Highly recommended.",
  },
  {
    name: "Harshraj Singh",
    location: "Jodhpur",
    date: "3 months ago",
    rating: 5,
    review:
      "I had a wonderful experience at this dental clinic. The entire team was warm, welcoming, and highly professional. The dentist took the time to explain every step of the procedure, which really helped put me at ease.",
  },
  {
    name: "Saurabh Agarwal",
    location: "Jodhpur",
    date: "5 months ago",
    rating: 5,
    review:
      "Very good service and professional approach. The issue was analyzed quickly and treated genuinely with reasonable charges. I really appreciate the prompt treatment. Thank you for the excellent care.",
  },
  {
    name: "Sushila Goswami",
    location: "Jodhpur",
    date: "4 months ago",
    rating: 5,
    review:
      "Very good experience. My daughter got treatment from Dr. Sunita Khetani. She is very polite and patient in explaining everything. My daughter actually asked when she can go back.",
  },
  {
    name: "Aditya Mehta",
    location: "Jodhpur",
    date: "3 months ago",
    rating: 5,
    review:
      "Been coming here for a decade. There is no doubt both doctors, Sunita ma’am and Vishal sir, are so good. Friendly environment and authentic treatment.",
  },
];

const googleReviewsLink = "https://share.google/X1DeFzBmXM8WkGAuc";
const AUTOPLAY_INTERVAL = 4500;
const SWIPE_THRESHOLD = 45;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [paused, setPaused] = useState(false);
  const resizeFrameRef = useRef<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const didSwipeRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, []);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) nextSlide();
      if (info.offset.x > SWIPE_THRESHOLD) prevSlide();
    },
    [nextSlide, prevSlide],
  );

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    didSwipeRef.current = false;
    setPaused(true);
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartXRef.current;
      const deltaY = touch.clientY - touchStartYRef.current;

      if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        didSwipeRef.current = true;
        if (deltaX < 0) nextSlide();
        else prevSlide();
      }

      window.setTimeout(() => {
        didSwipeRef.current = false;
        setPaused(false);
      }, 80);
    },
    [nextSlide, prevSlide],
  );

  const preventClickAfterSwipe = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!didSwipeRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };

    const handleResize = () => {
      if (resizeFrameRef.current) cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = requestAnimationFrame(updateCardsToShow);
    };

    updateCardsToShow();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeFrameRef.current) cancelAnimationFrame(resizeFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide, paused, shouldReduceMotion]);

  useEffect(() => {
    const handleVisibilityChange = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const visibleTestimonials = useMemo(() => {
    return Array.from({ length: cardsToShow }, (_, index) => testimonials[(current + index) % testimonials.length]);
  }, [cardsToShow, current]);

  return (
    <section aria-labelledby="testimonials-title" aria-roledescription="carousel" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-blue-100/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-blue-700">Patient Stories</span>
              <h2 id="testimonials-title" className="mt-5 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#08376f] md:text-5xl xl:text-[58px]">
                Trusted by Patients.
                <span className="block text-blue-600">Remembered for Care.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">Real Google reviews reflecting our commitment to gentle, advanced, and comfortable dental care.</p>
            </div>

            <a href={googleReviewsLink} target="_blank" rel="noopener noreferrer" aria-label="View Teeth and Gums Care Google reviews" className="inline-flex items-center gap-4 rounded-[24px] border border-blue-100 bg-white px-5 py-4 shadow-[0_16px_45px_rgba(8,55,111,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(37,99,235,0.12)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50">
                <Image src="/images/google.svg" alt="" aria-hidden="true" width={26} height={26} />
              </div>
              <div>
                <div className="text-xl font-black text-[#08376f]">4.9/5</div>
                <div className="text-xs font-bold text-slate-500">Google Rating</div>
              </div>
            </a>
          </div>
        </FadeUp>

        <div className="relative mt-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
          <button type="button" onClick={prevSlide} className="absolute -left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-[0_14px_35px_rgba(8,55,111,0.12)] transition hover:bg-blue-600 hover:text-white lg:grid" aria-label="Previous testimonial">
            <FontAwesomeIcon aria-hidden="true" icon={faChevronLeft} />
          </button>

          <AnimatePresence mode="wait">
            <m.div
              key={`${current}-${cardsToShow}`}
              drag="x"
              dragDirectionLock
              dragMomentum={false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
              className="cursor-grab touch-pan-y select-none active:cursor-grabbing"
            >
              <StaggerContainer className={`grid items-stretch gap-6 ${cardsToShow === 1 ? "grid-cols-1" : cardsToShow === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                {visibleTestimonials.map((item, index) => (
                  <StaggerItem key={item.name}>
                    <HoverCard className="h-full">
                      <a
                        href={googleReviewsLink}
                        onClick={preventClickAfterSwipe}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Read Google review by ${item.name}`}
                        className={`group relative flex h-full min-h-[390px] flex-col overflow-hidden rounded-[30px] border p-7 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${index === 0 ? "border-[#08376f] bg-gradient-to-br from-[#08376f] to-[#0b3c91] text-white shadow-[0_28px_70px_rgba(8,55,111,0.22)]" : "border-blue-100 bg-white text-slate-900 shadow-[0_18px_50px_rgba(8,55,111,0.09)] hover:border-blue-200 hover:shadow-[0_28px_70px_rgba(37,99,235,0.14)]"}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-4">
                            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-black shadow-lg ${index === 0 ? "bg-white text-blue-700" : "bg-gradient-to-br from-blue-500 to-[#0b3c91] text-white"}`}>{getInitials(item.name)}</div>
                            <div className="min-w-0">
                              <h3 className="truncate font-black">{item.name}</h3>
                              <span className={`text-sm font-bold ${index === 0 ? "text-blue-100/70" : "text-slate-500"}`}>{item.location}</span>
                            </div>
                          </div>
                          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${index === 0 ? "bg-white" : "border border-slate-200 bg-white"}`}>
                            <Image src="/images/google.svg" alt="" aria-hidden="true" width={22} height={22} />
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-1" aria-label={`${item.rating} star rating`}>
                          {[...Array(item.rating)].map((_, starIndex) => (
                            <FontAwesomeIcon key={starIndex} aria-hidden="true" icon={faStar} className="text-[#FBBC05]" />
                          ))}
                          <span className={`ml-2 text-sm font-bold ${index === 0 ? "text-blue-100/70" : "text-slate-500"}`}>{item.date}</span>
                        </div>

                        <p className={`mt-5 flex-1 text-base leading-8 ${index === 0 ? "text-white/82" : "text-slate-600"}`} style={{ display: "-webkit-box", WebkitLineClamp: 7, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          “{item.review}”
                        </p>

                        <div className={`mt-6 font-black ${index === 0 ? "text-blue-200" : "text-blue-600"}`}>
                          <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2" />
                          Verified Google Review
                        </div>
                      </a>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </m.div>
          </AnimatePresence>

          <button type="button" onClick={nextSlide} className="absolute -right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-[0_14px_35px_rgba(8,55,111,0.12)] transition hover:bg-blue-600 hover:text-white lg:grid" aria-label="Next testimonial">
            <FontAwesomeIcon aria-hidden="true" icon={faChevronRight} />
          </button>
        </div>

        <div aria-live="polite" className="sr-only">Showing review {current + 1} of {testimonials.length}</div>

        <div role="tablist" aria-label="Testimonials navigation" className="mt-9 flex justify-center gap-2.5">
          {testimonials.map((item, index) => {
            const isActive = index === current;
            return (
              <button key={item.name} type="button" role="tab" aria-selected={isActive} aria-label={`Go to testimonial ${index + 1} by ${item.name}`} onClick={() => setCurrent(index)} className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${isActive ? "w-8 bg-blue-700" : "w-2.5 bg-blue-200 hover:bg-blue-400"}`} />
            );
          })}
        </div>

        <FadeUp delay={0.2}>
          <div className="mt-10 text-center">
            <HoverButton>
              <a href={googleReviewsLink} target="_blank" rel="noopener noreferrer" aria-label="View all Google reviews for Teeth and Gums Care" className="group inline-flex items-center rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-8 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                <Image src="/images/google.svg" alt="" aria-hidden="true" width={22} height={22} className="mr-2 rounded-full bg-white p-0.5" />
                View All Google Reviews
              </a>
            </HoverButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

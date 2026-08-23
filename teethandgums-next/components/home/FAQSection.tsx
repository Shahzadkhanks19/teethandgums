"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronDown, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

import { homeFaqs } from "@/data/homeFaqs";

import {
  FadeUp,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

const MOBILE_SCROLL_OFFSET = 120;

export default function FAQSection() {
  const [activeFaq, setActiveFaq] = useState(homeFaqs[0]?.id ?? "");
  const shouldReduceMotion = useReducedMotion();
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
  window.clearTimeout(scrollTimerRef.current);
}
    };
  }, []);

  const scrollFaqIntoView = (faqId: string) => {
    if (window.innerWidth >= 1024) return;

    window.requestAnimationFrame(() => {
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);

      scrollTimerRef.current = window.setTimeout(() => {
        const button = buttonRefs.current[faqId];

        if (!button) return;

        const buttonTop = button.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: buttonTop - MOBILE_SCROLL_OFFSET,
          behavior: shouldReduceMotion ? "auto" : "smooth",
        });
      }, 220);
    });
  };

  return (
    <section
      aria-labelledby="home-faq-title"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 xl:gap-20">
        <FadeUp>
          <div className="lg:sticky lg:top-32">
            <span className="inline-flex rounded-full bg-blue-50 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-100">
              FAQs
            </span>

            <h2
              id="home-faq-title"
              className="mt-5 max-w-[560px] text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Frequently Asked Questions
            </h2>

            <p className="mt-6 max-w-[560px] leading-8 text-slate-500">
              Find answers to common questions about dental treatments,
              appointments, preventive care, cosmetic dentistry, and visiting
              Teeth &amp; Gums Care.
            </p>

            <HoverCard>
              <aside className="mt-9 flex gap-5 rounded-[28px] border border-blue-100 bg-blue-50/70 p-6 shadow-[0_18px_45px_rgba(37,99,235,0.08)]">
                <div
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-xl text-white shadow-lg shadow-blue-100"
                >
                  <FontAwesomeIcon icon={faPhone} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Need More Help?
                  </h3>

                  <p className="mt-1 leading-7 text-slate-500">
                    Speak with our clinic team for personalized guidance,
                    appointment support, or urgent dental concerns.
                  </p>

                  <a
                    href="tel:+919829824356"
                    itemProp="telephone"
                    aria-label="Call Teeth and Gums Care for help"
                    className="group mt-3 inline-flex items-center font-black text-blue-600 transition-colors duration-300 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                  >
                    Call Clinic

                    <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </aside>
            </HoverCard>
          </div>
        </FadeUp>

        <StaggerContainer className="grid gap-5">
          {homeFaqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            const buttonId = `home-faq-button-${faq.id}`;
            const panelId = `home-faq-panel-${faq.id}`;

            return (
              <StaggerItem key={faq.id}>
                <HoverCard>
                  <article className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.12)]">
                    <button
                      ref={(element) => {
                        buttonRefs.current[faq.id] = element;
                      }}
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        const nextState = isOpen ? "" : faq.id;

                        setActiveFaq(nextState);

                        if (!isOpen) {
                          scrollFaqIntoView(faq.id);
                        }
                      }}
                      className={`flex w-full items-center justify-between gap-4 p-6 text-left text-lg font-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                        isOpen
                          ? "bg-gradient-to-r from-blue-600 to-blue-900 text-white"
                          : "text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50"
                      }`}
                    >
                      <span>{faq.question}</span>

                      <m.span
                        aria-hidden="true"
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          scale: isOpen ? 1.1 : 1,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="shrink-0"
                      >
                        <FontAwesomeIcon icon={faChevronDown} />
                      </m.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <m.div
                          layout
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={
                            shouldReduceMotion
                              ? false
                              : {
                                  height: 0,
                                  opacity: 0,
                                }
                          }
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={
                            shouldReduceMotion
                              ? {
                                  opacity: 0,
                                }
                              : {
                                  height: 0,
                                  opacity: 0,
                                }
                          }
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-blue-100 p-6 text-[15px] leading-8 text-slate-600">
                            {faq.answer}
                          </div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </article>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useReducedMotion,
} from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import type { Service } from "@/data/services";

import {
  FadeUp,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

interface Props {
  service: Service;
}

const MOBILE_SCROLL_OFFSET = 120;

export default function ServiceFAQ({ service }: Props) {
  const faqs = Array.isArray(service.faqs) ? service.faqs : [];

  const [activeFaq, setActiveFaq] = useState(
    faqs.length > 0 ? 0 : -1,
  );

  const shouldReduceMotion = useReducedMotion();

  const buttonRefs = useRef<
    Record<number, HTMLButtonElement | null>
  >({});

  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const scrollFaqIntoView = (index: number) => {
    if (window.innerWidth >= 1024) return;

    window.requestAnimationFrame(() => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(
        () => {
          const button = buttonRefs.current[index];

          if (!button) return;

          const buttonTop =
            button.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: buttonTop - MOBILE_SCROLL_OFFSET,
            behavior: shouldReduceMotion ? "auto" : "smooth",
          });
        },
        shouldReduceMotion ? 0 : 220,
      );
    });
  };

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby={`service-faq-title-${service.slug}`}
      className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mb-14 text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black uppercase text-blue-600 ring-1 ring-blue-200/60">
              Treatment Questions &amp; Answers
            </span>

            <h2
              id={`service-faq-title-${service.slug}`}
              className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              {service.title} FAQs
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
              Find clear answers to common questions about{" "}
              {service.title}, treatment planning, recovery and dental care
              at Teeth and Gums Care in Jodhpur.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid gap-5">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            const buttonId = `service-faq-button-${service.slug}-${index}`;
            const panelId = `service-faq-panel-${service.slug}-${index}`;

            return (
              <StaggerItem
                key={`${service.slug}-${index}-${faq.question}`}
              >
                <HoverCard>
                  <article className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,.06)] transition duration-300 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,.12)]">
                    <button
                      ref={(element) => {
                        buttonRefs.current[index] = element;
                      }}
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        const nextState = isOpen ? -1 : index;

                        setActiveFaq(nextState);

                        if (!isOpen) {
                          scrollFaqIntoView(index);
                        }
                      }}
                      className={`flex w-full items-center justify-between gap-4 p-6 text-left font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:p-7 ${
                        isOpen
                          ? "bg-gradient-to-br from-blue-600 to-blue-900 text-white"
                          : "text-slate-900 hover:bg-blue-50"
                      }`}
                    >
                      <span>{faq.question}</span>

                      <m.span
                        aria-hidden="true"
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          scale: isOpen ? 1.08 : 1,
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
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={
                            shouldReduceMotion
                              ? false
                              : {
                                  opacity: 0,
                                  y: -8,
                                }
                          }
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: -6,
                          }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-blue-100 p-6 leading-8 text-slate-500 sm:p-7">
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
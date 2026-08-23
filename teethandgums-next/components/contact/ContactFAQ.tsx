// ContactFAQ.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronDown,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

import { contactFaqs } from "@/data/contactFaqs";
import {
  FadeUp,
  HoverCard,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

const MOBILE_SCROLL_OFFSET = 120;

export default function ContactFAQ() {
  const [activeFaq, setActiveFaq] = useState(contactFaqs[0]?.id ?? "");
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

    requestAnimationFrame(() => {
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        const button = buttonRefs.current[faqId];
        if (!button) return;

        const top = button.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: top - MOBILE_SCROLL_OFFSET,
          behavior: shouldReduceMotion ? "auto" : "smooth",
        });
      }, 220);
    });
  };

  return (
    <section
      aria-labelledby="contact-faq-title"
      className="[content-visibility:auto] [contain-intrinsic-size:950px] relative overflow-hidden scroll-mt-24 bg-gradient-to-b from-white to-blue-50 py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 xl:gap-20">
        <FadeUp>
          <div className="lg:sticky lg:top-32">
            <span className="inline-flex rounded-full bg-blue-50 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-100">
              Contact FAQs
            </span>

            <h2
              id="contact-faq-title"
              className="mt-5 max-w-[560px] text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Frequently Asked Questions About Visiting Our Clinic
            </h2>

            <p className="mt-6 max-w-[560px] leading-8 text-slate-500">
              Find answers to the most common questions about appointments,
              emergency dental care, clinic timings, payment options, and
              visiting Teeth &amp; Gums Care Dental Clinic in Jodhpur.
            </p>

            <HoverCard>
              <aside className="mt-9 flex gap-5 rounded-[28px] border border-blue-100 bg-blue-50/70 p-6 shadow-[0_18px_45px_rgba(37,99,235,.08)]">
                <div
                  aria-hidden="true"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-xl text-white shadow-lg"
                >
                  <FontAwesomeIcon icon={faPhone} />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Need Immediate Assistance?
                  </h3>

                  <p className="mt-1 leading-7 text-slate-500">
                    Speak directly with our dental team for appointments,
                    treatment guidance, or emergency dental care.
                  </p>

                  <a
                    href="tel:+919829824356"
                    itemProp="telephone"
                    aria-label="Call Teeth & Gums Care"
                    className="mt-3 inline-flex items-center font-black text-blue-600 transition hover:text-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                  >
                    Call Now
<FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-2" />
                  </a>
                </div>
              </aside>
            </HoverCard>
          </div>
        </FadeUp>

        <StaggerContainer className="grid gap-5">
          {contactFaqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            const buttonId = `contact-faq-button-${faq.id}`;
            const panelId = `contact-faq-panel-${faq.id}`;

            return (
              <StaggerItem key={faq.id}>
                <HoverCard>
                  <article className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,.06)] transition hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,.12)]">
                    <button
                      ref={(el) => {
                        buttonRefs.current[faq.id] = el;
                      }}
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        const next = isOpen ? "" : faq.id;
                        setActiveFaq(next);
                        if (!isOpen) scrollFaqIntoView(faq.id);
                      }}
                      className={`flex w-full items-center justify-between gap-4 p-6 text-left text-lg font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                        isOpen
                          ? "bg-gradient-to-r from-blue-600 to-blue-900 text-white"
                          : "text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50"
                      }`}
                    >
                      <span>{faq.question}</span>

                      <m.span
                        aria-hidden="true"
                        className="shrink-0"
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          scale: isOpen ? 1.1 : 1,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
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
                              : { height: 0, opacity: 0 }
                          }
                          animate={{ height: "auto", opacity: 1 }}
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
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
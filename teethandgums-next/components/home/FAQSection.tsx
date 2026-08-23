"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronDown, faPhone } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

import { homeFaqs } from "@/data/homeFaqs";
import { FadeUp, HoverCard, StaggerContainer, StaggerItem } from "@/components/animations";

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
    <section aria-labelledby="home-faq-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-20 h-96 w-96 rounded-full bg-blue-100/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1380px] grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 xl:gap-16">
        <FadeUp>
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-blue-700 shadow-sm">FAQs</span>

            <h2 id="home-faq-title" className="mt-6 max-w-[520px] text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#08376f] md:text-5xl">
              Clear Answers.
              <span className="block text-blue-600">Confident Decisions.</span>
            </h2>

            <p className="mt-6 max-w-[520px] text-lg leading-8 text-slate-500">
              Helpful answers to common questions about appointments, treatments, preventive care, and visiting Teeth &amp; Gums Care.
            </p>

            <HoverCard>
              <aside className="relative mt-9 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#08376f] to-[#0b3c91] p-7 text-white shadow-[0_24px_60px_rgba(8,55,111,0.22)]">
                <div aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[20px] border-white/10" />
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl text-blue-100 ring-1 ring-white/10">
                  <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
                </div>
                <h3 className="relative z-10 mt-5 text-2xl font-black">Still have a question?</h3>
                <p className="relative z-10 mt-3 leading-7 text-blue-50/75">Speak directly with our clinic team for personalised guidance or appointment support.</p>
                <a
                  href="tel:+919829824356"
                  itemProp="telephone"
                  aria-label="Call Teeth and Gums Care for help"
                  className="group relative z-10 mt-5 inline-flex items-center font-black text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Call Clinic
                  <FontAwesomeIcon aria-hidden="true" icon={faArrowRight} className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </aside>
            </HoverCard>
          </div>
        </FadeUp>

        <div className="rounded-[34px] border border-blue-100 bg-white p-4 shadow-[0_24px_70px_rgba(8,55,111,0.10)] sm:p-6">
          <StaggerContainer className="grid gap-3">
            {homeFaqs.map((faq, index) => {
              const isOpen = activeFaq === faq.id;
              const buttonId = `home-faq-button-${faq.id}`;
              const panelId = `home-faq-panel-${faq.id}`;

              return (
                <StaggerItem key={faq.id}>
                  <article className={`overflow-hidden rounded-[24px] border transition-all duration-300 ${isOpen ? "border-blue-200 bg-blue-50/50 shadow-[0_14px_40px_rgba(37,99,235,0.10)]" : "border-slate-100 bg-white hover:border-blue-100"}`}>
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
                        if (!isOpen) scrollFaqIntoView(faq.id);
                      }}
                      className="flex w-full items-center gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:p-6"
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-black transition ${isOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"}`}>0{index + 1}</span>
                      <span className={`flex-1 text-base font-black sm:text-lg ${isOpen ? "text-[#08376f]" : "text-slate-800"}`}>{faq.question}</span>
                      <m.span
                        aria-hidden="true"
                        animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.08 : 1 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${isOpen ? "bg-blue-600 text-white" : "bg-slate-50 text-blue-700"}`}
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
                          initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-blue-100 px-5 pb-6 pt-5 text-[15px] leading-8 text-slate-600 sm:px-[76px]">{faq.answer}</div>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

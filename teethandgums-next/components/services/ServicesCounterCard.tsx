"use client";

import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useInView } from "react-intersection-observer";
import { m, useReducedMotion } from "framer-motion";

import { HoverCard } from "@/components/animations";

type ServicesCounterCardProps = {
  icon: IconDefinition;
  end: number;
  suffix?: string;
  title: string;
  decimals?: number;
  index?: number;
};

export default function ServicesCounterCard({
  icon,
  end,
  suffix = "",
  title,
  decimals = 0,
  index = 0,
}: ServicesCounterCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "80px 0px",
  });

  return (
    <m.div
      ref={ref}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.98,
            }
      }
      animate={
        inView || shouldReduceMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : undefined
      }
      transition={{
        duration: 0.4,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <HoverCard className="h-full">
        <article
          aria-label={title}
          className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-blue-100 bg-white p-6 text-center shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)]"
        >
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <div
            aria-hidden="true"
            className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-2xl text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
          >
            <FontAwesomeIcon icon={icon} />
          </div>

          <h3
            className="text-4xl font-black leading-none text-blue-600 transition-colors duration-300 group-hover:text-blue-700"
          >
            {inView ? (
              <CountUp
                end={end}
                duration={shouldReduceMotion ? 0 : 1.5}
                decimals={decimals}
                separator=","
              />
            ) : decimals > 0 ? (
              `0.${"0".repeat(decimals)}`
            ) : (
              "0"
            )}
            {suffix}
          </h3>

          <p className="mt-4 flex-1 font-semibold leading-7 text-slate-500">
            {title}
          </p>
        </article>
      </HoverCard>
    </m.div>
  );
}
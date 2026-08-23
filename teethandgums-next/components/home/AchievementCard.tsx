"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import CountUp from "react-countup";
import { m, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { HoverCard } from "@/components/animations";

/* ============================================
   TYPES
============================================ */

interface AchievementCardProps {
  icon: IconDefinition;
  number: number;
  suffix?: string;
  title: string;
  text: string;
  decimals?: number;
  index?: number;
}

/* ============================================
   COMPONENT
============================================ */

export default function AchievementCard({
  icon,
  number,
  suffix = "",
  title,
  text,
  decimals = 0,
  index = 0,
}: AchievementCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.25,
  });

  const initialCounterValue = decimals > 0 ? `0.${"0".repeat(decimals)}` : "0";

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
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <HoverCard className="h-full">
        <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white/95 p-8 text-center shadow-[0_18px_50px_rgba(37,99,235,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_28px_80px_rgba(37,99,235,0.18)]">
          {/* Top accent */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          {/* Subtle card glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-cyan-50/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* Icon */}
          <div
            aria-hidden="true"
            className="relative z-10 mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-110 group-hover:shadow-2xl"
          >
            <FontAwesomeIcon icon={icon} aria-hidden="true" />
          </div>

          {/* Counter */}
          <p className="relative z-10 text-4xl font-black leading-none tracking-tight text-blue-800 transition-colors duration-300 group-hover:text-blue-600 md:text-[42px]">
            {inView ? (
              <CountUp
                end={number}
                duration={shouldReduceMotion ? 0 : 2.2}
                decimals={decimals}
                separator=","
              />
            ) : (
              initialCounterValue
            )}

            {suffix}
          </p>

          {/* Title */}
          <h3 className="relative z-10 mt-4 text-lg font-black text-slate-900">
            {title}
          </h3>

          {/* Description */}
          <p className="relative z-10 mt-3 flex-1 leading-7 text-slate-500">
            {text}
          </p>
        </article>
      </HoverCard>
    </m.div>
  );
}
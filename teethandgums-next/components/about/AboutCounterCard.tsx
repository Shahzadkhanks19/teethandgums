"use client";

import CountUp from "react-countup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { m, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { HoverCard } from "@/components/animations";

/* ============================================
   TYPES
============================================ */

interface AboutCounterCardProps {
  icon: IconDefinition;
  end: number;
  suffix?: string;
  title: string;
  decimals?: number;
  index?: number;
}

/* ============================================
   COMPONENT
============================================ */

export default function AboutCounterCard({
  icon,
  end,
  suffix = "",
  title,
  decimals = 0,
  index = 0,
}: AboutCounterCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "80px 0px",
  });

  return (
    <m.div
      ref={ref}
      className="h-full"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.97,
            }
      }
      animate={
        inView || shouldReduceMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : undefined
      }
      transition={{
        duration: 0.45,
        delay: shouldReduceMotion ? 0 : index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <HoverCard className="h-full">
        <article
          className="
            group
            relative
            flex
            h-full
            flex-col
            overflow-hidden
            rounded-[30px]
            border
            border-white/20
            bg-white/15
            p-8
            text-center
            shadow-[0_18px_50px_rgba(15,23,42,.12)]
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-1
            hover:bg-white/20
            hover:shadow-[0_28px_80px_rgba(15,23,42,.18)]
          "
        >
          {/* Hover Accent */}
          <div
            aria-hidden="true"
            className="
              absolute
              left-0
              top-0
              h-1.5
              w-full
              bg-gradient-to-r
              from-white
              via-blue-200
              to-cyan-200
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />

          {/* Background Glow */}
          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-white/5
              via-transparent
              to-blue-100/5
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />

          {/* Icon */}
          <div
            aria-hidden="true"
            className="
              relative
              z-10
              mx-auto
              mb-6
              grid
              h-[78px]
              w-[78px]
              place-items-center
              rounded-[24px]
              bg-white
              text-3xl
              text-blue-600
              shadow-xl
              shadow-blue-900/10
              transition-all
              duration-500
              group-hover:scale-110
              group-hover:rotate-6
            "
          >
            <FontAwesomeIcon icon={icon} />
          </div>

          {/* Counter */}
          <h3
            className="
              relative
              z-10
              text-4xl
              font-black
              leading-none
              tracking-tight
              text-white
              md:text-5xl
            "
          >
            {inView ? (
              <CountUp
                end={end}
                duration={shouldReduceMotion ? 0 : 1.6}
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

          {/* Title */}
          <p
            className="
              relative
              z-10
              mt-4
              flex-1
              text-base
              font-bold
              leading-7
              text-white/90
            "
          >
            {title}
          </p>
        </article>
      </HoverCard>
    </m.div>
  );
}
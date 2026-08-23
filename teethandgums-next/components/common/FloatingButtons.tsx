"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  m,
  type Variants,
  useReducedMotion,
} from "framer-motion";

/* ============================================
   SHARED STYLES
============================================ */

const buttonClass =
  "grid h-[52px] w-[52px] place-items-center rounded-full text-xl text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:h-[58px] md:w-[58px] md:text-[22px]";

/* ============================================
   ANIMATION VARIANTS
============================================ */

const floatingVariants: Variants = {
  static: {
    y: 0,
  },
  floating: {
    y: [0, -6, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const backToTopVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
    y: 18,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    y: 18,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

/* ============================================
   COMPONENT
============================================ */

export default function FloatingButtons() {
  const [showTopButton, setShowTopButton] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const floatingState = shouldReduceMotion ? "static" : "floating";

  return (
    <div
      aria-label="Quick actions"
      className="fixed bottom-[15px] right-[15px] z-[9999] flex flex-col gap-2.5 md:bottom-[25px] md:right-[22px] md:gap-3"
    >
      {/* Book Appointment */}
      <m.div
        variants={floatingVariants}
        initial="static"
        animate={floatingState}
      >
        <Link
          prefetch={false}
          href="/book-appointment"
          aria-label="Book an appointment"
          title="Book Appointment"
          className={`${buttonClass} bg-gradient-to-br from-blue-600 to-blue-900 shadow-[0_12px_30px_rgba(0,0,0,0.18),0_4px_12px_rgba(13,110,253,0.15)]`}
        >
          <FontAwesomeIcon
            aria-hidden="true"
            icon={faCalendarCheck}
          />
        </Link>
      </m.div>

      {/* WhatsApp */}
      <m.div
        variants={floatingVariants}
        initial="static"
        animate={floatingState}
      >
        <a
          href="https://wa.me/919829824356"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Teeth and Gums Care on WhatsApp"
          title="Chat on WhatsApp"
          className={`${buttonClass} bg-gradient-to-br from-green-500 to-green-600 shadow-[0_12px_30px_rgba(0,0,0,0.18),0_4px_12px_rgba(37,211,102,0.15)] focus-visible:ring-green-200`}
        >
          <FontAwesomeIcon
            aria-hidden="true"
            icon={faWhatsapp}
          />
        </a>
      </m.div>

      {/* Back to Top */}
      <AnimatePresence>
        {showTopButton && (
          <m.div
            key="back-to-top"
            variants={backToTopVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            exit={shouldReduceMotion ? undefined : "exit"}
          >
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to the top of the page"
              title="Back to Top"
              className={`${buttonClass} bg-gradient-to-br from-blue-600 to-blue-900 shadow-[0_12px_30px_rgba(0,0,0,0.18),0_4px_12px_rgba(13,110,253,0.15)]`}
            >
              <FontAwesomeIcon
                aria-hidden="true"
                icon={faArrowUp}
              />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
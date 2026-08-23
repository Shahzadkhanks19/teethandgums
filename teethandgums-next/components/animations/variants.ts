import type { Variants } from "framer-motion";

import {
  fastDuration,
  normalDuration,
  smoothEase,
} from "./animationConfig";
import type { MotionVariant } from "./Motion";

export const revealVariants: Record<MotionVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: normalDuration,
        ease: smoothEase,
      },
    },
  },

  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: normalDuration,
        ease: smoothEase,
      },
    },
  },

  slideLeft: {
    hidden: { opacity: 0, x: 22 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: normalDuration,
        ease: smoothEase,
      },
    },
  },

  slideRight: {
    hidden: { opacity: 0, x: -22 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: normalDuration,
        ease: smoothEase,
      },
    },
  },

  zoomIn: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: normalDuration,
        ease: smoothEase,
      },
    },
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: fastDuration,
        ease: smoothEase,
      },
    },
  },

  rotateIn: {
    hidden: { opacity: 0, rotate: -1.2, y: 16 },
    visible: {
      opacity: 1,
      rotate: 0,
      y: 0,
      transition: {
        duration: normalDuration,
        ease: smoothEase,
      },
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.46,
      ease: smoothEase,
    },
  },
};

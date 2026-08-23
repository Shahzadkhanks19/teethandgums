import type { CSSProperties } from "react";
import type {
  Transition,
  ViewportOptions,
} from "framer-motion";

export const smoothEase: [
  number,
  number,
  number,
  number,
] = [0.22, 1, 0.36, 1];

export const fastDuration = 0.36;
export const normalDuration = 0.52;
export const slowDuration = 0.8;

/**
 * Shared viewport configuration for regular reveal animations.
 *
 * A zero margin and low visibility threshold make the observer reliable
 * across mobile devices, browser resizing and DevTools responsive mode.
 */
export const viewportConfig: ViewportOptions = {
  once: true,
  amount: 0.05,
  margin: "0px",
};

export const springConfig: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 22,
  mass: 0.8,
};

export const hoverSpringConfig: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
  mass: 0.75,
};

export const motionBaseStyle: CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};
"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  motionBaseStyle,
  viewportConfig,
} from "./animationConfig";
import { revealVariants } from "./variants";

export type MotionVariant =
  | "fadeUp"
  | "fadeDown"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "scaleIn"
  | "rotateIn";

type MotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: MotionVariant;
};

export default function Motion({
  children,
  className = "",
  delay = 0,
  variant = "fadeUp",
}: MotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedVariant = revealVariants[variant];

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      style={motionBaseStyle}
      variants={selectedVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

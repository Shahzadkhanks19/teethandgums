"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { motionBaseStyle } from "./animationConfig";

import {
  staggerContainerVariants,
  staggerItemVariants,
} from "./variants";

type StaggerProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerContainer({
  children,
  className = "",
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      style={motionBaseStyle}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      style={motionBaseStyle}
      variants={staggerItemVariants}
    >
      {children}
    </m.div>
  );
}
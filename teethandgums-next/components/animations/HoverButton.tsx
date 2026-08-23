"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  hoverSpringConfig,
  motionBaseStyle,
} from "./animationConfig";

type HoverButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function HoverButton({
  children,
  className = "",
}: HoverButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span className={className} style={{ display: "inline-block" }}>
        {children}
      </span>
    );
  }

  return (
    <m.span
      className={className}
      style={{
        ...motionBaseStyle,
        display: "inline-block",
      }}
      whileHover={{ y: -3, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      transition={hoverSpringConfig}
    >
      {children}
    </m.span>
  );
}

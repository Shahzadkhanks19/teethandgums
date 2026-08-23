"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  motionBaseStyle,
  smoothEase,
} from "./animationConfig";

type HoverImageProps = {
  children: ReactNode;
  className?: string;
};

export default function HoverImage({
  children,
  className = "",
}: HoverImageProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      style={motionBaseStyle}
      whileHover={{ scale: 1.035 }}
      transition={{
        duration: 0.32,
        ease: smoothEase,
      }}
    >
      {children}
    </m.div>
  );
}

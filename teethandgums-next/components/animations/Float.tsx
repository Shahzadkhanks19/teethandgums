"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { motionBaseStyle } from "./animationConfig";

type FloatProps = {
  children: ReactNode;
  className?: string;
};

export default function Float({
  children,
  className = "",
}: FloatProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      style={motionBaseStyle}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {children}
    </m.div>
  );
}

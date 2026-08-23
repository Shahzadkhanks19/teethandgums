"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
  hoverSpringConfig,
  motionBaseStyle,
} from "./animationConfig";

type HoverCardProps = {
  children: ReactNode;
  className?: string;
};

export default function HoverCard({
  children,
  className = "",
}: HoverCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      style={{
        ...motionBaseStyle,
        width: "100%",
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={hoverSpringConfig}
    >
      {children}
    </m.div>
  );
}

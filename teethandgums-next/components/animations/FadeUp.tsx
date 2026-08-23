"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeUp({
  children,
  className,
  delay,
}: FadeUpProps) {
  return (
    <Motion variant="fadeUp" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface SlideLeftProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function SlideLeft({
  children,
  className,
  delay,
}: SlideLeftProps) {
  return (
    <Motion variant="slideLeft" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

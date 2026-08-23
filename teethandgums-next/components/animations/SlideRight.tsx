"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface SlideRightProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function SlideRight({
  children,
  className,
  delay,
}: SlideRightProps) {
  return (
    <Motion variant="slideRight" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

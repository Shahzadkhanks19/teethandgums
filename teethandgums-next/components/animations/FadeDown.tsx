"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface FadeDownProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeDown({
  children,
  className,
  delay,
}: FadeDownProps) {
  return (
    <Motion variant="fadeDown" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface RotateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function RotateIn({
  children,
  className,
  delay,
}: RotateInProps) {
  return (
    <Motion variant="rotateIn" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

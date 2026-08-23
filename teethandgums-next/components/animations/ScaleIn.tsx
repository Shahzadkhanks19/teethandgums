"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScaleIn({
  children,
  className,
  delay,
}: ScaleInProps) {
  return (
    <Motion variant="scaleIn" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

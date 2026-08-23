"use client";

import type { ReactNode } from "react";

import Motion from "./Motion";

interface ZoomInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ZoomIn({
  children,
  className,
  delay,
}: ZoomInProps) {
  return (
    <Motion variant="zoomIn" className={className} delay={delay}>
      {children}
    </Motion>
  );
}

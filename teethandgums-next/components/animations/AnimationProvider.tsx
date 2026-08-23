"use client";

import {
  domAnimation,
  LazyMotion,
  MotionConfig,
} from "framer-motion";
import type { ReactNode } from "react";

import { normalDuration, smoothEase } from "./animationConfig";

interface AnimationProviderProps {
  children: ReactNode;
}

export default function AnimationProvider({
  children,
}: AnimationProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{
          duration: normalDuration,
          ease: smoothEase,
        }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MINIMUM_DISPLAY_TIME = 900;
const MAXIMUM_DISPLAY_TIME = 5000;
const EXIT_ANIMATION_TIME = 420;

export default function GlobalPreloader() {
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const startedAtRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    startedAtRef.current = performance.now();

    document.documentElement.classList.add("site-preloader-active");
    document.body.setAttribute("aria-busy", "true");

    const finishPreloader = () => {
      if (hasFinishedRef.current) return;

      hasFinishedRef.current = true;

      const elapsed = performance.now() - startedAtRef.current;
      const remaining = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);

      hideTimerRef.current = window.setTimeout(() => {
        setIsExiting(true);

        document.documentElement.classList.remove(
          "site-preloader-active",
        );

        document.body.removeAttribute("aria-busy");

        exitTimerRef.current = window.setTimeout(() => {
          setIsMounted(false);
        }, EXIT_ANIMATION_TIME);
      }, remaining);
    };

    if (document.readyState === "complete") {
      window.requestAnimationFrame(finishPreloader);
    } else {
      window.addEventListener("load", finishPreloader, {
        once: true,
      });
    }

    safetyTimerRef.current = window.setTimeout(
      finishPreloader,
      MAXIMUM_DISPLAY_TIME,
    );

    return () => {
      window.removeEventListener("load", finishPreloader);

      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }

      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }

      if (safetyTimerRef.current !== null) {
        window.clearTimeout(safetyTimerRef.current);
      }

      document.documentElement.classList.remove(
        "site-preloader-active",
      );

      document.body.removeAttribute("aria-busy");
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Teeth and Gums Care website"
      className={`fixed inset-0 z-[999999] grid place-items-center overflow-hidden bg-white transition duration-[420ms] ease-out ${
        isExiting
          ? "pointer-events-none scale-[1.015] opacity-0"
          : "scale-100 opacity-100"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_42%)]"
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl sm:h-96 sm:w-96"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        <div className="site-preloader-logo-wrap relative">
          <div
            aria-hidden="true"
            className="absolute inset-3 rounded-full bg-blue-500/15 blur-2xl"
          />

          <div className="relative grid h-32 w-32 place-items-center rounded-[34px] border border-blue-100/80 bg-white/95 p-4 shadow-[0_28px_90px_rgba(37,99,235,0.18)] backdrop-blur sm:h-36 sm:w-36">
            <Image
              src="/images/logo/logo.webp"
              alt="Teeth and Gums Care"
              width={150}
              height={150}
              priority
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="site-preloader-copy mt-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Teeth and Gums Care
          </h2>

          <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-blue-600 sm:text-sm">
            Advanced Dental Care · Jodhpur
          </p>
        </div>

        <div className="mt-8 w-full max-w-[240px]">
          <div
            aria-hidden="true"
            className="h-1.5 overflow-hidden rounded-full bg-blue-100"
          >
            <div className="site-preloader-progress h-full rounded-full bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-900" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Preparing your smile experience...
          </p>
        </div>

        <div
          aria-hidden="true"
          className="mt-8 flex items-center gap-2"
        >
          <span className="site-preloader-dot h-2 w-2 rounded-full bg-blue-700" />
          <span className="site-preloader-dot h-2 w-2 rounded-full bg-blue-500 [animation-delay:120ms]" />
          <span className="site-preloader-dot h-2 w-2 rounded-full bg-cyan-400 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
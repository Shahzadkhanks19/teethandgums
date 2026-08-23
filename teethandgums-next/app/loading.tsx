"use client";

import Image from "next/image";

import { FadeUp, Float, ScaleIn } from "@/components/animations";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading Teeth and Gums Care"
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-100/60 blur-3xl"
      />

      <FadeUp>
        <div className="relative flex flex-col items-center text-center">
          <Float>
            <ScaleIn>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl"
                />

                <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] bg-white shadow-[0_25px_80px_rgba(37,99,235,0.20)]">
                  <Image
                    src="/images/logo/logo.webp"
                    alt="Teeth and Gums Care"
                    width={90}
                    height={90}
                    sizes="90px"
                    className="h-auto w-[90px] object-contain"
                  />
                </div>
              </div>
            </ScaleIn>
          </Float>

          <h1 className="mt-8 text-3xl font-black text-slate-900">
            Teeth and Gums Care
          </h1>

          <p className="mt-3 text-slate-500">Preparing your smile...</p>

          <div
            aria-hidden="true"
            className="mt-10 h-2 w-72 max-w-[80vw] overflow-hidden rounded-full bg-blue-100"
          >
            <div className="loading-bar h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />
          </div>

          <span className="sr-only">The page is loading. Please wait.</span>
        </div>
      </FadeUp>
    </main>
  );
}
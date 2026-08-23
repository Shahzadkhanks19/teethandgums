"use client";

import Link from "next/link";
import { useEffect } from "react";

import { FadeUp, HoverButton, ScaleIn } from "@/components/animations";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50 px-4 py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-red-100/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center text-center">
        <FadeUp>
          <section
            aria-labelledby="error-page-title"
            className="overflow-hidden rounded-[40px] border border-blue-100 bg-white px-6 py-14 shadow-[0_30px_90px_rgba(37,99,235,0.14)] sm:px-10 lg:px-16"
          >
            <ScaleIn>
              <div
                aria-hidden="true"
                className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] bg-gradient-to-br from-red-500 to-red-700 text-4xl text-white shadow-xl shadow-red-100"
              >
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
            </ScaleIn>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-red-600">
              Something Went Wrong
            </p>

            <h1
              id="error-page-title"
              className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-900 md:text-6xl"
            >
              Oops! We couldn&apos;t load this page.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              Please try again. If the issue continues, contact Teeth and Gums
              Care for assistance.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <HoverButton>
                <button
                  type="button"
                  onClick={reset}
                  className="group inline-flex min-h-[56px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-4 font-black text-white shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Try Again
                  <i
                    aria-hidden="true"
                    className="fa-solid fa-rotate-right ml-3 transition-transform duration-300 group-hover:rotate-180"
                  />
                </button>
              </HoverButton>

              <HoverButton>
                <Link
                  href="/"
                  className="group inline-flex min-h-[56px] items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-8 py-4 font-black text-blue-700 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Go Home
                  <i
                    aria-hidden="true"
                    className="fa-solid fa-house ml-3 transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
              </HoverButton>
            </div>
          </section>
        </FadeUp>
      </div>
    </main>
  );
}

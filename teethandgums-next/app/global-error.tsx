"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Global application error:", error);
    }
  }, [error]);

  return (
    <html lang="en-IN">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-16 text-center">
          <section
            aria-labelledby="global-error-title"
            className="w-full max-w-3xl rounded-[36px] border border-blue-100 bg-white px-6 py-14 shadow-[0_30px_90px_rgba(37,99,235,0.14)] sm:px-10"
          >
            <div
              aria-hidden="true"
              className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-red-500 to-red-700 text-3xl text-white shadow-xl shadow-red-100"
            >
              !
            </div>

            <h1
              id="global-error-title"
              className="mt-8 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
            >
              Something went wrong.
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-500">
              The website could not be loaded correctly. Please try again.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex min-h-[56px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-4 font-black text-white shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Try Again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

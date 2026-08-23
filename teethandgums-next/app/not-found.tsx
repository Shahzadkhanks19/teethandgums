import type { Metadata } from "next";
import Link from "next/link";

import { FadeUp, HoverButton, ScaleIn } from "@/components/animations";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The requested page could not be found on the Teeth and Gums Care website.",
  robots: {
    index: false,
    follow: true,
  },
};

const helpfulLinks = [
  {
    label: "Services",
    href: "/services",
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
] as const;

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50 px-4 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center text-center">
        <FadeUp>
          <section
            aria-labelledby="not-found-title"
            className="overflow-hidden rounded-[40px] border border-blue-100 bg-white px-6 py-14 shadow-[0_30px_90px_rgba(37,99,235,0.14)] sm:px-10 lg:px-16"
          >
            <ScaleIn>
              <div
                aria-hidden="true"
                className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] bg-gradient-to-br from-blue-600 to-blue-900 text-4xl text-white shadow-xl shadow-blue-200"
              >
                <i className="fa-solid fa-tooth" />
              </div>
            </ScaleIn>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-blue-600">
              404 — Page Not Found
            </p>

            <h1
              id="not-found-title"
              className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-900 md:text-6xl"
            >
              Oops! This page seems to be missing.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              The page you are looking for may have been moved, deleted, or the
              address may be incorrect. Use one of the links below to continue.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <HoverButton>
                <Link
                  href="/"
                  aria-label="Return to the Teeth and Gums Care homepage"
                  className="group inline-flex min-h-[56px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-4 font-black text-white shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Go Home

                  <i
                    aria-hidden="true"
                    className="fa-solid fa-house ml-3 transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
              </HoverButton>

              <HoverButton>
                <Link
                  href="/book-appointment"
                  aria-label="Book a dental appointment"
                  className="group inline-flex min-h-[56px] items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-8 py-4 font-black text-blue-700 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Book Appointment

                  <i
                    aria-hidden="true"
                    className="fa-solid fa-calendar-check ml-3 transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
              </HoverButton>
            </div>

            <nav
              aria-label="Helpful pages"
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              {helpfulLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-blue-50 px-5 py-2 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition-colors duration-300 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </section>
        </FadeUp>
      </div>
    </main>
  );
}
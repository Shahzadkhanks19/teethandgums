import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faBolt,
  faChildReaching,
  faFaceSmile,
  faShieldHeart,
  faTooth,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

import GoogleReviewsSlider from "@/components/home/GoogleReviewsSlider";

const visitReasons = [
  {
    icon: faBolt,
    title: "Something hurts",
    text: "Toothache, sensitivity, swelling or a dental emergency.",
    href: "/services",
  },
  {
    icon: faFaceSmile,
    title: "I want a better smile",
    text: "Whitening, veneers, aligners and smile enhancement.",
    href: "/services",
  },
  {
    icon: faTooth,
    title: "I am missing a tooth",
    text: "Explore implant and tooth-replacement possibilities.",
    href: "/services",
  },
  {
    icon: faShieldHeart,
    title: "I need a check-up",
    text: "Preventive care, cleaning and routine oral-health reviews.",
    href: "/book-appointment",
  },
  {
    icon: faChildReaching,
    title: "Care for my family",
    text: "Comfortable dental visits for different ages and needs.",
    href: "/book-appointment",
  },
];

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
      {children}
    </span>
  );
}

export default function PremiumHomeSections() {
  return (
    <div className="bg-white text-slate-900">
      <section
        className="relative overflow-hidden border-b border-slate-100 py-20 sm:py-24 lg:py-28"
        aria-labelledby="reason-title"
      >
        <div
          className="pointer-events-none absolute -right-48 top-10 h-96 w-96 rounded-full bg-blue-50 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Label>Start with you</Label>
              <h2
                id="reason-title"
                className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl"
              >
                What brings you in today?
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-600 sm:text-lg">
                You do not need to know the name of a treatment. Start with what
                you are experiencing or what you want to change.
              </p>
              <Link
                href="/book-appointment"
                prefetch={false}
                className="mt-8 inline-flex items-center rounded-full bg-[#08376f] px-6 py-3.5 font-black text-white transition hover:bg-blue-700"
              >
                Talk to a dentist
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  aria-hidden="true"
                  className="ml-3"
                />
              </Link>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {visitReasons.map((reason, index) => (
                <Link
                  key={reason.title}
                  href={reason.href}
                  prefetch={false}
                  className="group grid gap-4 py-6 sm:grid-cols-[64px_1fr_44px] sm:items-center sm:py-7"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                    <FontAwesomeIcon icon={reason.icon} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[10px] font-black tracking-[0.18em] text-slate-400">
                        0{index + 1}
                      </span>
                      <h3 className="text-xl font-black text-[#08376f] sm:text-2xl">
                        {reason.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base">
                      {reason.text}
                    </p>
                  </div>
                  <span className="hidden h-11 w-11 place-items-center rounded-full border border-slate-200 text-blue-700 transition group-hover:translate-x-1 group-hover:bg-blue-50 sm:grid">
                    <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#071f3d] py-20 text-white sm:py-24 lg:py-28"
        aria-labelledby="inside-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <Label>Inside Teeth &amp; Gums Care</Label>
              <h2
                id="inside-title"
                className="mt-4 text-4xl font-black leading-[1.03] tracking-[-0.045em] sm:text-5xl lg:text-6xl"
              >
                A clinic you can feel confident walking into.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/70 sm:text-lg">
                Clean spaces, careful diagnosis and a team that explains before
                it treats.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-[28px] bg-white/5">
                <Image
                  src="/images/common/interior.webp"
                  alt="Interior of Teeth and Gums Care dental clinic"
                  fill
                  sizes="(max-width:1023px) 100vw,58vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-white/5">
                <Image
                  src="/images/common/about.webp"
                  alt="Teeth and Gums Care clinic exterior"
                  fill
                  sizes="(max-width:1023px) 50vw,29vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-white/5">
                <Image
                  src="/images/common/slider2.webp"
                  alt="Patient care at Teeth and Gums Care"
                  fill
                  sizes="(max-width:1023px) 50vw,29vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsSlider />
    </div>
  );
}

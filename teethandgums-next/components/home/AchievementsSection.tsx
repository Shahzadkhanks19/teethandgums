import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFaceSmile, faStar, faUserDoctor, faUsers } from "@fortawesome/free-solid-svg-icons";

import AchievementCard from "./AchievementCard";

import { FadeUp } from "@/components/animations";

/* ============================================
   TYPES
============================================ */

interface Achievement {
  icon: IconDefinition;
  number: number;
  suffix: string;
  title: string;
  text: string;
  decimals?: number;
}

/* ============================================
   DATA
============================================ */

const achievements: Achievement[] = [
  {
    icon: faUsers,
    number: 5000,
    suffix: "+",
    title: "Happy Patients",
    text: "Trusted by families across Jodhpur for compassionate dental care.",
  },
  {
    icon: faUserDoctor,
    number: 25,
    suffix: "+",
    title: "Years of Experience",
    text: "Experienced dental care backed by knowledge, precision, and trust.",
  },
  {
    icon: faFaceSmile,
    number: 1200,
    suffix: "+",
    title: "Smiles Transformed",
    text: "Healthier, more confident smiles through personalized treatment.",
  },
  {
    icon: faStar,
    number: 4.9,
    suffix: "/5",
    decimals: 1,
    title: "Patient Rating",
    text: "Highly rated for comfortable treatment and patient-focused care.",
  },
];

/* ============================================
   COMPONENT
============================================ */

export default function AchievementsSection() {
  return (
    <section
      aria-labelledby="achievements-section-title"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[44px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 px-5 py-16 shadow-[0_28px_80px_rgba(37,99,235,0.10)] sm:px-8 lg:px-12 lg:py-20">
          {/* Section heading */}
          <FadeUp>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold text-blue-600 ring-1 ring-blue-200/60">
                Trusted Dental Care
              </span>

              <h2
                id="achievements-section-title"
                className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
              >
                Achievements At A Glance
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                Building healthy smiles and lasting relationships through
                modern, ethical, and patient-first dental care.
              </p>
            </div>
          </FadeUp>

          {/* Achievement cards */}
          <div className="mt-14 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((item, index) => (
              <AchievementCard
                key={item.title}
                index={index}
                icon={item.icon}
                number={item.number}
                suffix={item.suffix}
                decimals={item.decimals}
                title={item.title}
                text={item.text}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
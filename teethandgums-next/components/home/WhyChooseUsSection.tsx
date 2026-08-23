import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faHeartCircleCheck, faMicroscope, faShieldHeart, faUserDoctor } from "@fortawesome/free-solid-svg-icons";

import { FadeUp, HoverCard, StaggerContainer, StaggerItem } from "@/components/animations";

interface WhyChooseItem {
  icon: IconDefinition;
  title: string;
  text: string;
}

const whyChooseUs: WhyChooseItem[] = [
  {
    icon: faUserDoctor,
    title: "Experienced Dentists",
    text: "Skilled dental professionals providing personalized treatment plans for every patient.",
  },
  {
    icon: faMicroscope,
    title: "Modern Technology",
    text: "Advanced equipment for accurate diagnosis, precise treatment, and a more comfortable experience.",
  },
  {
    icon: faHeartCircleCheck,
    title: "Patient-Centered Care",
    text: "Gentle treatment, clear communication, and a calm environment designed around your comfort.",
  },
  {
    icon: faShieldHeart,
    title: "Complete Dental Care",
    text: "From preventive checkups to advanced treatments and smile makeovers, all your dental needs are covered.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section aria-labelledby="why-choose-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-28 top-20 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1380px] grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 xl:gap-20">
        <FadeUp>
          <div>
            <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-blue-700 shadow-sm">Why Choose Us</span>
            <h2 id="why-choose-title" className="mt-6 text-4xl font-black leading-[1.04] tracking-[-0.045em] text-[#08376f] md:text-5xl xl:text-[58px]">
              Advanced Care.
              <span className="block text-blue-600">A Better Dental Experience.</span>
            </h2>
            <p className="mt-6 max-w-[540px] text-lg leading-8 text-slate-500">
              Clinical expertise, modern technology, and thoughtful care come together to make every visit clearer, calmer, and more comfortable.
            </p>

            <div className="mt-9 rounded-[28px] border border-blue-100 bg-white p-6 shadow-[0_18px_50px_rgba(8,55,111,0.08)]">
              <div className="text-4xl font-black tracking-[-0.04em] text-[#08376f]">Patient-first</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">A treatment philosophy built around communication, safety, precision, and long-term outcomes.</p>
            </div>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {whyChooseUs.map((item, index) => (
            <StaggerItem key={item.title} className="h-full">
              <HoverCard className="h-full">
                <article className={`group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[30px] border p-7 transition-all duration-300 hover:-translate-y-1 sm:p-8 ${index === 0 ? "border-[#08376f] bg-gradient-to-br from-[#08376f] to-[#0b3c91] text-white shadow-[0_24px_60px_rgba(8,55,111,0.22)]" : "border-blue-100 bg-white text-[#08376f] shadow-[0_18px_50px_rgba(8,55,111,0.08)] hover:border-blue-200 hover:shadow-[0_26px_65px_rgba(37,99,235,0.13)]"}`}>
                  <span className={`absolute right-5 top-3 text-6xl font-black ${index === 0 ? "text-white/[0.06]" : "text-blue-50"}`}>0{index + 1}</span>

                  <div className={`relative z-10 grid h-14 w-14 place-items-center rounded-2xl text-xl transition group-hover:-rotate-3 group-hover:scale-105 ${index === 0 ? "bg-white/10 text-blue-100 ring-1 ring-white/10" : "bg-blue-50 text-blue-700"}`}>
                    <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                  </div>

                  <h3 className="relative z-10 mt-7 text-2xl font-black">{item.title}</h3>
                  <p className={`relative z-10 mt-3 flex-1 text-sm leading-7 ${index === 0 ? "text-blue-50/75" : "text-slate-500"}`}>{item.text}</p>

                  <div className={`relative z-10 mt-6 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20 ${index === 0 ? "bg-blue-200" : "bg-blue-600"}`} />
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

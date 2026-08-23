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
    <section
      aria-labelledby="why-choose-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] py-20 lg:py-28"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm">Why Choose Us</span>
            <h2 id="why-choose-title" className="mt-5 text-4xl font-black leading-tight tracking-[-0.035em] text-[#08376f] md:text-5xl">
              Advanced Care. <span className="text-blue-600">Exceptional Experience.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
              Clinical expertise, modern technology, and compassionate care come together in every visit.
            </p>
          </div>
        </FadeUp>

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, index) => (
            <StaggerItem key={item.title} className="h-full">
              <HoverCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-blue-100 bg-white p-7 shadow-[0_16px_45px_rgba(8,55,111,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_25px_65px_rgba(37,99,235,0.13)]">
                  <span className="absolute right-5 top-4 text-5xl font-black text-blue-50">0{index + 1}</span>
                  <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-[#0b3c91] text-xl text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] transition group-hover:-rotate-3 group-hover:scale-105">
                    <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                  </div>
                  <h3 className="relative z-10 mt-6 text-xl font-black text-[#08376f]">{item.title}</h3>
                  <p className="relative z-10 mt-3 flex-1 text-sm leading-7 text-slate-500">{item.text}</p>
                  <div className="relative z-10 mt-6 h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

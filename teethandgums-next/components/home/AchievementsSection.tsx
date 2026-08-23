import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faStar, faUserDoctor, faUsers } from "@fortawesome/free-solid-svg-icons";

import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animations";

interface Achievement {
  icon: IconDefinition;
  number: string;
  title: string;
  text: string;
}

const achievements: Achievement[] = [
  {
    icon: faUsers,
    number: "5000+",
    title: "Happy Patients",
    text: "Trusted by families across Jodhpur.",
  },
  {
    icon: faUserDoctor,
    number: "25+",
    title: "Years of Experience",
    text: "Knowledge, precision, and ethical care.",
  },
  {
    icon: faFaceSmile,
    number: "1200+",
    title: "Smiles Transformed",
    text: "Personalized treatment for confident smiles.",
  },
  {
    icon: faStar,
    number: "4.9/5",
    title: "Patient Rating",
    text: "Highly rated for comfort and quality care.",
  },
];

export default function AchievementsSection() {
  return (
    <section
      aria-labelledby="achievements-section-title"
      className="relative overflow-hidden bg-white py-6 lg:py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#08376f] via-[#0b3c91] to-blue-700 px-5 py-8 shadow-[0_22px_55px_rgba(8,55,111,0.20)] sm:px-8 lg:px-10">
            <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[38px] border-white/5" />
            <div aria-hidden="true" className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />

            <div className="relative z-10 mb-7 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-200">Trusted Dental Care</p>
              <h2 id="achievements-section-title" className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Building Trust, One Smile at a Time
              </h2>
            </div>

            <StaggerContainer className="relative z-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {achievements.map((item, index) => (
                <StaggerItem key={item.title}>
                  <article className={`group h-full rounded-2xl border border-white/10 bg-white/[0.07] p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.11] ${index < achievements.length - 1 ? "lg:border-r-white/20" : ""}`}>
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-xl text-blue-200 transition group-hover:bg-white group-hover:text-blue-700">
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </div>
                    <div className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{item.number}</div>
                    <h3 className="mt-1 text-sm font-extrabold text-white">{item.title}</h3>
                    <p className="mt-2 hidden text-xs leading-5 text-blue-100/80 sm:block">{item.text}</p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

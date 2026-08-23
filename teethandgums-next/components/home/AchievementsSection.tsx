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
    text: "Families who trust us with their smiles.",
  },
  {
    icon: faUserDoctor,
    number: "25+",
    title: "Years of Experience",
    text: "Clinical expertise built over decades.",
  },
  {
    icon: faFaceSmile,
    number: "1200+",
    title: "Smiles Transformed",
    text: "Personalised treatment with lasting impact.",
  },
  {
    icon: faStar,
    number: "4.9/5",
    title: "Patient Rating",
    text: "Consistently appreciated for quality care.",
  },
];

export default function AchievementsSection() {
  return (
    <section aria-labelledby="achievements-section-title" className="relative overflow-hidden bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#062d5c] via-[#08376f] to-[#0b3c91] px-5 py-8 shadow-[0_28px_70px_rgba(8,55,111,0.22)] sm:px-8 lg:px-10 lg:py-10">
            <div aria-hidden="true" className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[46px] border-white/5" />
            <div aria-hidden="true" className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

            <div className="relative z-10 grid items-center gap-7 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="max-w-md">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200">Trusted Dental Care</p>
                <h2 id="achievements-section-title" className="mt-3 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                  Confidence Built One Smile at a Time
                </h2>
                <p className="mt-3 text-sm leading-6 text-blue-100/75">Real experience, meaningful outcomes, and patient relationships that last.</p>
              </div>

              <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {achievements.map((item) => (
                  <StaggerItem key={item.title}>
                    <article className="group h-full rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.12] sm:p-5">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-lg text-blue-200 transition group-hover:bg-white group-hover:text-blue-700">
                        <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                      </div>
                      <div className="mt-4 text-3xl font-black tracking-[-0.04em] text-white sm:text-[34px]">{item.number}</div>
                      <h3 className="mt-1 text-sm font-black text-white">{item.title}</h3>
                      <p className="mt-2 hidden text-xs leading-5 text-blue-100/70 md:block">{item.text}</p>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

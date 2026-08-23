import dynamic from "next/dynamic";

import { createMetadata } from "@/lib/seo";

import AboutSection from "@/components/home/AboutSection";
import AchievementsSection from "@/components/home/AchievementsSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProcessSection from "@/components/home/ProcessSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import DoctorPreviewSection from "@/components/home/DoctorPreviewSection";
import CTASection from "@/components/home/CTASection";
import EmergencySection from "@/components/home/EmergencySection";
import HeroSection from "@/components/home/HeroSection";

const FAQSection = dynamic(() => import("@/components/home/FAQSection"));

const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection"),
);

export const metadata = createMetadata({
  title: "Best Dental Clinic in Jodhpur",
  description:
    "Visit Teeth and Gums Care, a trusted dental clinic in Jodhpur for dental implants, root canal treatment, smile designing, braces, veneers, teeth whitening and complete family dental care.",
  canonical: "/",
  image: "/images/og/home.jpeg",
  imageAlt: "Teeth and Gums Care dental clinic in Jodhpur",
  keywords: [
    "Best Dental Clinic in Jodhpur",
    "Best Dentist in Jodhpur",
    "Dentist in Jodhpur",
    "Dental Clinic in Jodhpur",
    "Dentist in Shastri Nagar Jodhpur",
    "Dental Implants Jodhpur",
    "Root Canal Treatment Jodhpur",
    "Smile Designing Jodhpur",
    "Cosmetic Dentistry Jodhpur",
    "Dental Veneers Jodhpur",
    "Teeth Whitening Jodhpur",
    "Braces Treatment Jodhpur",
    "Orthodontic Treatment Jodhpur",
    "Emergency Dentist Jodhpur",
    "Family Dentist Jodhpur",
    "Teeth and Gums Care",
  ],
});

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[99999] focus:rounded-xl focus:bg-blue-600 focus:px-5 focus:py-3 focus:font-bold focus:text-white"
      >
        Skip to Main Content
      </a>

      <main id="main-content" tabIndex={-1} className="overflow-x-hidden outline-none">
        <HeroSection />

        <AboutSection />

        <AchievementsSection />

        <ServicesSection />

        <ProcessSection />

        <WhyChooseUsSection />

        <DoctorPreviewSection />

        <FAQSection />

        <TestimonialsSection />

        <CTASection />

        <EmergencySection />
      </main>
    </>
  );
}
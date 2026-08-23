import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBullseye,
  faCalendarCheck,
  faCircleCheck,
  faComments,
  faEye,
  faHandHoldingHeart,
  faHeart,
  faHeartCircleCheck,
  faMicroscope,
  faPhone,
  faShieldHeart,
  faStar,
  faTooth,
  faUserDoctor,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import { createMetadata } from "@/lib/seo";
import AboutCounterCard from "@/components/about/AboutCounterCard";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  HoverImage,
  RotateIn,
  SlideLeft,
  SlideRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";


const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata = createMetadata({
  title: "About Our Dental Clinic in Jodhpur",
  description:
    "Learn about Teeth and Gums Care, our experienced dentists, advanced dental technology, patient-first approach, and modern dental clinic in Jodhpur, Rajasthan.",
  canonical: "/about",
  image: "/images/og/about.jpeg",
  imageAlt: "About Teeth and Gums Care Dental Clinic in Jodhpur",
  keywords: [
    "About Teeth and Gums Care",
    "About Dental Clinic in Jodhpur",
    "Best Dentist in Jodhpur",
    "Experienced Dentist in Jodhpur",
    "Dental Clinic in Shastri Nagar",
    "Modern Dental Clinic Jodhpur",
    "Dental Experts Jodhpur",
    "Patient Centric Dental Care",
    "Dental Technology Jodhpur",
    "Family Dentist Jodhpur",
    "Cosmetic Dentist Jodhpur",
    "Teeth and Gums Care",
  ],
});
const heroTrustPoints = [
  "Modern Dentistry",
  "Gentle Care",
  "Trusted Experts",
];

const storyPoints = [
  "Modern Dental Technology",
  "Gentle & Comfortable Care",
  "Personalized Treatment Plans",
];

const values: Array<{ icon: IconDefinition; title: string; text: string }> = [
  {
    icon: faHandHoldingHeart,
    title: "Compassion",
    text: "We treat every patient with care, respect, and empathy.",
  },
  {
    icon: faShieldHeart,
    title: "Safety",
    text: "Clean, hygienic, and comfortable treatment environment.",
  },
  {
    icon: faComments,
    title: "Transparency",
    text: "Clear explanation of treatment options and procedures.",
  },
  {
    icon: faMicroscope,
    title: "Precision",
    text: "Modern methods for accurate and reliable dental care.",
  },
];

const chooseItems: Array<{ icon: IconDefinition; title: string; text: string }> = [
  {
    icon: faUserDoctor,
    title: "Experienced Dentists",
    text: "Skilled professionals focused on personalized care.",
  },
  {
    icon: faTooth,
    title: "Advanced Technology",
    text: "Modern tools for precise and comfortable treatments.",
  },
  {
    icon: faHeartCircleCheck,
    title: "Patient-Centered Care",
    text: "Gentle approach with clear communication.",
  },
  {
    icon: faShieldHeart,
    title: "Comfortable Treatment",
    text: "Stress-free experience with modern techniques.",
  },
];

const clinicGallery = [
  {
    title: "Modern Clinic Setup",
    image: "/images/common/about.webp",
  },
  {
    title: "Treatment Area",
    image: "/images/common/slider1.webp",
  },
  {
    title: "Patient Care",
    image: "/images/common/slider2.webp",
  },
  {
    title: "Comfortable Environment",
    image: "/images/common/slider3.webp",
  },
];

export default function AboutPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Teeth and Gums Care",
    description:
      "Learn about Teeth and Gums Care, our dentists, values, modern dental technology, and patient-first approach in Jodhpur.",
    url: `${siteUrl}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: "Teeth and Gums Care",
      url: siteUrl,
    },
    about: {
      "@type": "Dentist",
      name: "Teeth and Gums Care",
      url: siteUrl,
      telephone: "+919829824356",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute",
        addressLocality: "Jodhpur",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteUrl}/about`,
      },
    ],
  };

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="overflow-x-hidden outline-none"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(aboutPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />
      <section aria-labelledby="about-page-title" className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-5 py-28 text-center text-white lg:py-36">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_35%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-white/10 blur-2xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto max-w-5xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/15 px-6 py-3 font-extrabold backdrop-blur">
              Teeth and Gums Care
            </span>

            <h1 id="about-page-title" className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              About Teeth and Gums Care
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
              Dedicated to creating healthy smiles through compassionate,
              advanced, and patient-focused dental care.
            </p>

            <StaggerContainer className="mt-9 flex flex-wrap justify-center gap-4">
              {heroTrustPoints.map((item) => (
                <StaggerItem key={item}>
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/15 px-5 py-3 font-bold backdrop-blur transition hover:-translate-y-1 hover:bg-white/25">
                    <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2 text-blue-200" />
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
        </div>
      </section>

      <section aria-labelledby="about-story-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-blue-50 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 xl:gap-20">
          <SlideRight>
            <HoverImage>
              <div className="relative">
                <div className="overflow-hidden rounded-[36px] bg-white p-2 shadow-[0_30px_80px_rgba(37,99,235,.12)]">
                  <Image
                    src="/images/common/about.webp"
                    alt="Modern clinic environment at Teeth and Gums Care"
                    width={700}
                    height={700}
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 50vw"
                    quality={75}
                    className="h-auto min-h-[420px] w-full rounded-[30px] object-cover max-sm:min-h-[320px]"
                  />
                </div>

                <div className="mt-5 rounded-[28px] bg-gradient-to-br from-blue-600 to-blue-900 px-7 py-6 text-center text-white shadow-[0_20px_45px_rgba(37,99,235,.28)] lg:absolute lg:-right-6 lg:bottom-8 lg:mt-0 lg:min-w-[210px]">
                  <h3 className="text-4xl font-black leading-none">25+</h3>
                  <p className="mt-2 text-sm font-semibold text-white/90">
                    Years of Trusted Dental Care
                  </p>
                </div>
              </div>
            </HoverImage>
          </SlideRight>

          <SlideLeft>
            <div className="lg:pl-4">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold uppercase text-blue-600 ring-1 ring-blue-200/60">
                Our Story
              </span>

              <h2 className="mt-5 max-w-[620px] text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                Committed To Your Smile & Oral Health
              </h2>

              <p className="mt-6 max-w-[610px] leading-8 text-slate-500">
                At Teeth and Gums Care, we are committed to providing advanced,
                compassionate, and personalized dental care for patients of all
                ages.
              </p>

              <p className="mt-4 max-w-[610px] leading-8 text-slate-500">
                We combine modern dental technology, evidence-based treatment
                methods, and patient-focused care to deliver comfortable,
                effective, and long-lasting oral healthcare solutions.
              </p>

              <HoverCard>
                <aside className="mt-8 flex gap-5 rounded-[28px] border border-blue-100 border-l-4 border-l-blue-600 bg-white p-6 shadow-[0_18px_50px_rgba(37,99,235,.10)]">
                  <div
                    aria-hidden="true"
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-xl text-white shadow-lg shadow-blue-100"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faTooth} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Patient-First Dental Experience
                    </h3>

                    <p className="mt-2 leading-7 text-slate-500">
                      Our goal is not only to treat dental problems but to help
                      every patient maintain a healthy smile and lifelong
                      confidence.
                    </p>
                  </div>
                </aside>
              </HoverCard>

              <StaggerContainer className="mt-8 grid gap-4">
                {storyPoints.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white/80 p-4 font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-white">
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm text-white"
                      >
                        ✓
                      </span>
                      {item}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SlideLeft>
        </div>
      </section>
            <section aria-labelledby="about-doctors-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold uppercase text-blue-600 ring-1 ring-blue-200/60">
                Our Dental Experts
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                Meet Our Doctors
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                Our experienced dental professionals are committed to providing
                compassionate, personalized, and advanced dental care for every
                patient.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid gap-8">
            <StaggerItem>
              <DoctorCard
                image="/images/common/sunita.webp"
                name="Dr. Sunita Khetani"
                label="Dental Surgeon"
                qualification="BDS • Cosmetic Dentistry • Preventive Dentistry"
                text="Dr. Sunita Khetani is passionate about preventive, restorative, and cosmetic dentistry. Her patient-first approach focuses on delivering comfortable treatments while helping patients achieve long-term oral health and beautiful smiles."
                specialties={["Smile Makeover", "Root Canal", "Cosmetic Care"]}
                facebook="https://www.facebook.com/sunita.khetani"
                instagram="https://www.instagram.com/sunitakhetani/?utm_source=ig_web_button_share_sheet"
              />
            </StaggerItem>

            <StaggerItem>
              <DoctorCard
                image="/images/common/vishal.webp"
                name="Dr. Vishal Khetani"
                label="Periodontist & Implantologist"
                qualification="MDS • Periodontics • Dental Implants"
                text="Dr. Vishal Khetani specializes in advanced gum care, periodontics, dental implants, preventive dentistry, and comprehensive oral healthcare with precise, evidence-based treatments."
                specialties={["Dental Implants", "Gum Surgery", "Periodontics"]}
                facebook="https://www.facebook.com/vishal.khetani.3"
                instagram="https://www.instagram.com/the.vishal?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section aria-labelledby="about-purpose-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold uppercase text-blue-600 ring-1 ring-blue-200/60">
                Our Purpose
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                Mission & Vision
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                We believe dental care should be comfortable, transparent, and
                focused on long-term oral wellness.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid items-stretch gap-7 md:grid-cols-2">
            <StaggerItem>
              <MissionCard
                icon={faBullseye}
                title="Our Mission"
                text="To provide high-quality dental care with compassion, integrity, and excellence while ensuring every patient feels comfortable and confident."
                points={[
                  "Gentle treatment approach",
                  "Honest guidance",
                  "Long-term oral health focus",
                ]}
              />
            </StaggerItem>

            <StaggerItem>
              <MissionCard
                icon={faEye}
                title="Our Vision"
                text="To become the most trusted dental care destination by delivering advanced treatments and outstanding patient experiences."
                points={[
                  "Modern dental solutions",
                  "Patient-first experience",
                  "Trusted family dental care",
                ]}
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section aria-labelledby="about-values-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-2xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 xl:gap-20">
          <FadeUp>
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/15 px-5 py-2 text-sm font-extrabold uppercase backdrop-blur">
                Our Values
              </span>

              <h2 className="mt-5 max-w-[620px] text-4xl font-black leading-tight md:text-5xl">
                What Makes Our Care Different?
              </h2>

              <p className="mt-6 max-w-[600px] leading-8 text-white/90">
                Every treatment at Teeth and Gums Care is guided by trust,
                comfort, clarity, and clinical excellence.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid items-stretch gap-5 sm:grid-cols-2">
            {values.map((item) => (
              <StaggerItem key={item.title}>
                <HoverCard className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/20 bg-white/15 p-7 backdrop-blur transition duration-300 hover:bg-white/25">
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-white to-blue-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <RotateIn>
                      <div
                        aria-hidden="true"
                        className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl text-blue-600 shadow-lg shadow-blue-950/10 transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                      >
                        <FontAwesomeIcon icon={item.icon} />
                      </div>
                    </RotateIn>

                    <h3 className="font-black">{item.title}</h3>
                    <p className="mt-3 flex-1 leading-7 text-white/85">
                      {item.text}
                    </p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
            <section aria-labelledby="about-why-choose-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-white to-blue-50 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold uppercase text-blue-600 ring-1 ring-blue-200/60">
                Why Choose Us
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                Dental Care Designed Around You
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                From consultation to treatment, we focus on your comfort, safety,
                and smile confidence.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {chooseItems.map((item) => (
              <StaggerItem key={item.title}>
                <HoverCard className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)]">
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <RotateIn>
                      <div
                        aria-hidden="true"
                        className="mx-auto mb-6 grid h-[76px] w-[76px] place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
                      >
                        <FontAwesomeIcon icon={item.icon} />
                      </div>
                    </RotateIn>

                    <h3 className="font-black text-slate-900">{item.title}</h3>

                    <p className="mt-3 flex-1 leading-7 text-slate-500">
                      {item.text}
                    </p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section aria-labelledby="about-stats-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 py-20 text-white lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 -top-48 h-[450px] w-[450px] rounded-full bg-white/10 blur-2xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-44 -left-32 h-[350px] w-[350px] rounded-full bg-white/10 blur-2xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-white/15 bg-white/15 px-5 py-2 font-black backdrop-blur">
                Clinic At A Glance
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                Teeth and Gums Care At A Glance
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/90">
                Building trust through quality dental care and patient
                satisfaction.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AboutCounterCard
              index={0}
              icon={faUsers}
              end={1500}
              suffix="+"
              title="Happy Patients"
            />

            <AboutCounterCard
              index={1}
              icon={faUserDoctor}
              end={2}
              suffix="+"
              title="Expert Dentists"
            />

            <AboutCounterCard
              index={2}
              icon={faStar}
              end={4.9}
              suffix="/5"
              decimals={1}
              title="Google Rating"
            />

            <AboutCounterCard
              index={3}
              icon={faHeart}
              end={100}
              suffix="%"
              title="Patient Satisfaction"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="about-gallery-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-white to-blue-50 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-extrabold uppercase text-blue-600 ring-1 ring-blue-200/60">
                Clinic Gallery
              </span>

              <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                Inside Our Clinic
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                A glimpse of our clean, comfortable, and patient-friendly dental
                clinic environment.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="grid auto-rows-[230px] grid-cols-1 gap-6 md:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-[1.2fr_1fr_1fr]">
            {clinicGallery.map((item, index) => (
              <StaggerItem
                key={item.title}
                className={`${index === 0 ? "lg:row-span-2" : ""} ${
                  index === 3 ? "md:col-span-2" : ""
                }`}
              >
                <HoverImage className="h-full">
                  <figure className="group relative h-full overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(37,99,235,.10)]">
                    <Image
                      src={item.image}
                      alt={`${item.title} at Teeth and Gums Care Dental Clinic in Jodhpur`}
                      fill
                      sizes="(max-width: 768px) calc(100vw - 32px), 33vw"
                      quality={75}
                      className="object-cover"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

                    <figcaption className="absolute bottom-5 left-5 rounded-full bg-white/95 px-5 py-3 font-black text-blue-900 shadow-lg backdrop-blur">
                      {item.title}
                    </figcaption>
                  </figure>
                </HoverImage>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
            <section aria-labelledby="about-cta-title" className="[content-visibility:auto] [contain-intrinsic-size:900px] relative scroll-mt-24 overflow-hidden bg-blue-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="relative overflow-hidden rounded-[38px] bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 p-8 text-center text-white shadow-[0_30px_90px_rgba(37,99,235,.18)] lg:p-14 lg:text-left">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl"
              />

              <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
                <div>
                  <span className="inline-flex rounded-full border border-white/15 bg-white/15 px-5 py-2 font-black backdrop-blur">
                    Book Your Visit Today
                  </span>

                  <h2 className="mt-5 text-4xl font-black leading-tight">
                    Ready To Transform Your Smile?
                  </h2>

                  <p className="mt-4 max-w-2xl leading-8 text-white/90">
                    Schedule your consultation today and take the first step
                    towards healthier teeth and gums.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:justify-end">
                  <HoverButton>
                    <Link prefetch={false}
                      href="/book-appointment"
                      aria-label="Book a dental appointment"
                      className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-white px-8 py-4 font-black text-blue-600 shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-2" />
                      Book Appointment
                    </Link>
                  </HoverButton>

                  <HoverButton>
                    <a
                      href="tel:+919829824356"
                      itemProp="telephone"
                      aria-label="Call Teeth and Gums Care"
                      className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-white/40 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="mr-2" />
                      Call Clinic
                    </a>
                  </HoverButton>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}

type DoctorCardProps = {
  image: string;
  name: string;
  label: string;
  qualification: string;
  text: string;
  specialties: string[];
  facebook?: string;
  instagram?: string;
};

function DoctorCard({
  image,
  name,
  label,
  qualification,
  text,
  specialties,
  facebook,
  instagram,
}: DoctorCardProps) {
  return (
    <HoverCard>
      <article className="group grid overflow-hidden rounded-[34px] border border-blue-100 bg-white shadow-[0_24px_70px_rgba(37,99,235,.12)] transition duration-300 hover:border-blue-200 hover:shadow-[0_32px_90px_rgba(37,99,235,.18)] lg:grid-cols-[38%_62%]">
        <HoverImage>
          <figure className="relative min-h-[340px] overflow-hidden lg:min-h-[430px]">
            <Image
              src={image}
              alt={`${name}, ${label} at Teeth and Gums Care Dental Clinic in Jodhpur`}
              fill
              sizes="(max-width: 1024px) calc(100vw - 32px), 38vw"
              quality={75}
              className="object-cover object-top"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

            <figcaption className="absolute bottom-5 left-5 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 px-5 py-3 font-black text-white shadow-lg">
              Experienced Dental Care
            </figcaption>
          </figure>
        </HoverImage>

        <div className="flex flex-col p-7 lg:p-10">
          <span className="inline-flex self-start rounded-full bg-blue-100 px-4 py-2 font-black text-blue-600 ring-1 ring-blue-200/60">
            {label}
          </span>

          <h3 className="mt-4 text-3xl font-black leading-tight text-slate-900">
            {name}
          </h3>

          <p className="mt-3 font-extrabold leading-7 text-slate-700">
            {qualification}
          </p>

          <p className="mt-5 flex-1 leading-8 text-slate-500">{text}</p>

          <StaggerContainer className="mt-6 flex flex-wrap gap-3">
            {specialties.map((item) => (
              <StaggerItem key={item}>
                <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-100">
                  {item}
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-3">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${name}'s Facebook profile`}
                  className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-blue-600 transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faFacebookF} />
                </a>
              )}

              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${name}'s Instagram profile`}
                  className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-pink-600 transition hover:-translate-y-1 hover:bg-pink-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faInstagram} />
                </a>
              )}
            </div>

            <HoverButton>
              <Link prefetch={false}
                href="/book-appointment"
                aria-label={`Book appointment with ${name}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 px-6 py-3 text-center font-black text-white shadow-[0_14px_32px_rgba(37,99,235,.22)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-2" />
                Book Appointment
              </Link>
            </HoverButton>
          </div>
        </div>
      </article>
    </HoverCard>
  );
}

type MissionCardProps = {
  icon: IconDefinition;
  title: string;
  text: string;
  points: string[];
};

function MissionCard({ icon, title, text, points }: MissionCardProps) {
  return (
    <HoverCard className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white p-8 shadow-[0_18px_50px_rgba(37,99,235,.10)] transition duration-300 hover:border-blue-200 hover:shadow-[0_28px_80px_rgba(37,99,235,.16)] lg:p-10">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <RotateIn>
          <div
            aria-hidden="true"
            className="mb-6 grid h-[78px] w-[78px] place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-2xl"
          >
            <FontAwesomeIcon icon={icon} />
          </div>
        </RotateIn>

        <h3 className="text-3xl font-black text-slate-900">{title}</h3>

        <p className="mt-4 flex-1 leading-8 text-slate-500">{text}</p>

        <StaggerContainer className="mt-6 grid gap-3">
          {points.map((point, index) => (
            <StaggerItem key={point}>
              <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 font-extrabold text-slate-700 transition hover:border-blue-300 hover:bg-white">
                <RotateIn delay={index * 0.05}>
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm text-white"
                  >
                    ✓
                  </span>
                </RotateIn>

                {point}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </article>
    </HoverCard>
  );
}
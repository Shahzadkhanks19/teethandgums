import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCalendarCheck,
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
  faTooth,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faGoogle,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";

import { servicesData } from "@/data/services";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const featuredTreatments = servicesData.slice(0, 6);

const socials = [
  {
    href: "https://www.facebook.com/profile.php?id=61590941001711",
    label: "Facebook",
    icon: faFacebookF,
  },
  {
    href: "https://www.instagram.com/teethandgumscare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://wa.me/919829824356",
    label: "WhatsApp",
    icon: faWhatsapp,
  },
  {
    href: "https://share.google/X1DeFzBmXM8WkGAuc",
    label: "Google",
    icon: faGoogle,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#061a33] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-24 h-[420px] w-[420px] rounded-full border-[70px] border-blue-400/[0.04]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/[0.07] blur-3xl"
      />

      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-blue-300/20 bg-blue-400/10">
                  <FontAwesomeIcon icon={faTooth} aria-hidden="true" />
                </span>
                Your next dental visit
              </div>
              <h2 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-[62px]">
                Better care starts with a conversation,
                <span className="block text-blue-300">not a procedure.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/65 sm:text-lg">
                Tell us what is bothering you. We will help you understand the
                next step clearly and comfortably.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                prefetch={false}
                href="/book-appointment"
                className="group inline-flex min-h-14 items-center justify-center rounded-full bg-white px-6 font-black text-[#08376f] transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  aria-hidden="true"
                  className="mr-2 text-blue-600"
                />
                Book Appointment
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  aria-hidden="true"
                  className="ml-3 transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href="tel:+919829824356"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 font-black text-white transition hover:bg-white/10"
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  aria-hidden="true"
                  className="mr-2 text-blue-300"
                />
                +91 98298 24356
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.7fr_0.95fr_1.15fr] lg:gap-10 lg:py-16">
          <div>
            <Link
              prefetch={false}
              href="/"
              className="inline-flex items-center gap-4"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
                <Image
                  src="/images/logo/logo.webp"
                  alt="Teeth and Gums Care"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span>
                <span className="block text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                  Teeth and Gums Care
                </span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                  Advanced Dental Care · Jodhpur
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-md text-[15px] leading-8 text-blue-100/60">
              Thoughtful dentistry built around clear diagnosis, ethical
              treatment planning, patient comfort and long-term oral health.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-blue-100 transition hover:-translate-y-1 hover:border-blue-300/40 hover:bg-blue-500 hover:text-white"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
              Explore
            </p>
            <ul className="mt-6 space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    prefetch={false}
                    href={link.href}
                    className="group inline-flex items-center font-bold text-blue-50/70 transition hover:text-white"
                  >
                    <span className="mr-0 h-px w-0 bg-blue-300 transition-all group-hover:mr-2 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                Treatments
              </p>
              <Link
                href="/services"
                prefetch={false}
                className="text-xs font-bold text-blue-100/55 transition hover:text-white"
              >
                View all
              </Link>
            </div>
            <ul className="mt-6 space-y-3.5">
              {featuredTreatments.map((service) => (
                <li key={service.slug}>
                  <Link
                    prefetch={false}
                    href={`/services/${service.slug}`}
                    className="group inline-flex items-center font-bold leading-6 text-blue-50/70 transition hover:text-white"
                  >
                    <span className="mr-0 h-px w-0 bg-blue-300 transition-all group-hover:mr-2 group-hover:w-4" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
              Visit the clinic
            </p>

            <div className="mt-6 flex items-start gap-3">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
              </span>
              <p itemProp="address" className="text-sm leading-7 text-blue-50/75">
                E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG
                Institute, Jodhpur, Rajasthan
              </p>
            </div>

            <div className="mt-5 border-t border-white/10 pt-5">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <FontAwesomeIcon
                  icon={faClock}
                  aria-hidden="true"
                  className="text-blue-300"
                />
                Clinic Hours
              </div>
              <div className="mt-3 space-y-3 text-sm text-blue-100/65">
                <div className="flex justify-between gap-4">
                  <span>Mon - Sat</span>
                  <strong className="text-right font-bold text-white">
                    10:00 AM - 3:00 PM
                    <br />
                    5:30 PM - 8:30 PM
                  </strong>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <span>Sunday</span>
                  <strong className="text-right font-bold text-white">
                    10:00 AM - 3:00 PM
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-white/10 py-7 text-sm text-blue-100/50 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <p>© {currentYear} Teeth and Gums Care. All rights reserved.</p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
            <a
              href="mailto:sunitakhetani@gmail.com"
              itemProp="email"
              className="inline-flex items-center transition hover:text-white"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                aria-hidden="true"
                className="mr-2 text-blue-300"
              />
              sunitakhetani@gmail.com
            </a>
          </div>

          <p className="md:text-right">
            Designed &amp; Developed by{" "}
            <a
              href="https://wa.me/917014854192"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-blue-300 transition hover:text-white"
            >
              Shahzad Khan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

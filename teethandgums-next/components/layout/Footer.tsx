import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const services = [
  "Root Canal Treatment",
  "Dental Implants",
  "Teeth Whitening",
  "Clear Aligners",
  "Smile Designing",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 pt-[90px] text-white max-md:pt-[70px]">
      {/* Background shapes */}
      <div className="pointer-events-none absolute -right-[150px] -top-[250px] h-[500px] w-[500px] rounded-full border-[45px] border-white/5"></div>
     <div className="pointer-events-none absolute -bottom-[220px] -left-[180px] h-[420px] w-[420px] rounded-full bg-blue-500/10 animate-footer-orb"></div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-4">
        {/* Footer grid */}
        <div className="grid grid-cols-1 gap-[35px] pb-[60px] md:grid-cols-2 md:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-[45px]">
          {/* Brand */}
          <div>
            <Link prefetch={false} href="/" className="mb-6 flex items-center gap-3.5">
              <div className="relative h-[56px] w-[56px] overflow-hidden rounded-[18px] bg-white p-[5px] shadow-[0_18px_35px_rgba(0,0,0,0.25)] sm:h-[65px] sm:w-[65px] lg:h-[78px] lg:w-[78px]">
                <Image
                  src="/images/logo/logo.webp"
                  alt="Teeth and Gums Care"
                  fill
                  sizes="78px"
                  className="object-contain"
                />
              </div>

              <div>
                <div className="text-[21px] font-black leading-tight text-white sm:text-2xl lg:text-[28px]">
                  Teeth and Gums Care
                </div>
                <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/80 lg:text-xs">
                  Dental Clinic · Jodhpur
                </div>
              </div>
            </Link>

            <p className="mb-6 max-w-[420px] leading-[1.85] text-white/80">
              Providing advanced dental care with compassion, expertise, and
              modern technology. Our goal is to help every patient achieve a
              healthy and confident smile.
            </p>

            <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap">
              {["Trusted Care", "Modern Technology", "Experienced Dentists"].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[13px] font-extrabold backdrop-blur transition-[transform,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.18]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCheck} className="text-blue-300" />
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-6 flex gap-3">
<a
                href="https://wa.me/919829824356"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-[transform,background-color,color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[7px] hover:scale-[1.08] hover:bg-white hover:text-blue-600 hover:shadow-[0_18px_35px_rgba(37,99,235,0.28)]"
              >
                <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} />
              </a>

              <a
                href="https://share.google/X1DeFzBmXM8WkGAuc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Teeth and Gums Care on Google"
                className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-[transform,background-color,color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[7px] hover:scale-[1.08] hover:bg-white hover:text-blue-600 hover:shadow-[0_18px_35px_rgba(37,99,235,0.28)]"
              >
                <FontAwesomeIcon aria-hidden="true" icon={faGoogle} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="relative mb-7 text-xl font-black text-white after:absolute after:-bottom-2.5 after:left-0 after:h-1 after:w-[45px] after:rounded-full after:bg-gradient-to-r after:from-blue-300 after:to-white">
              Quick Links
            </h2>

            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link prefetch={false}
                    href={link.href}
                    className="relative inline-flex font-semibold text-white/80 transition-all duration-300 ease-out before:absolute before:-bottom-[5px] before:left-0 before:h-0.5 before:w-0 before:bg-[#7ec3ff] before:transition-[width] before:duration-300 hover:pl-3 hover:text-white hover:before:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="relative mb-7 text-xl font-black text-white after:absolute after:-bottom-2.5 after:left-0 after:h-1 after:w-[45px] after:rounded-full after:bg-gradient-to-r after:from-blue-300 after:to-white">
              Our Services
            </h2>

            <ul className="space-y-3.5">
              {services.map((service) => (
                <li
                  key={service}
                  className="relative pl-[18px] font-semibold text-white/80 transition-[transform,color] duration-300 ease-out before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-blue-300 hover:translate-x-1.5 hover:text-white"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="relative mb-7 text-xl font-black text-white after:absolute after:-bottom-2.5 after:left-0 after:h-1 after:w-[45px] after:rounded-full after:bg-gradient-to-r after:from-blue-300 after:to-white">
              Contact Info
            </h2>

            <div className="flex flex-col gap-7">
  {/* Address */}
  <div className="flex items-start gap-[18px] transition-transform duration-[350ms] ease-out hover:translate-x-2">
    <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px] bg-white/10">
      <FontAwesomeIcon aria-hidden="true" icon={faLocationDot} className="text-[22px] text-[#7ec3ff]" />
    </div>

    <div>
      <span className="mb-2 block text-[14px] font-bold text-white/75">
        Address
      </span>

      <p itemProp="address" className="m-0 text-[17px] font-bold leading-relaxed text-white">
        E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute, Jodhpur, Rajasthan
      </p>
    </div>
  </div>

  {/* Phone */}
  <div className="flex items-start gap-[18px] transition-transform duration-[350ms] ease-out hover:translate-x-2">
    <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px] bg-white/10">
      <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="text-[20px] text-[#7ec3ff]" />
    </div>

    <div>
      <span className="mb-2 block text-[14px] font-bold text-white/75">
        Phone
      </span>

      <a
        href="tel:+919829824356"
        itemProp="telephone"
        className="text-[17px] font-bold text-white transition hover:text-blue-300"
      >
        +91 98298 24356
      </a>
    </div>
  </div>

  {/* Email */}
  <div className="flex items-start gap-[18px] transition-transform duration-[350ms] ease-out hover:translate-x-2">
    <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[16px] bg-white/10">
      <FontAwesomeIcon aria-hidden="true" icon={faEnvelope} className="text-[20px] text-[#7ec3ff]" />
    </div>

    <div>
      <span className="mb-2 block text-[14px] font-bold text-white/75">
        Email
      </span>

      <a
        href="mailto:sunitakhetani@gmail.com"
        itemProp="email"
        className="break-all text-[17px] font-bold text-white transition hover:text-blue-300"
      >
        sunitakhetani@gmail.com
      </a>
    </div>
  </div>
</div>

            <div className="mt-7 rounded-[22px] border border-white/10 bg-white/10 p-[22px] backdrop-blur transition-[transform,background-color] duration-[350ms] ease-out hover:-translate-y-1 hover:bg-white/[0.14]">
              <div className="mb-[18px] flex items-center gap-2.5 font-black">
                <FontAwesomeIcon aria-hidden="true" icon={faClock} className="text-blue-300" />
                <span>Clinic Hours</span>
              </div>

              <div className="flex flex-col gap-3.5 border-b border-white/10 pb-3.5 sm:flex-row sm:justify-between">
                <span className="text-sm font-bold text-white/75">
                  Mon - Sat
                </span>
                <strong className="text-left text-sm leading-relaxed text-white sm:text-right">
                  10:00 AM - 3:00 PM
                  <br />
                  5:30 PM - 8:30 PM
                </strong>
              </div>

              <div className="mt-3.5 flex flex-col gap-1.5 sm:flex-row sm:justify-between">
                <span className="text-sm font-bold text-white/75">Sunday</span>
                <strong className="text-left text-sm text-white sm:text-right">
                  10:00 AM - 3:00 PM
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mb-[50px] mt-2.5 flex flex-col items-center justify-between gap-[30px] rounded-[28px] border border-white/10 bg-white/10 px-5 py-7 text-center backdrop-blur md:px-10 md:py-[35px] lg:flex-row lg:text-left">
          <div>
            <span className="block text-sm font-extrabold uppercase tracking-wide text-blue-300">
              Need dental help?
            </span>
            <h4 className="mt-2 text-2xl font-black text-white md:text-[1.8rem]">
              Book your appointment today
            </h4>
          </div>

          <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <Link prefetch={false}
              href="/book-appointment"
              className="rounded-[14px] bg-white px-6 py-3.5 text-center font-extrabold text-blue-600 transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_18px_40px_rgba(255,255,255,0.25)]"
            >
              Book Appointment
            </Link>

            <a
              href="tel:+919829824356"
              className="rounded-[14px] border-2 border-white/30 px-6 py-3.5 text-center font-extrabold text-white transition-[transform,background-color,color,border-color] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white hover:bg-white hover:text-blue-600"
            >
              Call Now
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-center gap-3 border-t border-white/10 py-6 text-center md:flex-row md:justify-between">
          <p className="m-0 font-semibold text-white/70">
            © {currentYear} Teeth and Gums Care. All Rights Reserved.
          </p>

          <p className="m-0 font-semibold text-white/70">
  Designed & Developed by{" "}
  <a
    href="https://wa.me/917014854192"
    target="_blank"
    rel="noopener noreferrer"
    className="font-bold text-blue-300 transition duration-300 hover:text-white hover:underline"
    aria-label="Contact Shahzad Khan on WhatsApp"
  >
    Shahzad Khan
  </a>
</p>
        </div>
      </div>
    </footer>
  );
}
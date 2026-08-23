import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faGoogle,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
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
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#062c5a] via-[#08376f] to-[#0b3c91] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-44 h-[440px] w-[440px] rounded-full border-[50px] border-white/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-56 -left-32 h-[420px] w-[420px] rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.35fr] lg:gap-12 lg:py-16">
          <div>
            <Link prefetch={false} href="/" className="flex items-center gap-3.5">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_14px_35px_rgba(0,0,0,0.18)]">
                <Image src="/images/logo/logo.webp" alt="Teeth and Gums Care" fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <div className="text-2xl font-black tracking-[-0.02em] text-white">Teeth and Gums Care</div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-200">Advanced Dental Care · Jodhpur</div>
              </div>
            </Link>

            <p className="mt-6 max-w-[420px] leading-8 text-blue-50/75">
              Advanced dental care with a strong focus on precision, comfort,
              ethical treatment, and long-term oral health.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Patient-first", "Modern Technology", "Trusted Care"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-extrabold text-blue-50 backdrop-blur">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-2.5">
              {[
                { href: "https://www.facebook.com/profile.php?id=61590941001711", label: "Facebook", icon: faFacebookF },
                { href: "https://www.instagram.com/teethandgumscare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram", icon: faInstagram },
                { href: "https://wa.me/919829824356", label: "WhatsApp", icon: faWhatsapp },
                { href: "https://share.google/X1DeFzBmXM8WkGAuc", label: "Google", icon: faGoogle },
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:-translate-y-1 hover:bg-white hover:text-blue-700">
                  <FontAwesomeIcon aria-hidden="true" icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-black text-white">Quick Links</h2>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-blue-300" />
            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link prefetch={false} href={link.href} className="font-semibold text-blue-50/75 transition hover:pl-1 hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-black text-white">Our Services</h2>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-blue-300" />
            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service} className="font-semibold text-blue-50/75">{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-black text-white">Contact & Hours</h2>
            <div className="mt-3 h-0.5 w-10 rounded-full bg-blue-300" />

            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-blue-200"><FontAwesomeIcon aria-hidden="true" icon={faLocationDot} /></span>
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-blue-200">Clinic</div>
                  <p itemProp="address" className="mt-1 leading-6 text-blue-50/85">E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute, Jodhpur, Rajasthan</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a href="tel:+919829824356" itemProp="telephone" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                  <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="text-blue-200" />
                  <span className="font-bold">+91 98298 24356</span>
                </a>
                <a href="mailto:sunitakhetani@gmail.com" itemProp="email" className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                  <FontAwesomeIcon aria-hidden="true" icon={faEnvelope} className="shrink-0 text-blue-200" />
                  <span className="truncate text-sm font-bold">sunitakhetani@gmail.com</span>
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 font-black text-white"><FontAwesomeIcon aria-hidden="true" icon={faClock} className="text-blue-200" /> Clinic Hours</div>
                <div className="mt-3 space-y-2 text-sm text-blue-50/80">
                  <div className="flex justify-between gap-4"><span>Mon - Sat</span><strong className="text-right text-white">10:00 AM - 3:00 PM<br />5:30 PM - 8:30 PM</strong></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between gap-4"><span>Sunday</span><strong className="text-white">10:00 AM - 3:00 PM</strong></div>
                </div>
              </div>

              <Link prefetch={false} href="/book-appointment" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3.5 font-black text-[#08376f] shadow-[0_14px_35px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5">
                <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-2 text-blue-600" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center text-sm text-blue-50/65 md:flex-row md:text-left">
          <p>© {currentYear} Teeth and Gums Care. All Rights Reserved.</p>
          <p className="text-blue-100/70">Healthy smiles. Thoughtful care. Lasting confidence.</p>
          <p>
            Designed & Developed by{" "}
            <a href="https://wa.me/917014854192" target="_blank" rel="noopener noreferrer" className="font-black text-blue-200 transition hover:text-white">Shahzad Khan</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

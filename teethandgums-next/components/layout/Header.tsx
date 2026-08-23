"use client";

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
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(126);
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setMenuOpen(false));
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      const nextHeight = Math.ceil(header.getBoundingClientRect().height);
      setHeaderHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(header);
    window.addEventListener("resize", updateHeaderHeight, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[99999] w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-[0_18px_50px_rgba(8,55,111,0.12)] backdrop-blur-2xl"
            : "bg-white"
        }`}
      >
        <div
          className={`overflow-hidden bg-gradient-to-r from-[#08376f] via-[#0b3c91] to-blue-700 text-white transition-all duration-300 ${
            scrolled ? "max-h-0 py-0 opacity-0" : "max-h-[54px] py-2 opacity-100"
          }`}
        >
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 text-[11px] sm:text-xs lg:text-[13px]">
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex min-w-0 items-center gap-2">
                  <FontAwesomeIcon aria-hidden="true" icon={faLocationDot} className="shrink-0 text-blue-200" />
                  <span className="truncate">E-32, Shastri Nagar, Jodhpur</span>
                </div>
                <span className="hidden h-4 w-px bg-white/25 md:block" />
                <div className="hidden items-center gap-2 md:flex">
                  <FontAwesomeIcon aria-hidden="true" icon={faClock} className="text-blue-200" />
                  <span>Mon–Sat 10am–3pm & 5:30pm–8:30pm · Sun 10am–3pm</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 lg:gap-4">
                <a href="tel:+919829824356" itemProp="telephone" className="flex items-center gap-2 font-extrabold transition hover:text-blue-100">
                  <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="text-blue-200" />
                  <span className="hidden sm:inline">+91 98298 24356</span>
                </a>
                <a href="mailto:sunitakhetani@gmail.com" itemProp="email" className="hidden items-center gap-2 xl:flex">
                  <FontAwesomeIcon aria-hidden="true" icon={faEnvelope} className="text-blue-200" />
                  <span>sunitakhetani@gmail.com</span>
                </a>
                <div className="hidden items-center gap-1.5 lg:flex">
                  {[
                    { href: "https://www.facebook.com/profile.php?id=61590941001711", label: "Facebook", icon: faFacebookF },
                    { href: "https://www.instagram.com/teethandgumscare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram", icon: faInstagram },
                    { href: "https://wa.me/919829824356", label: "WhatsApp", icon: faWhatsapp },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/10 text-[11px] transition hover:-translate-y-0.5 hover:bg-white hover:text-blue-700"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="border-b border-blue-100/80 bg-white/95 backdrop-blur-2xl">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
            <div
              className={`flex flex-wrap items-center justify-between gap-3 transition-all duration-300 lg:flex-nowrap ${
                scrolled ? "min-h-[70px] py-2" : "min-h-[82px] py-2.5"
              }`}
            >
              <Link
                prefetch={false}
                href="/"
                scroll
                onClick={() => setMenuOpen(false)}
                className="flex min-w-0 items-center gap-3 lg:shrink-0"
              >
                <div
                  className={`relative shrink-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_10px_28px_rgba(37,99,235,0.11)] transition-all duration-300 ${
                    scrolled ? "h-11 w-11 lg:h-[50px] lg:w-[50px]" : "h-12 w-12 lg:h-[58px] lg:w-[58px]"
                  }`}
                >
                  <Image
                    src="/images/logo/logo.webp"
                    alt="Teeth and Gums Care"
                    fill
                    sizes="58px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="max-w-[205px] truncate text-[17px] font-black tracking-[-0.025em] text-[#08376f] sm:max-w-none sm:text-xl xl:text-[21px]">
                    Teeth and Gums Care
                  </div>
                  <div className="mt-0.5 hidden text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600 sm:block xl:text-[10px]">
                    Advanced Dental Care · Jodhpur
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-2xl border border-blue-100 bg-blue-50 shadow-sm lg:hidden"
              >
                <span className={`h-[2px] w-[22px] rounded-full bg-[#0b3c91] transition ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-[2px] w-[22px] rounded-full bg-[#0b3c91] transition ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`h-[2px] w-[22px] rounded-full bg-[#0b3c91] transition ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </button>

              <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex xl:gap-5">
                <ul className="flex min-w-0 list-none items-center gap-0.5 p-0">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          prefetch={false}
                          href={link.href}
                          scroll
                          className={`relative inline-flex items-center justify-center rounded-xl px-2.5 py-2.5 text-[13px] font-extrabold transition-all duration-300 xl:px-3.5 xl:text-sm ${
                            isActive
                              ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.08)]"
                              : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {link.label}
                          {isActive && <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-blue-600" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  prefetch={false}
                  href="/book-appointment"
                  scroll
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-4 py-3 text-[13px] font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(37,99,235,0.32)] xl:px-5 xl:text-sm"
                >
                  <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} />
                  <span>Book Appointment</span>
                </Link>
              </div>

              <div
                id="mobile-navigation"
                className={`w-full border-t border-blue-100 pt-4 transition lg:hidden ${menuOpen ? "block animate-nav-drop" : "hidden"}`}
              >
                <ul className="grid list-none gap-1.5 p-0">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          prefetch={false}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          scroll
                          className={`flex w-full rounded-xl px-4 py-3 font-extrabold transition ${
                            isActive ? "bg-blue-50 text-blue-700" : "text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 grid gap-2.5 pb-2 sm:grid-cols-2">
                  <a
                    href="https://wa.me/919829824356"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm font-black text-green-700"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} />
                    WhatsApp
                  </a>
                  <Link
                    prefetch={false}
                    href="/book-appointment"
                    onClick={() => setMenuOpen(false)}
                    scroll
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#0b3c91] px-4 py-3.5 text-sm font-black text-white"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div aria-hidden="true" style={{ height: `${headerHeight}px` }} />
    </>
  );
}

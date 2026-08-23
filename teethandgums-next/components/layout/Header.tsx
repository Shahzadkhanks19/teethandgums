"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faClock, faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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
    const frameId = window.requestAnimationFrame(() => {
      setMenuOpen(false);
    });

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
        className={`fixed left-0 right-0 top-0 z-[99999] w-full bg-white transition-all duration-300 ${
          scrolled ? "shadow-[0_18px_45px_rgba(13,110,253,0.12)]" : ""
        }`}
      >
        <div
          className={`overflow-hidden bg-gradient-to-br from-[#08376f] to-[#0b3c91] text-white transition-all duration-300 ${
            scrolled ? "max-h-0 py-0 opacity-0" : "max-h-[70px] py-2.5 opacity-100"
          }`}
        >
          <div className="mx-auto max-w-[1700px] px-[14px] sm:px-5 lg:px-[28px] xl:px-[36px] 2xl:px-[48px]">
            <div className="flex items-center justify-center gap-4 text-[11px] sm:text-xs lg:justify-between lg:text-sm">
              <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-start">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon aria-hidden="true" icon={faLocationDot} className="text-blue-300" />
                  <span>E-32, Shastri Nagar, Jodhpur</span>
                </div>

                <div className="hidden h-[18px] w-px bg-white/25 lg:block"></div>

                <div className="hidden items-center gap-2 lg:flex">
                  <FontAwesomeIcon aria-hidden="true" icon={faClock} className="text-blue-300" />
                  <span>Mon–Sat 10am–3pm & 5:30pm–8:30pm | Sun 10am–3pm</span>
                </div>

                <div className="hidden h-[18px] w-px bg-white/25 lg:block"></div>

                <div className="flex items-center gap-2">
                  <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="text-blue-300" />
                  <a href="tel:+919829824356" itemProp="telephone">+91 98298 24356</a>
                </div>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <div className="hidden items-center gap-2 xl:flex">
                  <FontAwesomeIcon aria-hidden="true" icon={faEnvelope} className="text-blue-300" />
                  <a href="mailto:sunitakhetani@gmail.com" itemProp="email">
                    sunitakhetani@gmail.com
                  </a>
                </div>

                <div className="hidden h-[18px] w-px bg-white/25 xl:block"></div>

                <div className="flex gap-2">
                  <a
                    href="https://www.facebook.com/profile.php?id=61590941001711"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color,color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.08] hover:bg-white hover:text-blue-600 hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faFacebookF} />
                  </a>
                  <a
                    href="https://www.instagram.com/teethandgumscare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color,color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.08] hover:bg-white hover:text-blue-600 hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faInstagram} />
                  </a>
                  <a
                    href="https://wa.me/919829824356"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-white transition-[transform,background-color,color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.08] hover:bg-white hover:text-blue-600 hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="border-b border-blue-100/60 bg-white">
          <div className="mx-auto max-w-[1700px] px-[14px] sm:px-5 lg:px-[24px] xl:px-[30px] 2xl:px-[42px]">
            <div
              className={`flex flex-wrap items-center justify-between gap-3 py-2.5 transition-all duration-300 lg:flex-nowrap ${
                scrolled ? "min-h-[70px] lg:min-h-[76px]" : "min-h-[76px] lg:min-h-[90px]"
              }`}
            >
              <Link
                prefetch={false}
                href="/"
                scroll
                onClick={() => setMenuOpen(false)}
                className="flex min-w-0 flex-1 items-center gap-3 text-decoration-none lg:w-[255px] lg:flex-none xl:w-[285px] 2xl:w-[330px]"
              >
                <div
                  className={`relative shrink-0 overflow-hidden rounded-[14px] bg-white shadow-[0_10px_30px_rgba(13,110,253,0.15)] transition-all duration-300 ${
                    scrolled
                      ? "h-11 w-11 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px] xl:h-[54px] xl:w-[54px] 2xl:h-[58px] 2xl:w-[58px]"
                      : "h-12 w-12 sm:h-[54px] sm:w-[54px] lg:h-[56px] lg:w-[56px] xl:h-[60px] xl:w-[60px] 2xl:h-[66px] 2xl:w-[66px] 2xl:rounded-[18px]"
                  }`}
                >
                  <Image
                    src="/images/logo/logo.webp"
                    alt="Teeth and Gums Care"
                    fill
                    sizes="(max-width: 480px) 48px, (max-width: 991px) 54px, (max-width: 1279px) 56px, 66px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 overflow-hidden">
                  <div
                    className={`whitespace-nowrap font-extrabold leading-[1.1] text-slate-900 transition-all duration-300 ${
                      scrolled
                        ? "text-[17px] sm:text-[19px] lg:text-[18px] xl:text-[19px] 2xl:text-[21px]"
                        : "text-[18px] sm:text-xl lg:text-[18px] xl:text-[20px] 2xl:text-[23px]"
                    }`}
                  >
                    Teeth and Gums Care
                  </div>

                  <div className="mt-1 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 sm:text-[10px] lg:text-[9px] xl:text-[10px] 2xl:text-[11px] 2xl:tracking-[0.14em]">
                    Dental Clinic · Jodhpur
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-[14px] bg-[#eaf3ff] shadow-[0_10px_25px_rgba(13,110,253,0.12)] transition-colors duration-200 hover:bg-[#eaf3ff] lg:hidden"
              >
                <span className={`h-[2.5px] w-[22px] rounded-full bg-[#0b3c91] transition ${menuOpen ? "translate-y-[7.5px] rotate-45" : ""}`}></span>
                <span className={`h-[2.5px] w-[22px] rounded-full bg-[#0b3c91] transition ${menuOpen ? "opacity-0" : ""}`}></span>
                <span className={`h-[2.5px] w-[22px] rounded-full bg-[#0b3c91] transition ${menuOpen ? "-translate-y-[7.5px] -rotate-45" : ""}`}></span>
              </button>

              <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 lg:flex xl:gap-3 2xl:gap-4">
                <ul className="flex min-w-0 list-none items-center gap-0.5 p-0 xl:gap-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                      <li key={link.href}>
                        <Link
                          prefetch={false}
                          href={link.href}
                          scroll
                          className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl px-2.5 py-3 text-[13px] font-bold transition-all duration-300 ease-out before:absolute before:bottom-[5px] before:left-1/2 before:h-[3px] before:w-0 before:-translate-x-1/2 before:rounded-full before:bg-blue-600 before:transition-[width] before:duration-300 hover:-translate-y-0.5 hover:before:w-[65%] xl:px-3 xl:text-sm 2xl:px-4 2xl:text-[15px] ${
                            isActive
                              ? "bg-blue-50 text-blue-600 after:absolute after:bottom-1.5 after:left-3 after:right-3 after:h-[3px] after:rounded-full after:bg-gradient-to-r after:from-blue-600 after:to-blue-900"
                              : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href="https://wa.me/919829824356"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#25d366] text-sm font-extrabold text-white transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_35px_rgba(37,211,102,0.35)] 2xl:h-auto 2xl:w-auto 2xl:gap-2 2xl:px-5 2xl:py-3"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} />
                    <span className="hidden 2xl:inline">WhatsApp</span>
                  </a>

                  <Link
                    prefetch={false}
                    href="/book-appointment"
                    scroll
                    className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-gradient-to-br from-blue-600 to-blue-900 px-3 py-3 text-[13px] font-extrabold text-white transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_18px_35px_rgba(13,110,253,0.35)] xl:px-4 xl:text-sm 2xl:px-5 2xl:text-[15px]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} />
                    Book Appointment
                  </Link>
                </div>
              </div>

              <div
                id="mobile-navigation"
                className={`w-full border-t border-blue-100 pt-4 transition lg:hidden ${
                  menuOpen ? "block animate-nav-drop" : "hidden"
                }`}
              >
                <ul className="flex list-none flex-col items-stretch gap-1.5 p-0">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                      <li key={link.href}>
                        <Link
                          prefetch={false}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex w-full justify-start rounded-[14px] px-[15px] py-[13px] font-bold transition-all duration-300 hover:pl-[22px] ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                          scroll
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 flex w-full flex-col gap-2.5 pb-2">
                  <a
                    href="https://wa.me/919829824356"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#25d366] px-[18px] py-3.5 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(37,211,102,0.28)]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faWhatsapp} />
                    WhatsApp
                  </a>

                  <Link
                    prefetch={false}
                    href="/book-appointment"
                    onClick={() => setMenuOpen(false)}
                    scroll
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-blue-600 to-blue-900 px-[18px] py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(13,110,253,0.25)]"
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
import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong, faBolt, faCalendarCheck, faChildReaching, faClock, faFaceSmile, faLocationDot, faPhone, faShieldHeart, faTooth } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

import GoogleReviewsSlider from "@/components/home/GoogleReviewsSlider";

const visitReasons = [
  { icon: faBolt, title: "Something hurts", text: "Toothache, sensitivity, swelling or a dental emergency.", href: "/services" },
  { icon: faFaceSmile, title: "I want a better smile", text: "Whitening, veneers, aligners and smile enhancement.", href: "/services" },
  { icon: faTooth, title: "I am missing a tooth", text: "Explore implant and tooth-replacement possibilities.", href: "/services" },
  { icon: faShieldHeart, title: "I need a check-up", text: "Preventive care, cleaning and routine oral-health reviews.", href: "/book-appointment" },
  { icon: faChildReaching, title: "Care for my family", text: "Comfortable dental visits for different ages and needs.", href: "/book-appointment" },
];

function Label({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">{children}</span>;
}

export default function PremiumHomeSections() {
  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-100 py-20 sm:py-24 lg:py-28" aria-labelledby="reason-title">
        <div className="pointer-events-none absolute -right-48 top-10 h-96 w-96 rounded-full bg-blue-50 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Label>Start with you</Label>
              <h2 id="reason-title" className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-[#08376f] sm:text-5xl lg:text-6xl">What brings you in today?</h2>
              <p className="mt-5 max-w-md text-base leading-8 text-slate-600 sm:text-lg">You do not need to know the name of a treatment. Start with what you are experiencing or what you want to change.</p>
              <Link href="/book-appointment" prefetch={false} className="mt-8 inline-flex items-center rounded-full bg-[#08376f] px-6 py-3.5 font-black text-white transition hover:bg-blue-700">Talk to a dentist<FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" className="ml-3" /></Link>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {visitReasons.map((reason, index) => (
                <Link key={reason.title} href={reason.href} prefetch={false} className="group grid gap-4 py-6 sm:grid-cols-[64px_1fr_44px] sm:items-center sm:py-7">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white"><FontAwesomeIcon icon={reason.icon} aria-hidden="true" /></span>
                  <div><div className="flex items-baseline gap-3"><span className="text-[10px] font-black tracking-[0.18em] text-slate-400">0{index + 1}</span><h3 className="text-xl font-black text-[#08376f] sm:text-2xl">{reason.title}</h3></div><p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base">{reason.text}</p></div>
                  <span className="hidden h-11 w-11 place-items-center rounded-full border border-slate-200 text-blue-700 transition group-hover:translate-x-1 group-hover:bg-blue-50 sm:grid"><FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071f3d] py-20 text-white sm:py-24 lg:py-28" aria-labelledby="inside-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <Label>Inside Teeth &amp; Gums Care</Label>
              <h2 id="inside-title" className="mt-4 text-4xl font-black leading-[1.03] tracking-[-0.045em] sm:text-5xl lg:text-6xl">A clinic you can feel confident walking into.</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/70 sm:text-lg">Clean spaces, careful diagnosis and a team that explains before it treats.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-[28px] bg-white/5"><Image src="/images/common/interior.webp" alt="Interior of Teeth and Gums Care dental clinic" fill sizes="(max-width:1023px) 100vw,58vw" className="object-cover" /></div>
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-white/5"><Image src="/images/common/about.webp" alt="Teeth and Gums Care clinic exterior" fill sizes="(max-width:1023px) 50vw,29vw" className="object-cover" /></div>
              <div className="relative aspect-square overflow-hidden rounded-[28px] bg-white/5"><Image src="/images/common/slider2.webp" alt="Patient care at Teeth and Gums Care" fill sizes="(max-width:1023px) 50vw,29vw" className="object-cover" /></div>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviewsSlider />

      <section className="pb-20 sm:pb-24 lg:pb-28" aria-labelledby="visit-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[34px] bg-[#f4f8ff] ring-1 ring-blue-100">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6 sm:p-9 lg:p-12"><Label>Plan your visit</Label><h2 id="visit-title" className="mt-4 max-w-2xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-[#08376f] sm:text-5xl">Ready when you are.</h2><p className="mt-5 max-w-xl leading-8 text-slate-600">Book a consultation and tell us what is bothering you. We will take it from there.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/book-appointment" prefetch={false} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-[#08376f]"><FontAwesomeIcon icon={faCalendarCheck} className="mr-2" aria-hidden="true" />Book Appointment</Link><a href="tel:+919829824356" className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-6 py-4 font-black text-[#08376f]"><FontAwesomeIcon icon={faPhone} className="mr-2" aria-hidden="true" />Call Clinic</a></div></div>
              <div className="grid gap-px bg-blue-100 sm:grid-cols-3 lg:grid-cols-1"><div className="bg-white p-6"><FontAwesomeIcon icon={faLocationDot} className="text-blue-600" aria-hidden="true" /><p className="mt-3 text-xs font-black uppercase tracking-[0.15em] text-slate-400">Location</p><p className="mt-1 font-bold text-[#08376f]">Jodhpur, Rajasthan</p></div><div className="bg-white p-6"><FontAwesomeIcon icon={faClock} className="text-blue-600" aria-hidden="true" /><p className="mt-3 text-xs font-black uppercase tracking-[0.15em] text-slate-400">Appointments</p><p className="mt-1 font-bold text-[#08376f]">Schedule a convenient slot</p></div><div className="bg-white p-6"><FontAwesomeIcon icon={faPhone} className="text-blue-600" aria-hidden="true" /><p className="mt-3 text-xs font-black uppercase tracking-[0.15em] text-slate-400">Call</p><p className="mt-1 font-bold text-[#08376f]">+91 98298 24356</p></div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

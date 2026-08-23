"use client";

import { HoverButton, HoverCard } from "@/components/animations";

import AppointmentIcon from "./AppointmentIcon";
const emergencySymptoms = [
  "Severe Tooth Pain",
  "Broken or Knocked-Out Tooth",
  "Swelling in the Gums or Face",
  "Persistent or Uncontrolled Bleeding",
];

export default function EmergencyAppointmentCard() {
  return (
    <HoverCard>
      <aside
        aria-labelledby="emergency-dental-care-title"
        className="relative overflow-hidden rounded-[38px] bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 text-white shadow-[0_30px_90px_rgba(220,38,38,.28)]"
      >
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-red-300/10 blur-3xl"
        />

        <div className="relative z-10">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-wider backdrop-blur">
            <AppointmentIcon
              aria-hidden="true"
              className="fa-solid fa-triangle-exclamation mr-2"
            />
            Emergency Dental Care
          </span>

          <h2
            id="emergency-dental-care-title"
            className="mt-5 text-3xl font-black leading-tight"
          >
            Need Emergency Dental Care in Jodhpur?
          </h2>

          <p className="mt-5 leading-8 text-white/90">
            Contact Teeth and Gums Care immediately if you have severe tooth
            pain, facial swelling, dental trauma, persistent bleeding or a
            broken tooth. Early treatment may reduce pain and prevent further
            complications.
          </p>

          <div className="mt-8 grid gap-3">
            {emergencySymptoms.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
              >
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-red-600"
                >
                  <AppointmentIcon className="fa-solid fa-check" />
                </span>

                <span className="font-bold">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-red-600 shadow-lg"
              >
                <AppointmentIcon className="fa-solid fa-headset" />
              </div>

              <div>
                <h3 className="font-black">Quick Emergency Assistance</h3>

                <p className="text-sm leading-6 text-white/80">
                  Our clinic team will guide you and arrange the earliest
                  available emergency appointment during clinic hours.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <HoverButton>
              <a
                href="tel:+919829824356"
                itemProp="telephone"
                aria-label="Call Teeth and Gums Care for emergency dental assistance"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-6 py-4 text-base font-black text-red-600 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                <AppointmentIcon
                  aria-hidden="true"
                  className="fa-solid fa-phone mr-3"
                />
                Call for Emergency Help
              </a>
            </HoverButton>

            <HoverButton>
              <a
                href="https://wa.me/919829824356?text=Hello%20Teeth%20and%20Gums%20Care,%20I%20need%20urgent%20help%20for%20a%20dental%20emergency.%20Please%20contact%20me%20as%20soon%20as%20possible."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message Teeth and Gums Care on WhatsApp for emergency dental assistance"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border-2 border-white/40 px-6 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                <AppointmentIcon
                  aria-hidden="true"
                  className="fa-brands fa-whatsapp mr-3 text-lg"
                />
                WhatsApp for Assistance
              </a>
            </HoverButton>
          </div>

          <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur">
            <p className="text-sm font-semibold leading-7 text-white/85">
              For severe facial injury, uncontrolled bleeding, loss of
              consciousness or difficulty breathing, contact emergency medical
              services or visit the nearest hospital immediately.
            </p>
          </div>
        </div>
      </aside>
    </HoverCard>
  );
}

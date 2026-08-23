"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCalendarCheck,
  faCircleCheck,
  faCircleExclamation,
  faClock,
  faEnvelope,
  faHeartCircleCheck,
  faLocationArrow,
  faLocationDot,
  faLock,
  faMessage,
  faPaperPlane,
  faPhone,
  faShieldHeart,
  faSpinner,
  faTooth,
  faUser,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import { m } from "framer-motion";
import { forwardRef, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useId, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import ContactFAQ from "@/components/contact/ContactFAQ";

import {
  FadeUp,
  HoverButton,
  HoverCard,
  RotateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type Errors = Partial<FormData>;

const initialFormData: FormData = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

const visitReasons: Array<{ icon: IconDefinition; title: string; text: string }> = [
  {
    icon: faUserDoctor,
    title: "Experienced Dentists",
    text: "Personalized care from trusted dental professionals.",
  },
  {
    icon: faTooth,
    title: "Advanced Treatments",
    text: "Modern dentistry for complete oral healthcare.",
  },
  {
    icon: faHeartCircleCheck,
    title: "Patient-Centered Care",
    text: "Gentle guidance and clear communication.",
  },
  {
    icon: faShieldHeart,
    title: "Comfort & Safety",
    text: "Hygienic, calm, and comfortable clinic experience.",
  },
];

const trustBadges = [
  "Same Day Appointments",
  "Experienced Dentists",
  "Emergency Dental Care",
];

const contactTrustItems = [
  "Same Day Appointments",
  "Modern Dental Equipment",
  "Experienced Dentists",
  "Patient First Care",
];

const finalCtaBadges = [
  "Trusted by Patients",
  "Modern Dentistry",
  "Jodhpur Clinic",
];

const directionsLink =
"https://maps.app.goo.gl/eP4Deqk44KgSE7So6";

export default function ContactClient() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  const messageLength = formData.message.trim().length;

  const fieldIds = useMemo(
    () => ({
      name: `${formId}-name`,
      phone: `${formId}-phone`,
      email: `${formId}-email`,
      message: `${formId}-message`,
    }),
    [formId],
  );

  const validateForm = () => {
    const newErrors: Errors = {};
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name should be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!indianPhoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian WhatsApp number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    setErrors(newErrors);

    const firstErrorField = Object.keys(newErrors)[0] as keyof FormData | undefined;

    if (firstErrorField) {
      window.requestAnimationFrame(() => {
        const field = formRef.current?.elements.namedItem(firstErrorField);

        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement
        ) {
          field.focus();
        }
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormData;

    setSubmitError("");
    setSuccess(false);

    setFormData((prev) => ({
      ...prev,
      [fieldName]:
        fieldName === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSuccess(false);

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone,
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        const errorMessage =
          data?.message || "Failed to submit message";
        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success("Thank you! Your message has been sent successfully.");
      setSuccess(true);
      setFormData(initialFormData);
      setErrors({});
    } catch {
      const errorMessage = "Server error. Please try again later.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="overflow-x-hidden outline-none">
      <section aria-labelledby="contact-hero-title" className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 py-28 lg:py-36">
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:70px_70px]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-black text-white backdrop-blur">
                Contact Teeth and Gums Care
              </span>

              <h1 id="contact-hero-title" className="mt-7 text-5xl font-black leading-tight text-white md:text-7xl">
                Contact Our Dental Clinic in Jodhpur
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                  Let&apos;s Create Your Perfect Smile
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-blue-100 md:text-xl">
                Contact Teeth and Gums Care in Jodhpur for dental implants, root canal treatment, smile designing, cosmetic dentistry, braces, veneers, teeth whitening and emergency dental care.
              </p>

              <StaggerContainer className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
  {trustBadges.map((badge) => (
    <StaggerItem
      key={badge}
      className="w-full sm:w-auto"
    >
      <span className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold text-white backdrop-blur sm:w-auto">
        <FontAwesomeIcon
          aria-hidden="true"
          icon={faCircleCheck}
          className="mr-2 shrink-0 text-cyan-300"
        />
        {badge}
      </span>
    </StaggerItem>
  ))}
</StaggerContainer>

              <StaggerContainer className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                <StaggerItem>
                  <HoverButton>
                    <Link prefetch={false}
                      href="/book-appointment"
                      aria-label="Book a dental appointment"
                      className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-black text-blue-700 shadow-2xl transition hover:scale-105"
                    >
                      Book Appointment
                      <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="ml-3" />
                    </Link>
                  </HoverButton>
                </StaggerItem>

                <StaggerItem>
                  <HoverButton>
                    <a
                      href="tel:+919829824356"
                      itemProp="telephone"
                      aria-label="Call Teeth and Gums Care"
                      className="inline-flex items-center justify-center rounded-full border-2 border-white/70 px-8 py-4 font-black text-white transition hover:bg-white hover:text-blue-700"
                    >
                      Call Now
                      <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="ml-3" />
                    </a>
                  </HoverButton>
                </StaggerItem>
              </StaggerContainer>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-trust-title" className="relative overflow-hidden bg-white py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700">
                Why Patients Trust Us
              </span>

              <h2 id="contact-trust-title" className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
                Quality Dental Care You Can Trust
              </h2>

              <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-500">
                Every smile deserves personalized attention, modern technology,
                ethical treatment and compassionate care.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {visitReasons.map((item) => (
              <StaggerItem key={item.title}>
                <HoverCard className="h-full">
                  <article className="group flex h-full flex-col rounded-[30px] border border-blue-100 bg-white p-8 text-center shadow-lg transition hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl">
                    <RotateIn>
                      <div aria-hidden="true" className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 text-3xl text-white shadow-xl transition group-hover:scale-110">
                        <FontAwesomeIcon icon={item.icon} />
                      </div>
                    </RotateIn>

                    <h3 className="text-xl font-black text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-500">
                      {item.text}
                    </p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section
        aria-labelledby="contact-information-title"
        className="[content-visibility:auto] [contain-intrinsic-size:1200px] relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-white to-blue-50 py-20 lg:py-28"
      >
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <FadeUp>
            <HoverCard className="h-full">
              <aside aria-labelledby="contact-information-title" className="relative h-full overflow-hidden rounded-[34px] border border-blue-100 bg-white p-8 shadow-[0_28px_80px_rgba(37,99,235,.12)] lg:p-10">
                <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
                  Contact Information
                </span>

                <h2
                  id="contact-information-title"
                  className="mt-5 text-3xl font-black leading-tight text-slate-900"
                >
                  Let&apos;s Connect
                </h2>

                <p className="mt-4 leading-8 text-slate-500">
                  Reach out to our clinic for appointments, treatment
                  information, emergency dental care, or any questions you may
                  have.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {contactTrustItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700 ring-1 ring-blue-100"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2 text-blue-600" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-7">
                  <ContactInfo
                    icon={faLocationDot}
                    title="Clinic Address"
                    text={
                      <>
                        Teeth and Gums Care Dental Clinic
                        <br />
                        E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute, Jodhpur, Rajasthan
                      </>
                    }
                  />

                  <ContactInfo
                    icon={faPhone}
                    title="Phone Number"
                    text={
                      <>
                        <a
                          href="tel:+919829824356"
                          itemProp="telephone"
                          className="font-bold text-slate-600 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                          +91 98298 24356
                        </a>
                        <br />
                        <span className="text-sm font-semibold text-blue-600">
                          Available during clinic hours
                        </span>
                      </>
                    }
                  />

                  <ContactInfo
                    icon={faEnvelope}
                    title="Email Address"
                    text={
                      <>
                        <a
                          href="mailto:sunitakhetani@gmail.com"
                          itemProp="email"
                          className="font-bold text-slate-600 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >
                          sunitakhetani@gmail.com
                        </a>
                        <br />
                        <span className="text-sm font-semibold text-blue-600">
                          We usually reply within 24 hours.
                        </span>
                      </>
                    }
                  />

                  <ContactInfo
                    icon={faClock}
                    title="Clinic Hours"
                    text={
                      <>
                        Monday – Saturday
                        <br />
                        10:00 AM – 3:00 PM
                        <br />
                        5:30 PM – 8:30 PM
                        <br />
                        Sunday
                        <br />
                        10:00 AM – 3:00 PM
                      </>
                    }
                    last
                  />
                </div>
              </aside>
            </HoverCard>
          </FadeUp>

          <FadeUp delay={0.08}>
            <HoverCard className="h-full">
              <section
                aria-labelledby="contact-form-heading"
                className="h-full rounded-[34px] border border-blue-100 bg-white p-8 shadow-[0_28px_80px_rgba(37,99,235,.12)] lg:p-10"
              >
                <div className="mb-8">
                  <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-600 ring-1 ring-blue-200/60">
                    Send a Message
                  </span>

                  <h2
                    id="contact-form-heading"
                    className="mt-5 text-3xl font-black text-slate-900"
                  >
                    We&apos;d Love To Hear From You
                  </h2>

                  <p className="mt-3 leading-8 text-slate-500">
                    Fill out the form below and our team will get back to you as
                    soon as possible.
                  </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputField
                      ref={firstFieldRef}
                      id={fieldIds.name}
                      name="name"
                      icon={faUser}
                      label="Full Name"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      error={errors.name}
                      onChange={handleChange}
                    />

                    <InputField
                      id={fieldIds.phone}
                      name="phone"
                      icon={faPhone}
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      label="WhatsApp Number"
                      autoComplete="tel"
                      placeholder="10-digit WhatsApp number"
                      value={formData.phone}
                      error={errors.phone}
                      onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                      <InputField
                        id={fieldIds.email}
                        name="email"
                        icon={faEnvelope}
                        type="email"
                        label="Email Address"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        error={errors.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor={fieldIds.message}
                        className="mb-2 block text-sm font-black text-slate-700"
                      >
                        Message
                      </label>

                      <div className="relative">
                        <FontAwesomeIcon aria-hidden="true" icon={faMessage} className="pointer-events-none absolute left-5 top-5 text-blue-500" />

                        <textarea
                          id={fieldIds.message}
                          name="message"
                          rows={6}
                          maxLength={500}
                          autoComplete="off"
                          placeholder="Tell us how we can help you..."
                          value={formData.message}
                          onChange={handleChange}
                          aria-invalid={!!errors.message}
                          aria-describedby={
                            errors.message
                              ? `${fieldIds.message}-error`
                              : undefined
                          }
                          className={`w-full rounded-2xl border bg-white py-4 pl-12 pr-5 transition duration-300 focus:outline-none focus:ring-4 ${
                            errors.message
                              ? "border-red-400 focus:ring-red-100"
                              : "border-blue-100 focus:border-blue-500 focus:ring-blue-100"
                          }`}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {errors.message ? (
                          <p
                            id={`${fieldIds.message}-error`}
                            className="text-sm font-semibold text-red-600"
                          >
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}

                        <span
                          className={`text-xs font-bold ${
                            messageLength > 350
                              ? "text-orange-600"
                              : "text-slate-400"
                          }`}
                        >
                          {messageLength}/500
                        </span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <m.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={faCircleExclamation} className="mr-2" />
                      {submitError}
                    </m.div>
                  )}

                  {success && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                      aria-live="polite"
                      className="rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2" />
                      Thank you! Your message has been sent successfully.
                    </m.div>
                  )}

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-3">
                      {trustBadges.map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700"
                        >
                          <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2 text-blue-600" />
                          {badge}
                        </span>
                      ))}
                    </div>

                    <HoverButton>
                      <button
                        type="submit"
                        disabled={loading}
                        aria-busy={loading}
                        className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-8 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <FontAwesomeIcon aria-hidden="true" icon={faSpinner} spin className="mr-3" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <FontAwesomeIcon aria-hidden="true" icon={faPaperPlane} className="ml-3" />
                          </>
                        )}
                      </button>
                    </HoverButton>
                  </div>

                  <p className="text-sm font-semibold text-slate-500">
                    <FontAwesomeIcon aria-hidden="true" icon={faLock} className="mr-2 text-blue-600" />
                    Your information is secure and confidential.
                  </p>
                </form>
              </section>
            </HoverCard>
          </FadeUp>
        </div>
      </section>

      <section
        aria-labelledby="clinic-location-title"
        className="relative scroll-mt-24 overflow-hidden bg-white px-4 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <FadeUp>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-black uppercase text-blue-600 ring-1 ring-blue-200/60">
                Clinic Location
              </span>

              <h2
                id="clinic-location-title"
                className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl"
              >
                Visit Our Dental Clinic in Jodhpur
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                Find Teeth and Gums Care Dental Clinic on the map and visit us
                for personalized dental care in Jodhpur.
              </p>

              <HoverButton>
                <a
                  href={directionsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions to Teeth and Gums Care in Google Maps"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 px-7 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Get Directions
                  <FontAwesomeIcon aria-hidden="true" icon={faLocationArrow} className="ml-3" />
                </a>
              </HoverButton>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <HoverCard>
              <div className="overflow-hidden rounded-[34px] border border-blue-100 bg-white p-2 shadow-[0_28px_80px_rgba(37,99,235,.12)]">
                {mapLoaded ? (
                  <iframe
                    title="Teeth and Gums Care Dental Clinic Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.637792058533!2d73.0042884!3d26.2734165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39418d34fadbdd11%3A0x664ab9eb47182845!2sTeeth%20and%20Gums%20Care%20Dental%20Clinic%20in%20jodhpur!5e0!3m2!1sen!2sin!4v1781185522279!5m2!1sen!2sin"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="block h-[380px] w-full rounded-[28px] border-0 lg:h-[520px]"
                  />
                ) : (
                  <div className="flex h-[380px] flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-blue-50 to-blue-100 px-6 text-center lg:h-[520px]">
                    <FontAwesomeIcon
                      aria-hidden="true"
                      icon={faLocationDot}
                      className="text-5xl text-blue-600"
                    />
                    <h3 className="mt-5 text-2xl font-black text-slate-900">
                      View Our Clinic Location
                    </h3>
                    <p className="mt-3 max-w-md leading-7 text-slate-600">
                      Load the interactive Google Map only when you need it.
                    </p>
                    <button
                      type="button"
                      onClick={() => setMapLoaded(true)}
                      className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    >
                      Load Map
                      <FontAwesomeIcon
                        aria-hidden="true"
                        icon={faLocationArrow}
                        className="ml-3"
                      />
                    </button>
                  </div>
                )}
              </div>
            </HoverCard>
          </FadeUp>
        </div>
      </section>

      <ContactFAQ />

      <section aria-labelledby="contact-final-cta-title" className="[content-visibility:auto] [contain-intrinsic-size:650px] relative scroll-mt-24 overflow-hidden bg-blue-50 px-4 py-20 lg:py-28">
        <FadeUp>
          <div className="relative z-10 mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 px-6 py-12 text-white shadow-[0_30px_90px_rgba(37,99,235,.24)] sm:px-10 lg:px-14 lg:py-16">
            <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div>
                <div className="mb-5 flex flex-wrap gap-3">
                  {finalCtaBadges.map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-white/15 bg-white/15 px-4 py-2 text-sm font-black backdrop-blur"
                    >
                      <FontAwesomeIcon aria-hidden="true" icon={faCircleCheck} className="mr-2 text-blue-200" />
                      {item}
                    </span>
                  ))}
                </div>

                <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-5 py-2 text-sm font-black backdrop-blur">
                  Ready To Smile With Confidence?
                </span>

                <h2 id="contact-final-cta-title" className="mt-6 text-3xl font-black leading-tight md:text-5xl">
                  Book Your Dental Appointment in Jodhpur
                </h2>

                <p className="mt-5 max-w-3xl leading-8 text-white/90">
                  Whether you need a routine dental check-up, cosmetic
                  dentistry, orthodontics, dental implants or emergency
                  treatment, our experienced team is ready to provide
                  comfortable, modern and personalized dental care.
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:items-end">
                <HoverButton>
                  <Link prefetch={false}
                    href="/book-appointment"
                    aria-label="Book a dental appointment at Teeth and Gums Care"
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-white px-8 py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:w-auto sm:min-w-[250px]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faCalendarCheck} className="mr-3" />
                    Book Appointment
                  </Link>
                </HoverButton>

                <HoverButton>
                  <a
                    href="tel:+919829824356"
                    itemProp="telephone"
                    aria-label="Call Teeth and Gums Care"
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full border border-white/40 bg-transparent px-8 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-blue-700 sm:w-auto sm:min-w-[250px]"
                  >
                    <FontAwesomeIcon aria-hidden="true" icon={faPhone} className="mr-3" />
                    Call Now
                  </a>
                </HoverButton>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}

type InputProps = {
  id: string;
  name: keyof FormData;
  icon: IconDefinition;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = forwardRef<HTMLInputElement, InputProps>(
  function InputField(
    {
      id,
      name,
      icon,
      label,
      value,
      error,
      placeholder,
      type = "text",
      inputMode,
      maxLength,
      autoComplete,
      onChange,
    },
    ref,
  ) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-black text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <FontAwesomeIcon
          aria-hidden="true"
          icon={icon}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-blue-500"
        />

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-2xl border bg-white py-4 pl-12 pr-5 transition duration-300 focus:outline-none focus:ring-4 ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-blue-100 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm font-semibold text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
  },
);

function ContactInfo({
  icon,
  title,
  text,
  last = false,
}: {
  icon: IconDefinition;
  title: string;
  text: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-5 ${
        !last ? "border-b border-blue-100 pb-7" : ""
      }`}
    >
      <div aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-xl text-white shadow-lg shadow-blue-200 transition duration-300 hover:rotate-6 hover:scale-110">
        <FontAwesomeIcon icon={icon} />
      </div>

      <div>
        <h3 className="font-black text-slate-900">{title}</h3>

        <div className="mt-2 leading-7 text-slate-500">{text}</div>
      </div>
    </div>
  );
}
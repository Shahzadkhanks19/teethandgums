import { createMetadata } from "@/lib/seo";
import { faqSchema, renderJsonLd } from "@/lib/schema";

import { appointmentFaqs } from "@/components/book-appointment/appointmentData";
import BookAppointmentClient from "./BookAppointmentClient";

const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata = createMetadata({
  title: "Book Dental Appointment Online in Jodhpur",
  description:
    "Book your dental appointment online with Teeth and Gums Care, Jodhpur. Schedule consultations for dental implants, root canal treatment, smile designing, braces, cosmetic dentistry, veneers and complete family dental care.",
  canonical: "/book-appointment",
  image: "/images/og/book-appointment.jpeg",
  imageAlt: "Book a dental appointment online at Teeth and Gums Care in Jodhpur",
  keywords: [
    "Book Dentist Appointment Jodhpur",
    "Online Dental Appointment Jodhpur",
    "Dental Consultation Jodhpur",
    "Dental Clinic Appointment Jodhpur",
    "Dentist Booking Jodhpur",
    "Emergency Dentist Jodhpur",
    "Root Canal Appointment Jodhpur",
    "Dental Implant Consultation Jodhpur",
    "Smile Designing Consultation Jodhpur",
    "Cosmetic Dentist Jodhpur",
    "Dental Clinic Shastri Nagar",
    "Teeth and Gums Care",
  ],
});

const appointmentFaqSchemaData = appointmentFaqs.map((faq) => ({
  question: faq.question,
  answer: faq.answer,
}));

export default function BookAppointmentPage() {
  const appointmentPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Book Dental Appointment Online in Jodhpur",
    description:
      "Request a dental appointment with Teeth and Gums Care in Jodhpur by selecting a treatment, preferred dentist, date, and available time slot.",
    url: `${siteUrl}/book-appointment`,
    isPartOf: {
      "@type": "WebSite",
      name: "Teeth and Gums Care",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "Dentist",
      name: "Teeth and Gums Care",
      url: siteUrl,
      telephone: "+919829824356",
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/book-appointment`,
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "Dental appointment request",
        },
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
        name: "Book Appointment",
        item: `${siteUrl}/book-appointment`,
      },
    ],
  };

  return (
    <>
      {renderJsonLd(
        faqSchema(appointmentFaqSchemaData),
        "appointment-faq-schema",
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(appointmentPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />

      <BookAppointmentClient />
    </>
  );
}
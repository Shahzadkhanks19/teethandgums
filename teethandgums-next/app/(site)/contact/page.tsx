import ContactClient from "./ContactClient";

import { contactFaqs } from "@/data/contactFaqs";
import { createMetadata } from "@/lib/seo";
import { faqSchema, renderJsonLd } from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata = createMetadata({
  title: "Contact Dentist in Jodhpur",
  description:
    "Contact Teeth and Gums Care at E-32, Shastri Nagar, Kalpatru Shopping Centre, near CLG Institute, Jodhpur for appointments, consultations and emergency dental care.",
  canonical: "/contact",
  image: "/images/og/contact.jpeg",
  imageAlt: "Contact Teeth and Gums Care Dental Clinic in Jodhpur",
  keywords: [
    "Contact Dentist in Jodhpur",
    "Dental Clinic in Shastri Nagar Jodhpur",
    "Dentist Near CLG Institute Jodhpur",
    "Dental Clinic Near Me",
    "Book Dentist Appointment Jodhpur",
    "Emergency Dentist Jodhpur",
    "Dental Consultation Jodhpur",
    "Teeth and Gums Care Contact",
    "Dentist Phone Number Jodhpur",
    "Dental Clinic Address Jodhpur",
  ],
});


export default function ContactPage() {
  const faqItems = contactFaqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Teeth and Gums Care",
    description:
      "Contact Teeth and Gums Care Dental Clinic in Jodhpur for appointments, consultations, treatment information, and emergency dental care.",
    url: `${siteUrl}/contact`,
    isPartOf: {
      "@type": "WebSite",
      name: "Teeth and Gums Care",
      url: siteUrl,
    },
    mainEntity: {
      "@type": "Dentist",
      name: "Teeth and Gums Care",
      telephone: "+919829824356",
      email: "sunitakhetani@gmail.com",
      url: siteUrl,
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
        name: "Contact",
        item: `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <>
      {renderJsonLd(faqSchema(faqItems), "contact-faq-schema")}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(contactPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />

      <ContactClient />
    </>
  );
}
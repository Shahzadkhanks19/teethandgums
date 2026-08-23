import { galleryImages } from "@/data/gallery";
import { createMetadata } from "@/lib/seo";

import GalleryClient from "./GalleryClient";

const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata = createMetadata({
  title: "Dental Clinic Gallery in Jodhpur",

  description:
    "Explore the modern facilities of Teeth and Gums Care, Jodhpur. View our dental clinic, treatment rooms, advanced equipment, experienced dentists and patient-friendly environment.",

  canonical: "/gallery",

  image: "/images/og/gallery.jpeg",

  imageAlt: "Gallery of Teeth and Gums Care Dental Clinic in Jodhpur",

  keywords: [
    "Dental Clinic Gallery Jodhpur",
    "Dental Clinic Photos Jodhpur",
    "Dental Clinic Images Jodhpur",
    "Teeth and Gums Care Gallery",
    "Best Dental Clinic in Jodhpur",
    "Modern Dental Clinic Jodhpur",
    "Dental Treatment Room Jodhpur",
    "Dental Equipment Jodhpur",
    "Dentist Clinic Interior",
    "Dental Technology Jodhpur",
    "Patient Care Dental Clinic",
    "Family Dental Clinic Jodhpur",
    "Dental Clinic Shastri Nagar",
    "Dental Clinic Near CLG Institute",
  ],
});

export default function GalleryPage() {
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Teeth and Gums Care Dental Clinic Gallery",
    description:
      "Photos of Teeth and Gums Care Dental Clinic, treatment areas, dentists, dental equipment, and patient-care environment in Jodhpur.",
    url: `${siteUrl}/gallery`,
    associatedMedia: galleryImages.map((image) => ({
      "@type": "ImageObject",
      name: image.title,
      caption: image.title,
      contentUrl: `${siteUrl}${image.image}`,
      representativeOfPage: image.id === galleryImages[0]?.id,
    })),
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
        name: "Gallery",
        item: `${siteUrl}/gallery`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(gallerySchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />

      <GalleryClient />
    </>
  );
}
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import { dentistSchema, websiteSchema } from "@/lib/schema";

import AnimationProvider from "@/components/animations/AnimationProvider";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import WebVitalsReporter from "@/components/analytics/WebVitalsReporter";
import GlobalPreloader from "@/components/layout/GlobalPreloader";
import NavigationOverlay from "@/components/layout/NavigationOverlay";
import NavigationProgress from "@/components/layout/NavigationProgress";

const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

const clinicName = "Teeth and Gums Care";

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `Best Dental Clinic in Jodhpur | ${clinicName}`,
    template: `%s | ${clinicName}`,
  },

  description:
    "Teeth and Gums Care provides advanced dental treatments, root canal treatment, dental implants, aligners, smile designing, and complete oral healthcare in Jodhpur.",

  keywords: [
    "Best Dental Clinic in Jodhpur",
    "Best Dentist in Jodhpur",
    "Dentist Near Me",
    "Dental Clinic Near Me",
    "Dental Implants Jodhpur",
    "Root Canal Treatment Jodhpur",
    "Single Sitting Root Canal Jodhpur",
    "Smile Designing Jodhpur",
    "Cosmetic Dentistry Jodhpur",
    "Orthodontist Jodhpur",
    "Dental Veneers Jodhpur",
    "Teeth Whitening Jodhpur",
    "Invisible Aligners Jodhpur",
    "Painless Tooth Extraction",
    "Periodontist Jodhpur",
    "Dental Surgeon Jodhpur",
    "Emergency Dentist Jodhpur",
    "Teeth and Gums Care",
    "Dental Hospital Jodhpur",
  ],

  applicationName: clinicName,
  manifest: "/site.webmanifest",

  authors: [{ name: clinicName }],
  creator: clinicName,
  publisher: clinicName,

  category: "health",

  openGraph: {
    title: `Best Dental Clinic in Jodhpur | ${clinicName}`,
    description:
      "Advanced dental treatments, implants, root canal, aligners, smile designing, and complete oral healthcare in Jodhpur.",
    siteName: clinicName,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/og/home.jpeg",
        width: 1200,
        height: 630,
        alt: "Teeth and Gums Care Dental Clinic in Jodhpur",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `Best Dental Clinic in Jodhpur | ${clinicName}`,
    description:
      "Advanced dental treatments, implants, root canal, aligners, smile designing, and complete oral healthcare in Jodhpur.",
    images: ["/images/og/home.webp"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "Cml0cgoX2W4Z1d7ZJGuqEnCfQK2jUuElBYqZCikGcL0",
  },

  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Jodhpur",
    "geo.position": "26.273559735209204;73.0042402",
    ICBM: "26.273559735209204,73.0042402",
    "DC.title": clinicName,
    "DC.creator": clinicName,
    "DC.subject": "Dental Clinic",
    "DC.language": "en-IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d6efd",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchemas = [dentistSchema(), websiteSchema()];

  return (
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body>
        <GoogleAnalytics />
        <WebVitalsReporter />
        <GlobalPreloader />

        <AnimationProvider>
          <Suspense fallback={null}>
            <NavigationProgress />
            <NavigationOverlay />
          </Suspense>

          {globalSchemas.map((schema, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: serializeJsonLd(schema),
              }}
            />
          ))}

          <Toaster
            position="top-right"
            containerStyle={{
              top: 90,
              right: 20,
              zIndex: 999999,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                fontWeight: "600",
                padding: "14px 16px",
              },
              success: {
                duration: 3500,
              },
              error: {
                duration: 4500,
              },
            }}
          />

          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}

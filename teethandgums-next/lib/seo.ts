import type { Metadata } from "next";

export const clinicName = "Teeth and Gums Care";

export const siteUrl = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  "https://www.shahzadtestsite.co.in"
).replace(/\/$/, "");

export const defaultOgImage = "/images/og/home.jpeg";

type CreateMetadataProps = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

function createAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path === "/") {
    return siteUrl;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  canonical,
  keywords = [],
  image = defaultOgImage,
  imageAlt,
  noIndex = false,
}: CreateMetadataProps): Metadata {
  const canonicalUrl = createAbsoluteUrl(canonical);
  const imageUrl = createAbsoluteUrl(image);

  const shouldIndex = !noIndex;

  return {
    title,
    description,

    keywords: Array.from(
      new Set([
        ...keywords,
        clinicName,
        "Dentist in Jodhpur",
        "Dental Clinic in Jodhpur",
      ]),
    ),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${title} | ${clinicName}`,
      description,
      url: canonicalUrl,
      siteName: clinicName,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || `${title} | ${clinicName}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | ${clinicName}`,
      description,
      images: [
        {
          url: imageUrl,
          alt: imageAlt || `${title} | ${clinicName}`,
        },
      ],
    },

    robots: shouldIndex
      ? {
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
        }
      : {
          index: false,
          follow: false,
          noarchive: true,
          nocache: true,
          nosnippet: true,
          googleBot: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
            noimageindex: true,
          },
        },
  };
}
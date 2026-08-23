import { servicesData, type Service } from "@/data/services";

import { clinicName, siteUrl } from "@/lib/seo";

/* =========================================================
   SHARED BUSINESS DETAILS
========================================================= */

const normalizedSiteUrl = siteUrl.replace(/\/$/, "");

const clinicPhone = "+919829824356";
const clinicEmail = "sunitakhetani@gmail.com";

const clinicAddress = {
  "@type": "PostalAddress",
  streetAddress:
    "E-32, Shastri Nagar, Kalpatru Shopping Centre, Near CLG Institute",
  addressLocality: "Jodhpur",
  addressRegion: "Rajasthan",
  postalCode: "342003",
  addressCountry: "IN",
};

const clinicLogoUrl = `${normalizedSiteUrl}/images/logo/logo.webp`;
const clinicOgImageUrl = `${normalizedSiteUrl}/images/og/home.jpeg`;

const clinicEntityId = `${normalizedSiteUrl}/#clinic`;
const organizationEntityId = `${normalizedSiteUrl}/#organization`;
const websiteEntityId = `${normalizedSiteUrl}/#website`;



const socialProfiles: string[] = [
  "https://www.facebook.com/profile.php?id=61590941001711",
  "https://www.instagram.com/teethandgumscare",
];

/* =========================================================
   HELPERS
========================================================= */

function createAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path === "/") {
    return normalizedSiteUrl;
  }

  return `${normalizedSiteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function renderJsonLd(
  schema: Record<string, unknown> | Record<string, unknown>[],
  key?: string | number,
) {
  return (
    <script
      key={key}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/* =========================================================
   BREADCRUMB SCHEMA
========================================================= */

export function breadcrumbSchema(
  items: Array<{
    name: string;
    url: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: createAbsoluteUrl(item.url),
    })),
  };
}

/* =========================================================
   FAQ SCHEMA
========================================================= */

export function faqSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* =========================================================
   ORGANIZATION SCHEMA
========================================================= */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationEntityId,

    name: clinicName,
    alternateName: "Teeth & Gums Care",

    url: normalizedSiteUrl,

    logo: {
      "@type": "ImageObject",
      url: clinicLogoUrl,
      contentUrl: clinicLogoUrl,
      caption: `${clinicName} logo`,
    },

    image: {
      "@type": "ImageObject",
      url: clinicOgImageUrl,
      contentUrl: clinicOgImageUrl,
      width: 1200,
      height: 630,
      caption: `${clinicName} Dental Clinic in Jodhpur`,
    },

    telephone: clinicPhone,
    email: clinicEmail,

    address: clinicAddress,

    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: clinicPhone,
        contactType: "appointments",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        telephone: clinicPhone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],

    ...(socialProfiles.length > 0
      ? {
          sameAs: socialProfiles,
        }
      : {}),
  };
}

/* =========================================================
   LOCAL BUSINESS SCHEMA
========================================================= */

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MedicalBusiness"],
    "@id": clinicEntityId,

    name: clinicName,
    alternateName: "Teeth & Gums Care",

    description:
      "Teeth and Gums Care is a dental clinic in Jodhpur providing dental implants, root canal treatment, smile designing, cosmetic dentistry, orthodontic treatment and complete oral healthcare.",

    url: normalizedSiteUrl,
    telephone: clinicPhone,
    email: clinicEmail,

    logo: clinicLogoUrl,
    image: [clinicOgImageUrl],

    address: clinicAddress,

    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.273559735209204,
      longitude: 73.0042402,
    },

    hasMap: "https://maps.app.goo.gl/7sTEyAz67qvWKfdg6",

    areaServed: [
      {
        "@type": "City",
        name: "Jodhpur",
      },
      {
        "@type": "AdministrativeArea",
        name: "Rajasthan",
      },
    ],

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "17:30",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "15:00",
      },
    ],

    priceRange: "₹₹",
    currenciesAccepted: "INR",

    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Online Payment",
    ],

    availableLanguage: ["English", "Hindi"],

    parentOrganization: {
      "@id": organizationEntityId,
    },

    ...(socialProfiles.length > 0
      ? {
          sameAs: socialProfiles,
        }
      : {}),
  };
}

/* =========================================================
   DENTIST SCHEMA
========================================================= */

export function dentistSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic"],
    "@id": clinicEntityId,

    name: clinicName,
    alternateName: "Teeth & Gums Care",

    description:
      "Advanced dental clinic in Jodhpur providing preventive, restorative, cosmetic, implant and orthodontic dental treatments.",

    url: normalizedSiteUrl,
    telephone: clinicPhone,
    email: clinicEmail,

    logo: clinicLogoUrl,
    image: [clinicOgImageUrl],

    address: clinicAddress,

    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.273559735209204,
      longitude: 73.0042402,
    },

    hasMap: "https://maps.app.goo.gl/7sTEyAz67qvWKfdg6",

    medicalSpecialty: "Dentistry",

    availableService: servicesData.map((service) => ({
      "@type": "MedicalProcedure",
      name: service.title,
      description: service.shortDesc || service.description,
      url: `${normalizedSiteUrl}/services/${service.slug}`,
      provider: {
        "@id": clinicEntityId,
      },
      areaServed: {
        "@type": "City",
        name: "Jodhpur",
      },
    })),

    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "17:30",
        closes: "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "15:00",
      },
    ],

    areaServed: {
      "@type": "City",
      name: "Jodhpur",
    },

    priceRange: "₹₹",
    currenciesAccepted: "INR",

    paymentAccepted: [
      "Cash",
      "Credit Card",
      "Debit Card",
      "UPI",
      "Online Payment",
    ],

    availableLanguage: ["English", "Hindi"],

    parentOrganization: {
      "@id": organizationEntityId,
    },

    ...(socialProfiles.length > 0
      ? {
          sameAs: socialProfiles,
        }
      : {}),
  };
}

/* =========================================================
   WEBSITE SCHEMA
========================================================= */

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteEntityId,

    name: clinicName,
    alternateName: "Teeth & Gums Care",

    url: normalizedSiteUrl,

    description:
      "Official website of Teeth and Gums Care Dental Clinic in Jodhpur.",

    publisher: {
      "@id": organizationEntityId,
    },

    inLanguage: "en-IN",

    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${normalizedSiteUrl}/services?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* =========================================================
   IMAGE OBJECT SCHEMA
========================================================= */

export function imageObjectSchema({
  url,
  caption,
  width,
  height,
}: {
  url: string;
  caption: string;
  width?: number;
  height?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: createAbsoluteUrl(url),
    url: createAbsoluteUrl(url),
    caption,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

/* =========================================================
   MEDICAL PROCEDURE SCHEMA
========================================================= */

export function medicalProcedureSchema(service: Service) {
  const serviceUrl = `${normalizedSiteUrl}/services/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${serviceUrl}/#procedure`,

    name: service.title,
    description: service.shortDesc || service.description,
    url: serviceUrl,

    procedureType: "DentalProcedure",

    medicalSpecialty: "Dentistry",

    provider: {
      "@id": clinicEntityId,
    },

    availableAtOrFrom: {
      "@id": clinicEntityId,
    },

    areaServed: {
      "@type": "City",
      name: "Jodhpur",
    },
  };
}

/* =========================================================
   SERVICE SCHEMA
========================================================= */

export function serviceSchema(service: Service) {
  const serviceUrl = `${normalizedSiteUrl}/services/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}/#service`,

    name: service.title,
    description: service.shortDesc || service.description,
    url: serviceUrl,

    serviceType: service.title,

    provider: {
      "@id": clinicEntityId,
    },

    areaServed: {
      "@type": "City",
      name: "Jodhpur",
    },

    audience: {
      "@type": "Audience",
      audienceType: "Dental patients",
    },
  };
}

/* =========================================================
   SERVICE PAGE SCHEMAS
========================================================= */

export function servicePageSchemas(service: Service) {
  const schemas: Record<string, unknown>[] = [
    medicalProcedureSchema(service),
    serviceSchema(service),

    breadcrumbSchema([
      {
        name: "Home",
        url: "/",
      },
      {
        name: "Services",
        url: "/services",
      },
      {
        name: service.title,
        url: `/services/${service.slug}`,
      },
    ]),
  ];

  if (Array.isArray(service.faqs) && service.faqs.length > 0) {
    schemas.push(faqSchema(service.faqs));
  }

  return schemas;
}

/* =========================================================
   OPTIONAL AGGREGATE RATING SCHEMA
========================================================= */

/*
 Only use this function with genuine, visible and verifiable review data.

 Do not create or estimate ratings.
 Do not add it until real review information is displayed on the website.
*/

export function aggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@id": clinicEntityId,
    },
    ratingValue,
    reviewCount,
    bestRating,
    worstRating,
  };
}

/* =========================================================
   OPTIONAL INDIVIDUAL REVIEW SCHEMA
========================================================= */

/*
 Only output reviews that are genuinely published and visible to users.
*/

export function reviewSchema({
  authorName,
  reviewBody,
  ratingValue,
  datePublished,
}: {
  authorName: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",

    itemReviewed: {
      "@id": clinicEntityId,
    },

    author: {
      "@type": "Person",
      name: authorName,
    },

    reviewBody,

    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },

    ...(datePublished ? { datePublished } : {}),
  };
}

/* =========================================================
   ROOT WEBSITE SCHEMA GRAPH
========================================================= */

export function rootSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      localBusinessSchema(),
      dentistSchema(),
      websiteSchema(),
    ].map((schema) =>
      Object.fromEntries(
        Object.entries(schema).filter(
          ([key]) => key !== "@context",
        ),
      ),
    ),
  };
}
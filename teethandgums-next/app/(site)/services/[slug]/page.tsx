import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { servicesData } from "@/data/services";
import { createMetadata } from "@/lib/seo";
import { servicePageSchemas } from "@/lib/schema";

import ServiceHero from "@/components/services/ServiceHero";
import ServiceAbout from "@/components/services/ServiceAbout";
import ServiceInfoCards from "@/components/services/ServiceInfoCards";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceCare from "@/components/services/ServiceCare";
import ServiceWhyChoose from "@/components/services/ServiceWhyChoose";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";

import { HoverButton } from "@/components/animations";

import ServiceIcon from "@/components/services/ServiceIcon";
function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

function createServiceDescription(
  service: (typeof servicesData)[number],
): string {
  const fallbackDescription = `Learn about ${service.title} treatment at Teeth and Gums Care, a trusted dental clinic in Jodhpur providing modern and personalized dental care.`;

  const rawDescription =
    typeof service.shortDesc === "string" &&
    service.shortDesc.trim().length > 0
      ? service.shortDesc.trim()
      : fallbackDescription;

  if (rawDescription.length <= 160) {
    return rawDescription;
  }

  const shortenedDescription = rawDescription.slice(0, 157);
  const lastSpaceIndex = shortenedDescription.lastIndexOf(" ");

  const safeEndIndex =
    lastSpaceIndex >= 120 ? lastSpaceIndex : 157;

  return `${shortenedDescription.slice(0, safeEndIndex)}...`;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  const service = servicesData.find(
    (item) => item.slug === slug,
  );

  if (!service) {
    return createMetadata({
      title: "Dental Service Not Found",
      description:
        "The requested dental treatment could not be found at Teeth and Gums Care.",
      canonical: "/services",
      image: "/images/og/services.jpeg",
      imageAlt:
        "Dental services at Teeth and Gums Care in Jodhpur",
      noIndex: true,
    });
  }

  const title = `${service.title} in Jodhpur`;
  const description = createServiceDescription(service);

  return createMetadata({
    title,
    description,
    canonical: `/services/${service.slug}`,

    image: service.ogImage || "/images/og/services.jpeg",

    imageAlt: `${service.title} treatment at Teeth and Gums Care Dental Clinic in Jodhpur`,

    keywords: [
      `${service.title} in Jodhpur`,
      `${service.title} Jodhpur`,
      `Best ${service.title} in Jodhpur`,
      `${service.title} Treatment Jodhpur`,
      `${service.title} Dentist Jodhpur`,
      `${service.title} Dental Clinic Jodhpur`,
      "Dentist in Jodhpur",
      "Dental Clinic in Jodhpur",
      "Dentist in Shastri Nagar Jodhpur",
      "Teeth and Gums Care",
    ],
  });
}

export default async function ServiceDetailsPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;

  const service = servicesData.find(
    (item) => item.slug === slug,
  );

  if (!service) {
    notFound();
  }

  const schemas = servicePageSchemas(service);

  return (
    <main id="main-content" tabIndex={-1} className="overflow-x-hidden outline-none">
      {schemas.map((schema, index) => (
        <script
          key={`service-schema-${service.slug}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(schema),
          }}
        />
      ))}

      <ServiceHero service={service} />

      <nav
        aria-label="Service navigation"
        className="relative z-10 scroll-mt-24 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <HoverButton>
              <Link prefetch={false}
                href="/services"
                aria-label="View all dental services at Teeth and Gums Care"
                className="group inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-6 py-3 font-black text-blue-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <ServiceIcon
                  aria-hidden="true"
                  className="fa-solid fa-arrow-left mr-2 transition duration-300 group-hover:-translate-x-1"
                />

                View All Dental Services
              </Link>
            </HoverButton>
        </div>
      </nav>

      <ServiceAbout service={service} />
      <ServiceInfoCards service={service} />
      <ServiceProcess service={service} />
      <ServiceCare service={service} />
      <ServiceWhyChoose />
      <ServiceFAQ service={service} />
      <ServiceCTA service={service} />
    </main>
  );
}
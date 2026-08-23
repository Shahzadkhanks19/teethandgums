import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",

  `script-src 'self' 'unsafe-inline'${
    isDevelopment ? " 'unsafe-eval'" : ""
  } https://maps.googleapis.com https://maps.gstatic.com https://www.googletagmanager.com`,

  "style-src 'self' 'unsafe-inline'",

  "font-src 'self' data:",

  [
    "img-src 'self' data: blob: https:",
    "https://maps.gstatic.com",
    "https://maps.googleapis.com",
    "https://*.googleusercontent.com",
  ].join(" "),

  [
    "connect-src 'self' https: wss: https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
    ...(isDevelopment
      ? [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://localhost:5001",
          "ws://localhost:5001",
        ]
      : []),
  ].join(" "),

  [
    "frame-src 'self'",
    "https://www.google.com",
    "https://maps.google.com",
  ].join(" "),

  "media-src 'self' data: blob: https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",

  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  ...(isDevelopment
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,

  allowedDevOrigins: isDevelopment
    ? ["192.168.1.4"]
    : undefined,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [65, 70, 72, 75, 80, 85, 90, 95],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/rss.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
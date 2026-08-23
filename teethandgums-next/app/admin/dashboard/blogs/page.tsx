import type { Metadata } from "next";

import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blog Manager | Admin Dashboard",
  description:
    "Create, review, publish, schedule, archive and manage dental blog articles for Teeth and Gums Care.",
  robots: {
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

export default function BlogsPage() {
  return <BlogsClient />;
}

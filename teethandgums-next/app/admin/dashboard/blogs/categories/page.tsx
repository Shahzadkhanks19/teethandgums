import type { Metadata } from "next";

import BlogCategoriesClient from "./BlogCategoriesClient";

export const metadata: Metadata = {
  title: "Blog Categories | Admin Dashboard",
  description:
    "Manage dental blog categories for Teeth and Gums Care.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function BlogCategoriesPage() {
  return <BlogCategoriesClient />;
}

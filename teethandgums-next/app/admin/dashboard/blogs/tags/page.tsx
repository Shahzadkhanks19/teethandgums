import type { Metadata } from "next";

import BlogTagsClient from "./BlogTagsClient";

export const metadata: Metadata = {
  title: "Blog Tags | Admin Dashboard",
  description:
    "Review, merge and remove dental blog tags.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function BlogTagsPage() {
  return <BlogTagsClient />;
}

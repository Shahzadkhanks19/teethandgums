import type { Metadata } from "next";

import BlogEditorClient from "@/components/admin/blog/BlogEditorClient";

export const metadata: Metadata = {
  title: "Create Blog | Admin Dashboard",
  description:
    "Create a new dental blog article for Teeth and Gums Care.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function CreateBlogPage() {
  return <BlogEditorClient />;
}

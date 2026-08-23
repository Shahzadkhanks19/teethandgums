import type { Metadata } from "next";

import BlogEditorClient from "@/components/admin/blog/BlogEditorClient";

export const metadata: Metadata = {
  title: "Edit Blog | Admin Dashboard",
  description:
    "Edit a dental blog article for Teeth and Gums Care.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BlogEditorClient blogId={id} />;
}

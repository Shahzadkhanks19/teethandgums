import type { Metadata } from "next";

export const revalidate = 300;

import { createBlogListingMetadata } from "@/lib/blogSeo";
import { notFound } from "next/navigation";

import {
  getPublicBlogCategories,
  getPublicBlogs,
} from "@/lib/publicBlog";

import BlogCollectionPage from "@/components/blog/BlogCollectionPage";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getPublicBlogCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "Blog Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createBlogListingMetadata({
    title: `${category.name} Dental Articles`,
    description: `Read Teeth and Gums Care articles filed under ${category.name}.`,
    canonical: `/blog/category/${category.slug}`,
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const page = Math.max(
    1,
    Number.parseInt(query.page || "1", 10) || 1,
  );

  const [categories, result] = await Promise.all([
    getPublicBlogCategories(),
    getPublicBlogs({
      categorySlug: slug,
      page,
    }),
  ]);

  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  return (
    <BlogCollectionPage
      eyebrow="Dental Blog Category"
      title={category.name}
      description={`Browse patient-friendly dental articles and treatment guidance in ${category.name}.`}
      blogs={result.blogs}
      page={result.page}
      pages={result.pages}
      total={result.total}
      basePath={`/blog/category/${category.slug}`}
    />
  );
}

import type { Metadata } from "next";

export const revalidate = 300;

import { createBlogListingMetadata } from "@/lib/blogSeo";

import { getPublicBlogs } from "@/lib/publicBlog";

import BlogCollectionPage from "@/components/blog/BlogCollectionPage";

type TagPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = decodeURIComponent(slug).toLowerCase();

  return createBlogListingMetadata({
    title: `#${tag} Dental Articles`,
    description: `Browse Teeth and Gums Care dental articles tagged ${tag}.`,
    canonical: `/blog/tag/${encodeURIComponent(tag)}`,
  });
}

export default async function BlogTagPage({
  params,
  searchParams,
}: TagPageProps) {
  const [{ slug }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const tag = decodeURIComponent(slug).trim().toLowerCase();
  const page = Math.max(
    1,
    Number.parseInt(query.page || "1", 10) || 1,
  );

  const result = await getPublicBlogs({
    tag,
    page,
  });

  return (
    <BlogCollectionPage
      eyebrow="Dental Blog Tag"
      title={`#${tag}`}
      description={`Articles connected to the ${tag} topic.`}
      blogs={result.blogs}
      page={result.page}
      pages={result.pages}
      total={result.total}
      basePath={`/blog/tag/${encodeURIComponent(tag)}`}
    />
  );
}

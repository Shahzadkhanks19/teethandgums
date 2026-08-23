import type { Metadata } from "next";

import { createBlogListingMetadata } from "@/lib/blogSeo";

import { getPublicBlogs } from "@/lib/publicBlog";

import BlogCollectionPage from "@/components/blog/BlogCollectionPage";

export const metadata: Metadata = createBlogListingMetadata({
  title: "Search Dental Articles",
  description:
    "Search Teeth and Gums Care dental articles, treatment guides and oral-health information.",
  canonical: "/blog/search",
  noIndex: true,
});

type BlogSearchPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function BlogSearchPage({
  searchParams,
}: BlogSearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim().slice(0, 100);
  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const result =
    query.length >= 2
      ? await getPublicBlogs({
          search: query,
          page,
        })
      : {
          blogs: [],
          page: 1,
          pages: 1,
          total: 0,
        };

  return (
    <BlogCollectionPage
      eyebrow="Search Dental Articles"
      title={
        query.length >= 2
          ? `Results for “${query}”`
          : "Search the Dental Blog"
      }
      description={
        query.length >= 2
          ? "Review the most relevant guides from our dental knowledge library."
          : "Enter at least two characters to search treatments, topics and oral-health guides."
      }
      blogs={result.blogs}
      page={result.page}
      pages={result.pages}
      total={result.total}
      basePath="/blog/search"
      paginationParams={query ? { q: query } : {}}
    />
  );
}

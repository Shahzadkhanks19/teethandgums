import type { Metadata } from "next";

import { createBlogListingMetadata } from "@/lib/blogSeo";
import Link from "next/link";

import {
  getFeaturedBlog,
  getPopularBlogs,
  getPopularTags,
  getTrendingBlogs,
  getPublicBlogCategories,
  getPublicBlogs,
} from "@/lib/publicBlog";

import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSearchForm from "@/components/blog/BlogSearchForm";
import FeaturedBlog from "@/components/blog/FeaturedBlog";
import NewsletterSignup from "@/components/blog/NewsletterSignup";

export const revalidate = 300;

export const metadata: Metadata = createBlogListingMetadata({
  title: "Dental Health Blog",
  description:
    "Read expert dental care guides about implants, braces, root canal treatment, gum health, smile care and preventive dentistry.",
  canonical: "/blog",
});

type BlogPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const [featured, latest, categories, tags, popular, trending] =
    await Promise.all([
      getFeaturedBlog(),
      getPublicBlogs({
        page,
        excludeSlug: page === 1 ? undefined : "",
      }),
      getPublicBlogCategories(),
      getPopularTags(),
      getPopularBlogs(4),
      getTrendingBlogs(4),
    ]);

  const visibleBlogs =
    page === 1 && featured
      ? latest.blogs.filter((blog) => blog.slug !== featured.slug)
      : latest.blogs;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/80 via-white to-white">
      <section className="border-b border-blue-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            Teeth and Gums Care Blog
          </span>

          <div className="mt-5 grid gap-7 lg:grid-cols-[1fr_.75fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Better dental decisions start with reliable information.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Practical oral-health guides prepared to help patients
                understand treatments, prevention and long-term smile care.
              </p>
            </div>

            <BlogSearchForm />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {featured && page === 1 && (
          <section aria-labelledby="featured-blog-title">
            <h2 id="featured-blog-title" className="sr-only">
              Featured article
            </h2>
            <FeaturedBlog blog={featured} />
          </section>
        )}

        {categories.length > 0 && (
          <section aria-labelledby="blog-categories-title">
            <div className="mb-6">
              <h2
                id="blog-categories-title"
                className="text-2xl font-black text-slate-900"
              >
                Explore by Category
              </h2>
              <p className="mt-2 text-slate-500">
                Find guidance for the treatment or concern that matters to you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug}`}
                  className="rounded-2xl border border-blue-100 bg-white px-5 py-3 font-black shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300"
                  style={{ color: category.color }}
                >
                  {category.name}
                  <span className="ml-2 text-xs text-slate-400">
                    {category.blogCount}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="latest-articles-title">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="latest-articles-title"
                className="text-3xl font-black text-slate-900"
              >
                Latest Dental Articles
              </h2>
              <p className="mt-2 text-slate-500">
                Fresh guides and patient-friendly explanations.
              </p>
            </div>

            <span className="font-bold text-slate-500">
              {latest.total} published article
              {latest.total === 1 ? "" : "s"}
            </span>
          </div>

          {visibleBlogs.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              <BlogPagination
                page={latest.page}
                pages={latest.pages}
                basePath="/blog"
              />
            </>
          ) : (
            <div className="rounded-[28px] border border-blue-100 bg-white px-6 py-16 text-center">
              <h2 className="text-2xl font-black text-slate-900">
                Articles are coming soon
              </h2>
              <p className="mt-3 text-slate-500">
                Published blog posts will automatically appear here.
              </p>
            </div>
          )}
        </section>


        {page === 1 && (popular.length > 0 || trending.length > 0) && (
          <section className="grid gap-6 lg:grid-cols-2" aria-label="Discover more dental articles">
            {[
              { title: "Popular Articles", items: popular },
              { title: "Trending This Month", items: trending },
            ].map((group) => (
              <div key={group.title} className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900">{group.title}</h2>
                <div className="mt-5 space-y-4">
                  {group.items.map((item, index) => (
                    <Link key={item._id} href={`/blog/${item.slug}`} className="group flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 font-black text-blue-700">{index + 1}</span>
                      <span>
                        <span className="block font-black leading-6 text-slate-900 transition group-hover:text-blue-700">{item.title}</span>
                        <span className="mt-1 block text-sm font-semibold text-slate-500">{item.readingTime} min read · {item.views.toLocaleString("en-IN")} views</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {page === 1 && <NewsletterSignup />}

        {tags.length > 0 && (
          <section
            aria-labelledby="popular-tags-title"
            className="rounded-[30px] border border-blue-100 bg-blue-950 p-6 text-white md:p-9"
          >
            <h2
              id="popular-tags-title"
              className="text-2xl font-black"
            >
              Popular Topics
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/blog/tag/${encodeURIComponent(tag.name)}`}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black transition hover:bg-white hover:text-blue-950"
                >
                  #{tag.name}
                  <span className="ml-2 opacity-70">{tag.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

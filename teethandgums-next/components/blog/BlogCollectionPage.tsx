import Link from "next/link";

import type { PublicBlogCard } from "@/lib/publicBlog";

import BlogCard from "./BlogCard";
import BlogPagination from "./BlogPagination";
import BlogSearchForm from "./BlogSearchForm";

export default function BlogCollectionPage({
  eyebrow,
  title,
  description,
  blogs,
  page,
  pages,
  total,
  basePath,
  paginationParams = {},
  showSearch = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  blogs: PublicBlogCard[];
  page: number;
  pages: number;
  total: number;
  basePath: string;
  paginationParams?: Record<string, string>;
  showSearch?: boolean;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-white">
      <section className="border-b border-blue-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            {eyebrow}
          </span>

          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {description}
          </p>

          {showSearch && (
            <div className="mt-8 max-w-3xl">
              <BlogSearchForm />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {total === 1 ? "1 Article" : `${total} Articles`}
            </h2>
            <p className="mt-1 text-slate-500">
              Reliable information prepared for better oral health decisions.
            </p>
          </div>

          <Link
            href="/blog"
            className="font-black text-blue-700 hover:text-blue-950"
          >
            View all articles
          </Link>
        </div>

        {blogs.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            <BlogPagination
              page={page}
              pages={pages}
              basePath={basePath}
              params={paginationParams}
            />
          </>
        ) : (
          <div className="rounded-[28px] border border-blue-100 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">
              No articles found
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
              Try a different search, category or tag.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex rounded-2xl bg-blue-700 px-6 py-3 font-black text-white"
            >
              Browse All Articles
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

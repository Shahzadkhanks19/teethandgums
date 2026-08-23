import Link from "next/link";

import type { PublicBlogCard } from "@/lib/publicBlog";

import BlogImage from "./BlogImage";

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value || fallback));
}

export default function BlogCard({
  blog,
}: {
  blog: PublicBlogCard;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(37,99,235,.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(37,99,235,.16)]">
      <Link
        href={`/blog/${blog.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-blue-50"
        aria-label={`Read ${blog.title}`}
      >
        <BlogImage
          src={blog.featuredImage}
          alt={blog.featuredImageAlt || blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        {blog.category && (
          <span
            className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-black shadow-sm"
            style={{ color: blog.category.color }}
          >
            {blog.category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
          <span>{formatDate(blog.publishedAt, blog.createdAt)}</span>
          <span aria-hidden="true">•</span>
          <span>{blog.readingTime} min read</span>
        </div>

        <h2 className="mt-4 text-xl font-black leading-tight text-slate-900">
          <Link
            href={`/blog/${blog.slug}`}
            className="transition hover:text-blue-700"
          >
            {blog.title}
          </Link>
        </h2>

        <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex min-h-11 items-center rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700 transition hover:bg-blue-700 hover:text-white"
          >
            Read Article
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

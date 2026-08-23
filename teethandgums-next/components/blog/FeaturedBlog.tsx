import Link from "next/link";

import type { PublicBlogCard } from "@/lib/publicBlog";

import BlogImage from "./BlogImage";

export default function FeaturedBlog({
  blog,
}: {
  blog: PublicBlogCard;
}) {
  return (
    <article className="grid overflow-hidden rounded-[34px] border border-blue-100 bg-white shadow-[0_22px_75px_rgba(37,99,235,.13)] lg:grid-cols-[1.15fr_.85fr]">
      <Link
        href={`/blog/${blog.slug}`}
        className="relative min-h-[320px] overflow-hidden bg-blue-50 lg:min-h-[470px]"
      >
        <BlogImage
          src={blog.featuredImage}
          alt={blog.featuredImageAlt || blog.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition duration-700 hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
        <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-blue-700">
          Featured Dental Guide
        </span>

        {blog.category && (
          <Link
            href={`/blog/category/${blog.category.slug}`}
            className="mt-5 w-fit text-sm font-black"
            style={{ color: blog.category.color }}
          >
            {blog.category.name}
          </Link>
        )}

        <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
          <Link
            href={`/blog/${blog.slug}`}
            className="transition hover:text-blue-700"
          >
            {blog.title}
          </Link>
        </h2>

        <p className="mt-5 leading-8 text-slate-600">
          {blog.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
          <span>{blog.authorName}</span>
          <span aria-hidden="true">•</span>
          <span>{blog.readingTime} min read</span>
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="mt-8 inline-flex min-h-12 w-fit items-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-3 font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
        >
          Read Featured Article
          <span aria-hidden="true" className="ml-3">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

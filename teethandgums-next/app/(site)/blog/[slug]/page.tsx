import type { Metadata } from "next";

export const revalidate = 300;
import Link from "next/link";
import { notFound } from "next/navigation";

import { prepareBlogContent } from "@/lib/blogContent";
import { createBlogArticleMetadata } from "@/lib/blogSeo";
import { getBlogSchemas } from "@/lib/blogSchema";
import {
  getAdjacentPublicBlogs,
  getPublicBlogBySlug,
  getRelatedPublicBlogs,
} from "@/lib/publicBlog";

import ArticleAuthorCard from "@/components/blog/ArticleAuthorCard";
import ArticleExperience from "@/components/blog/ArticleExperience";
import ArticleNavigation from "@/components/blog/ArticleNavigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogImage from "@/components/blog/BlogImage";
import JsonLd from "@/components/seo/JsonLd";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null, fallback: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value || fallback));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Teeth and Gums Care",
      robots: { index: false, follow: false },
    };
  }

  return createBlogArticleMetadata(blog);
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);

  if (!blog) notFound();

  const [{ html, toc }, related, adjacent] = await Promise.all([
    Promise.resolve(prepareBlogContent(blog.content)),
    getRelatedPublicBlogs(blog, 3),
    getAdjacentPublicBlogs(blog),
  ]);

  const publicationDate = blog.publishedAt || blog.createdAt;
  const schemas = getBlogSchemas(blog);

  return (
    <main className="min-h-screen bg-white pb-20 lg:pb-0">
      <JsonLd id="blog-structured-data" data={schemas} />
      <article>
        <header className="border-b border-blue-100 bg-gradient-to-b from-blue-50/80 to-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-18 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500"
            >
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="hover:text-blue-700">
                Blog
              </Link>
              {blog.category && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link
                    href={`/blog/category/${blog.category.slug}`}
                    className="hover:text-blue-700"
                  >
                    {blog.category.name}
                  </Link>
                </>
              )}
            </nav>

            {blog.category && (
              <Link
                href={`/blog/category/${blog.category.slug}`}
                className="mt-7 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black shadow-sm"
                style={{ color: blog.category.color }}
              >
                {blog.category.name}
              </Link>
            )}

            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {blog.title}
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
              {blog.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-bold text-slate-500">
              <span>{blog.authorName}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={publicationDate}>
                {formatDate(blog.publishedAt, blog.createdAt)}
              </time>
              <span aria-hidden="true">•</span>
              <span>{blog.readingTime} min read</span>
              <span aria-hidden="true">•</span>
              <span>{blog.views.toLocaleString("en-IN")} views</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/8.5] overflow-hidden rounded-[32px] bg-blue-50 shadow-[0_24px_80px_rgba(37,99,235,.15)]">
            <BlogImage
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
          <div className="min-w-0">
            <div
              id="blog-article-body"
              className="blog-content prose prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:font-black prose-headings:text-slate-950 prose-a:font-bold prose-a:text-blue-700 prose-img:rounded-2xl prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:px-6 prose-blockquote:py-3 prose-table:block prose-table:max-w-full prose-table:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {blog.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-blue-100 pt-7">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-700 hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <ArticleAuthorCard
              authorName={blog.authorName}
              authorRole={blog.authorRole}
              publishedAt={publicationDate}
              updatedAt={blog.updatedAt}
            />

            <ArticleNavigation
              previous={adjacent.previous}
              next={adjacent.next}
            />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <ArticleExperience slug={blog.slug} title={blog.title} toc={toc} />

            <div className="rounded-[26px] border border-blue-100 bg-blue-50/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-blue-700">
                Written By
              </p>
              <h2 className="mt-3 text-xl font-black text-slate-900">
                {blog.authorName}
              </h2>
              <p className="mt-1 font-bold text-slate-500">
                {blog.authorRole}
              </p>
            </div>

            <div className="rounded-[26px] bg-gradient-to-br from-blue-700 to-blue-950 p-5 text-white">
              <h2 className="text-xl font-black">
                Need a dental consultation?
              </h2>
              <p className="mt-3 leading-7 text-blue-100">
                Book an appointment with Teeth and Gums Care in Jodhpur.
              </p>
              <Link
                href="/appointment"
                className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 font-black text-blue-950"
              >
                Book Appointment
              </Link>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-blue-100 bg-blue-50/50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                  Continue learning
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  Related Dental Articles
                </h2>
              </div>
              <Link href="/blog" className="font-black text-blue-700 hover:text-blue-950">
                Browse all articles →
              </Link>
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item._id} blog={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

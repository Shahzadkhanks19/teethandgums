import Link from "next/link";

import type { PublicBlogCard } from "@/lib/publicBlog";

export default function ArticleNavigation({
  previous,
  next,
}: {
  previous: PublicBlogCard | null;
  next: PublicBlogCard | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="Adjacent blog articles" className="mt-12 grid gap-4 border-t border-blue-100 pt-8 md:grid-cols-2">
      {previous ? (
        <Link href={`/blog/${previous.slug}`} className="group rounded-[24px] border border-blue-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg">
          <span className="text-xs font-black uppercase tracking-[0.13em] text-blue-600">← Previous article</span>
          <span className="mt-2 block text-lg font-black leading-7 text-slate-900 transition group-hover:text-blue-700">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link href={`/blog/${next.slug}`} className="group rounded-[24px] border border-blue-100 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg md:text-right">
          <span className="text-xs font-black uppercase tracking-[0.13em] text-blue-600">Next article →</span>
          <span className="mt-2 block text-lg font-black leading-7 text-slate-900 transition group-hover:text-blue-700">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}

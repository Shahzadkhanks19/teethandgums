import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-gradient-to-b from-blue-50 to-white px-4 py-16 text-center">
      <div className="max-w-xl rounded-[32px] border border-blue-100 bg-white p-8 shadow-[0_24px_75px_rgba(37,99,235,.12)] sm:p-12">
        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
          Article Not Found
        </span>

        <h1 className="mt-6 text-4xl font-black text-slate-950">
          This dental article is unavailable.
        </h1>

        <p className="mt-4 leading-8 text-slate-600">
          It may have been moved, archived or the address may be incorrect.
        </p>

        <Link
          href="/blog"
          className="mt-7 inline-flex rounded-2xl bg-blue-700 px-6 py-3 font-black text-white"
        >
          Return to Dental Blog
        </Link>
      </div>
    </main>
  );
}

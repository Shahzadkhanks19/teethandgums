import Link from "next/link";

function buildHref(
  basePath: string,
  page: number,
  params: Record<string, string>,
) {
  const query = new URLSearchParams(params);

  if (page > 1) {
    query.set("page", String(page));
  } else {
    query.delete("page");
  }

  const value = query.toString();
  return value ? `${basePath}?${value}` : basePath;
}

export default function BlogPagination({
  page,
  pages,
  basePath,
  params = {},
}: {
  page: number;
  pages: number;
  basePath: string;
  params?: Record<string, string>;
}) {
  if (pages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  const numbers = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={buildHref(basePath, Math.max(1, page - 1), params)}
        aria-disabled={page === 1}
        className={`rounded-xl border px-4 py-2.5 text-sm font-black ${
          page === 1
            ? "pointer-events-none border-slate-200 text-slate-300"
            : "border-blue-200 text-blue-700 hover:bg-blue-50"
        }`}
      >
        Previous
      </Link>

      {numbers.map((number) => (
        <Link
          key={number}
          href={buildHref(basePath, number, params)}
          aria-current={number === page ? "page" : undefined}
          className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-black ${
            number === page
              ? "bg-blue-700 text-white"
              : "border border-blue-100 bg-white text-blue-700 hover:bg-blue-50"
          }`}
        >
          {number}
        </Link>
      ))}

      <Link
        href={buildHref(basePath, Math.min(pages, page + 1), params)}
        aria-disabled={page === pages}
        className={`rounded-xl border px-4 py-2.5 text-sm font-black ${
          page === pages
            ? "pointer-events-none border-slate-200 text-slate-300"
            : "border-blue-200 text-blue-700 hover:bg-blue-50"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}

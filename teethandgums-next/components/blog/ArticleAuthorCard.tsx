import Link from "next/link";

type ArticleAuthorCardProps = {
  authorName: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ArticleAuthorCard({
  authorName,
  authorRole,
  publishedAt,
  updatedAt,
}: ArticleAuthorCardProps) {
  const wasUpdated =
    new Date(updatedAt).getTime() - new Date(publishedAt).getTime() >
    24 * 60 * 60 * 1000;

  return (
    <section className="mt-12 rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 md:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-950 text-2xl font-black text-white shadow-lg shadow-blue-200">
          {authorName
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            Medically reviewed dental guidance
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {authorName}
          </h2>
          <p className="mt-1 font-bold text-slate-500">{authorRole}</p>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Patient-friendly oral-health information from the Teeth and Gums Care team. This guide supports informed decisions and does not replace a personal clinical examination.
          </p>
          <p className="mt-3 text-sm font-bold text-slate-500">
            Published {formatDate(publishedAt)}
            {wasUpdated ? ` · Updated ${formatDate(updatedAt)}` : ""}
          </p>
        </div>

        <Link
          href="/appointment"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 px-5 py-3 font-black text-white transition hover:bg-blue-950"
        >
          Consult the Clinic
        </Link>
      </div>
    </section>
  );
}

export default function BlogLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-white">
      <section className="border-b border-blue-100 bg-blue-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="h-8 w-48 rounded-full bg-blue-100" />
          <div className="mt-6 h-12 max-w-3xl rounded-2xl bg-slate-200" />
          <div className="mt-4 h-7 max-w-2xl rounded-xl bg-slate-100" />
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[28px] border border-blue-100"
          >
            <div className="aspect-[16/10] bg-blue-100" />
            <div className="space-y-4 p-6">
              <div className="h-5 w-1/3 rounded bg-slate-100" />
              <div className="h-8 rounded bg-slate-200" />
              <div className="h-20 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

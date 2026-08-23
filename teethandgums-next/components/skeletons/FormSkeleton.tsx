import Skeleton from "./Skeleton";

export default function FormSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="rounded-[34px] border border-blue-100 bg-white p-6 shadow-[0_28px_80px_rgba(37,99,235,.12)] sm:p-8 lg:p-10"
    >
      <Skeleton className="h-10 w-44 max-w-full rounded-full" />
      <Skeleton className="mt-5 h-9 w-72 max-w-full" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-14 rounded-2xl md:col-span-2" />
        <Skeleton className="h-40 rounded-2xl md:col-span-2" />
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-40 max-w-full rounded-full" />
          <Skeleton className="h-9 w-44 max-w-full rounded-full" />
          <Skeleton className="h-9 w-36 max-w-full rounded-full" />
        </div>

        <Skeleton className="h-14 w-full rounded-full lg:w-56" />
      </div>
    </section>
  );
}

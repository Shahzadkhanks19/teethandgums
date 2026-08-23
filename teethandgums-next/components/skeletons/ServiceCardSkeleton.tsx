import Skeleton from "./Skeleton";

export default function ServiceCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_18px_50px_rgba(37,99,235,.10)]"
    >
      <Skeleton className="aspect-square w-full rounded-none" />

      <div className="p-6 sm:p-8">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <Skeleton className="mt-6 h-7 w-52 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-2 h-4 w-4/6" />
        <Skeleton className="mt-6 h-12 w-36 rounded-full" />
      </div>
    </article>
  );
}

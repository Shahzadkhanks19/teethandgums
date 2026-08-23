import Skeleton from "./Skeleton";

export default function CardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <Skeleton className="mt-6 h-6 w-48 max-w-full" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <Skeleton className="mt-6 h-11 w-36 rounded-full" />
    </article>
  );
}

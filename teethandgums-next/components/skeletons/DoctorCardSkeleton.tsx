import Skeleton from "./Skeleton";

export default function DoctorCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
    >
      <Skeleton className="mx-auto aspect-square w-36 rounded-full" />
      <Skeleton className="mx-auto mt-6 h-6 w-44 max-w-full" />
      <Skeleton className="mx-auto mt-3 h-4 w-28" />
      <Skeleton className="mx-auto mt-6 h-10 w-36 rounded-full" />
    </article>
  );
}

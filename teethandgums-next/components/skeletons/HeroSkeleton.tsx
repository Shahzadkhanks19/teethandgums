import Skeleton from "./Skeleton";

export default function HeroSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="min-h-[520px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-5 py-28 lg:min-h-[620px] lg:py-36"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Skeleton className="mx-auto h-10 w-48 max-w-full rounded-full bg-white/20" />
        <Skeleton className="mx-auto mt-6 h-14 w-full max-w-3xl bg-white/20" />
        <Skeleton className="mx-auto mt-5 h-5 w-full max-w-2xl bg-white/20" />
        <Skeleton className="mx-auto mt-3 h-5 w-full max-w-xl bg-white/20" />

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Skeleton className="h-14 w-full rounded-full bg-white/20 sm:w-52" />
          <Skeleton className="h-14 w-full rounded-full bg-white/20 sm:w-48" />
        </div>
      </div>
    </section>
  );
}

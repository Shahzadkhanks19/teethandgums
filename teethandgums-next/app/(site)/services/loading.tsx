import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import ServiceCardSkeleton from "@/components/skeletons/ServiceCardSkeleton";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading dental services" className="overflow-x-hidden">
      <HeroSkeleton />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import ServiceCardSkeleton from "@/components/skeletons/ServiceCardSkeleton";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading dental treatment details" className="overflow-x-hidden">
      <HeroSkeleton />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <ServiceCardSkeleton />
      </section>
    </main>
  );
}
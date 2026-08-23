import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import CardSkeleton from "@/components/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading the About page" className="overflow-x-hidden">
      <HeroSkeleton />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </section>
    </main>
  );
}
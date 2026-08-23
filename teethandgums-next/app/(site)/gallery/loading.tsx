import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import GallerySkeleton from "@/components/skeletons/GallerySkeleton";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading dental clinic gallery" className="overflow-x-hidden">
      <HeroSkeleton />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <GallerySkeleton />
      </section>
    </main>
  );
}
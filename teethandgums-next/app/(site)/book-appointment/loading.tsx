import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading the appointment booking page" className="overflow-x-hidden">
      <HeroSkeleton />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <FormSkeleton />
      </section>
    </main>
  );
}
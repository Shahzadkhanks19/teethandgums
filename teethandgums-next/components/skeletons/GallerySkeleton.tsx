import Skeleton from "./Skeleton";

const gallerySkeletonItems = Array.from(
  { length: 8 },
  (_, index) => `gallery-skeleton-${index + 1}`,
);

export default function GallerySkeleton() {
  return (
    <section
      aria-hidden="true"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {gallerySkeletonItems.map((item) => (
        <Skeleton
          key={item}
          className="aspect-[4/3] w-full rounded-3xl"
        />
      ))}
    </section>
  );
}

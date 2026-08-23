export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading Teeth and Gums Care"
      className="fixed inset-0 z-[99999] grid place-items-center bg-white"
    >
      <div className="flex flex-col items-center px-6 text-center">
        <div
          aria-hidden="true"
          className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700"
        />
        <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#08376f]">
          Loading Teeth &amp; Gums Care
        </p>
        <span className="sr-only">The page is loading. Please wait.</span>
      </div>
    </main>
  );
}

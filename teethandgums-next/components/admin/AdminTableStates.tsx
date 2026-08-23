import AdminIcon from "./AdminIcon";
type AdminStateProps = {
  text?: string;
  description?: string;
  onRetry?: () => void;
};

export function AdminLoadingState({
  text = "Loading data...",
  description = "Please wait while we fetch the latest information.",
}: AdminStateProps) {
  return (
    <section role="status" aria-live="polite" aria-busy="true" className="rounded-[28px] border border-blue-100 bg-white p-10 text-center shadow-[0_18px_55px_rgba(37,99,235,.10)]">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
        <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin" />
      </div>

      <h2 className="mt-6 text-2xl font-black text-slate-900">{text}</h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        {description}
      </p>
    </section>
  );
}

export function AdminEmptyState({
  text = "No data found.",
  description = "Once new records are available, they will appear here.",
}: AdminStateProps) {
  return (
    <section className="rounded-[28px] border border-dashed border-blue-200 bg-blue-50/50 p-10 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl text-blue-600 shadow-sm">
        <AdminIcon aria-hidden="true" className="fa-regular fa-folder-open" />
      </div>

      <h2 className="mt-6 text-2xl font-black text-slate-900">{text}</h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        {description}
      </p>
    </section>
  );
}

export function AdminErrorState({
  text = "Something went wrong.",
  description = "Please try again. If the issue continues, check the server logs.",
  onRetry,
}: AdminStateProps) {
  return (
    <section role="alert" className="rounded-[28px] border border-red-100 bg-white p-10 text-center shadow-[0_18px_55px_rgba(239,68,68,.10)]">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-3xl text-red-600">
        <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation" />
      </div>

      <h2 className="mt-6 text-2xl font-black text-slate-900">{text}</h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-900 px-7 py-3 font-black text-white shadow-lg shadow-blue-200 transition motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          <AdminIcon aria-hidden="true" className="fa-solid fa-rotate-right mr-2" />
          Retry
        </button>
      )}
    </section>
  );
}
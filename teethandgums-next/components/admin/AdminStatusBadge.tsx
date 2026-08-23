import AdminIcon from "./AdminIcon";
type Status =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "active"
  | "inactive"
  | "success"
  | "failed";

const statusStyles: Record<Status, string> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200",

  confirmed:
    "bg-green-50 text-green-700 border-green-200",

  cancelled:
    "bg-red-50 text-red-700 border-red-200",

  rescheduled:
    "bg-blue-50 text-blue-700 border-blue-200",

  completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  active:
    "bg-green-50 text-green-700 border-green-200",

  inactive:
    "bg-slate-100 text-slate-600 border-slate-200",

  success:
    "bg-green-50 text-green-700 border-green-200",

  failed:
    "bg-red-50 text-red-700 border-red-200",
};

const icons: Record<Status, string> = {
  pending: "fa-clock",

  confirmed: "fa-circle-check",

  cancelled: "fa-ban",

  rescheduled: "fa-calendar-days",

  completed: "fa-check-double",

  active: "fa-circle",

  inactive: "fa-circle",

  success: "fa-circle-check",

  failed: "fa-circle-xmark",
};

export default function AdminStatusBadge({
  status,
}: {
  status: string;
}) {
  const key = (status?.toLowerCase() || "pending") as Status;

  const style =
    statusStyles[key] ||
    "bg-slate-100 text-slate-700 border-slate-200";

  const icon = icons[key] || "fa-circle";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black capitalize ${style}`}
    >
      <AdminIcon aria-hidden="true" className={`fa-solid ${icon}`} />

      {status || "Unknown"}
    </span>
  );
}
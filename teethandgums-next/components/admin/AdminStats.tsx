import AdminIcon from "./AdminIcon";
type AdminStatsProps = {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalMessages: number;
};

export default function AdminStats({
  totalAppointments,
  pendingAppointments,
  confirmedAppointments,
  cancelledAppointments,
  totalMessages,
}: AdminStatsProps) {
  const stats = [
    {
      label: "Total Appointments",
      value: totalAppointments,
      icon: "fa-solid fa-calendar-check",
      className: "",
    },
    {
      label: "Pending",
      value: pendingAppointments,
      icon: "fa-solid fa-clock",
      className: "pending",
    },
    {
      label: "Confirmed",
      value: confirmedAppointments,
      icon: "fa-solid fa-circle-check",
      className: "confirmed",
    },
    {
      label: "Cancelled",
      value: cancelledAppointments,
      icon: "fa-solid fa-circle-xmark",
      className: "cancelled",
    },
    {
      label: "Messages",
      value: totalMessages,
      icon: "fa-solid fa-envelope",
      className: "messages",
    },
  ];

  return (
    <section aria-label="Dashboard statistics" className="admin-stats-grid">
      {stats.map((item) => (
        <div key={item.label} className={`admin-stat-card ${item.className}`}>
          <AdminIcon aria-hidden="true" className={item.icon} />
          <p aria-label={`${item.label}: ${item.value}`} className="admin-stat-value">{item.value}</p>
          <p>{item.label}</p>
        </div>
      ))}
    </section>
  );
}
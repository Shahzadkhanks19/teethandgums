"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBolt,
  faCalendarCheck,
  faCalendarDays,
  faCircleCheck,
  faClock,
  faEnvelope,
  faUserDoctor,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { adminFetch } from "@/lib/adminFetch";
import useRealtimeRefresh from "@/hooks/useRealtimeRefresh";

import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

type Appointment = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  doctor: string;
  status: "pending" | "confirmed" | "rescheduled" | "cancelled";
  createdAt: string;
};

type Contact = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
};

type ActivityLog = {
  _id: string;
  action: string;
  details: string;
  type: string;
  createdAt: string;
};

const statusChartColors = {
  Pending: "#f59e0b",
  Confirmed: "#16a34a",
  Cancelled: "#dc2626",
  Rescheduled: "#2563eb",
};

function StatCard({
  icon,
  label,
  value,
  note,
  tone = "blue",
}: {
  icon: IconDefinition;
  label: string;
  value: number;
  note?: string;
  tone?: "blue" | "amber" | "green" | "red" | "slate";
}) {
  const tones = {
    blue: "from-blue-600 to-blue-900 text-blue-700 bg-blue-50 border-blue-100",
    amber:
      "from-amber-500 to-orange-600 text-amber-700 bg-amber-50 border-amber-100",
    green:
      "from-green-500 to-emerald-700 text-green-700 bg-green-50 border-green-100",
    red: "from-red-500 to-red-700 text-red-700 bg-red-50 border-red-100",
    slate:
      "from-slate-700 to-slate-950 text-slate-700 bg-slate-50 border-slate-100",
  };

  return (
    <div
      className={`rounded-[26px] border ${tones[tone]} p-5 shadow-[0_16px_45px_rgba(37,99,235,.08)] transition motion-safe:hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-black text-slate-900">{value}</p>
          {note && <p className="mt-2 text-sm font-bold text-slate-500">{note}</p>}
        </div>

        <div
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tones[tone].split(" ").slice(0, 2).join(" ")} text-xl text-white shadow-lg`}
        >
          <FontAwesomeIcon aria-hidden="true" icon={icon} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        {subtitle && <p className="mt-2 leading-7 text-slate-500">{subtitle}</p>}
      </div>

      {children}
    </section>
  );
}

export default function DashboardClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartsReady, setChartsReady] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentsRes, contactsRes, logsRes] = await Promise.all([
        adminFetch("/api/admin/appointments"),
        adminFetch("/api/admin/contacts"),
        adminFetch("/api/admin/activity-logs"),
      ]);

      const [appointmentsData, contactsData, logsData] = (await Promise.all([
        appointmentsRes.json().catch(() => null),
        contactsRes.json().catch(() => null),
        logsRes.json().catch(() => null),
      ])) as [
        { message?: string; appointments?: Appointment[] } | null,
        { message?: string; contacts?: Contact[] } | null,
        { message?: string; logs?: ActivityLog[] } | null,
      ];

      if (!appointmentsRes.ok) {
        throw new Error(appointmentsData?.message || "Failed to load appointments");
      }

      if (!contactsRes.ok) {
        throw new Error(contactsData?.message || "Failed to load messages");
      }

      if (!logsRes.ok) {
        throw new Error(logsData?.message || "Failed to load activity logs");
      }

      setAppointments(appointmentsData?.appointments || []);
      setContacts(contactsData?.contacts || []);
      setActivityLogs(logsData?.logs || []);
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard data";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      void fetchDashboardData();
    });

    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => setChartsReady(true), { timeout: 1200 })
        : globalThis.setTimeout(() => setChartsReady(true), 300);

    return () => {
      window.cancelAnimationFrame(frameId);

      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [fetchDashboardData]);

  useRealtimeRefresh(fetchDashboardData);

  const dashboardStats = useMemo(() => {
    const pendingAppointments = appointments.filter(
      (item) => item.status === "pending",
    ).length;

    const confirmedAppointments = appointments.filter(
      (item) => item.status === "confirmed",
    ).length;

    const cancelledAppointments = appointments.filter(
      (item) => item.status === "cancelled",
    ).length;

    const rescheduledAppointments = appointments.filter(
      (item) => item.status === "rescheduled",
    ).length;

    const uniquePatients = new Set(
      appointments.map((item) => item.phone || item.email),
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const newThisMonth = appointments.filter((item) => {
      const createdDate = new Date(item.createdAt);

      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    const patientVisitCount = appointments.reduce<Record<string, number>>(
      (acc, item) => {
        const key = item.phone || item.email;
        if (!key) return acc;

        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {},
    );

    const returningPatients = Object.values(patientVisitCount).filter(
      (count) => count > 1,
    ).length;

    const drSunita = appointments.filter((item) =>
      item.doctor?.toLowerCase().includes("sunita"),
    ).length;

    const drVishal = appointments.filter((item) =>
      item.doctor?.toLowerCase().includes("vishal"),
    ).length;

    const unreadMessages = contacts.filter((item) => item.status === "new").length;

    return {
      pendingAppointments,
      confirmedAppointments,
      cancelledAppointments,
      rescheduledAppointments,
      totalPatients: uniquePatients.size,
      newThisMonth,
      returningPatients,
      drSunita,
      drVishal,
      unreadMessages,
    };
  }, [appointments, contacts]);

  const statusChartData = useMemo(
    () => [
      {
        name: "Pending",
        value: dashboardStats.pendingAppointments,
        color: statusChartColors.Pending,
      },
      {
        name: "Confirmed",
        value: dashboardStats.confirmedAppointments,
        color: statusChartColors.Confirmed,
      },
      {
        name: "Cancelled",
        value: dashboardStats.cancelledAppointments,
        color: statusChartColors.Cancelled,
      },
      {
        name: "Rescheduled",
        value: dashboardStats.rescheduledAppointments,
        color: statusChartColors.Rescheduled,
      },
    ],
    [dashboardStats],
  );

  const monthlyChartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => ({
      month,
      appointments: appointments.filter((item) => {
        const date = new Date(item.createdAt);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).length,
    }));
  }, [appointments]);

  const recentAppointments = useMemo(
    () => appointments.slice(0, 5),
    [appointments],
  );

  const recentContacts = useMemo(
    () => contacts.slice(0, 5),
    [contacts],
  );

  const recentLogs = useMemo(
    () => activityLogs.slice(0, 8),
    [activityLogs],
  );

  if (loading) {
    return <AdminLoadingState text="Loading dashboard data..." />;
  }

  if (error) {
    return <AdminErrorState text={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div aria-busy={loading} className="space-y-7">
      <section aria-labelledby="dashboard-overview-title" className="rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 p-6 text-white shadow-[0_24px_70px_rgba(37,99,235,.22)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
              Live Clinic Overview
            </span>

            <h1 id="dashboard-overview-title" className="mt-4 text-3xl font-black md:text-5xl">
              Dashboard Overview
            </h1>

            <p className="mt-3 max-w-2xl leading-8 text-blue-50">
              Track appointments, patient messages, doctor workload and recent
              admin activity in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center gap-3 font-black">
              <span aria-hidden="true" className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,.9)]"></span>
              Live Updates Active
            </div>

            <p className="mt-2 text-sm font-semibold text-blue-50">
              Last updated: {lastUpdated || "Just now"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={faCalendarCheck}
          label="Total Appointments"
          value={appointments.length}
          note={`${dashboardStats.newThisMonth} new this month`}
          tone="blue"
        />

        <StatCard
          icon={faClock}
          label="Pending Appointments"
          value={dashboardStats.pendingAppointments}
          note="Need admin action"
          tone="amber"
        />

        <StatCard
          icon={faCircleCheck}
          label="Confirmed"
          value={dashboardStats.confirmedAppointments}
          note="Approved bookings"
          tone="green"
        />

        <StatCard
          icon={faEnvelope}
          label="Messages"
          value={contacts.length}
          note={`${dashboardStats.unreadMessages} unread`}
          tone="slate"
        />

        <StatCard
          icon={faUsers}
          label="Total Patients"
          value={dashboardStats.totalPatients}
          note={`${dashboardStats.returningPatients} returning`}
          tone="blue"
        />

        <StatCard
          icon={faCalendarDays}
          label="Rescheduled"
          value={dashboardStats.rescheduledAppointments}
          note="Updated appointment slots"
          tone="blue"
        />

        <StatCard
          icon={faUserDoctor}
          label="Dr. Sunita"
          value={dashboardStats.drSunita}
          note="Assigned appointments"
          tone="green"
        />

        <StatCard
          icon={faUserDoctor}
          label="Dr. Vishal"
          value={dashboardStats.drVishal}
          note="Assigned appointments"
          tone="blue"
        />
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:760px] grid gap-7 xl:grid-cols-2">
        <SectionCard
          title="Appointment Status"
          subtitle="Current appointment distribution by status."
        >
          {appointments.length === 0 ? (
            <AdminEmptyState text="No appointment data for chart." />
          ) : !chartsReady ? (
            <div
              aria-label="Loading appointment status chart"
              className="h-[320px] animate-pulse rounded-[24px] bg-blue-50/70"
            />
          ) : (
            <div>
              <p className="sr-only">
                Appointment status chart showing pending, confirmed, cancelled,
                and rescheduled appointment totals.
              </p>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart accessibilityLayer>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={72}
                    outerRadius={112}
                    paddingAngle={5}
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {statusChartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl bg-blue-50/50 p-4"
                  >
                    <div className="flex items-center gap-3 font-black text-slate-700">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: item.color }}
                      ></span>
                      {item.name}
                    </div>

                    <strong className="text-slate-900">{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Monthly Appointments"
          subtitle="Appointments received month-wise in the current year."
        >
          {appointments.length === 0 ? (
            <AdminEmptyState text="No monthly appointment data." />
          ) : !chartsReady ? (
            <div
              aria-label="Loading monthly appointments chart"
              className="h-[320px] animate-pulse rounded-[24px] bg-blue-50/70"
            />
          ) : (
            <>
              <p className="sr-only">
                Monthly appointments chart for the current calendar year.
              </p>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyChartData} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="appointments"
                  fill="#2563eb"
                  radius={[10, 10, 0, 0]}
                />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </SectionCard>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:760px] grid gap-7 xl:grid-cols-2">
        <SectionCard title="Recent Appointments">
          {recentAppointments.length === 0 ? (
            <AdminEmptyState text="No appointments found." />
          ) : (
            <div className="grid gap-3">
              {recentAppointments.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-black text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {item.service} • {item.doctor}
                      </p>
                      <p className="mt-1 text-sm font-bold text-blue-700">
                        {item.date} at {item.timeSlot}
                      </p>
                    </div>

                    <AdminStatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent Messages">
          {recentContacts.length === 0 ? (
            <AdminEmptyState text="No messages found." />
          ) : (
            <div className="grid gap-3">
              {recentContacts.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900">{item.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                        {item.message}
                      </p>
                      <p className="mt-2 text-xs font-bold text-blue-700">
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <AdminStatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="[content-visibility:auto] [contain-intrinsic-size:700px]"><SectionCard title="Latest Activity" subtitle="Recent admin and system activity.">
        {recentLogs.length === 0 ? (
          <AdminEmptyState text="No recent activity found." />
        ) : (
          <div className="relative grid gap-4">
            {recentLogs.map((log) => (
              <div key={log._id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <FontAwesomeIcon aria-hidden="true" icon={faBolt} />
                  </div>
                </div>

                <div className="flex-1 rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-black text-slate-900">{log.action}</h3>
                      <p className="mt-1 leading-7 text-slate-500">
                        {log.details || "No details available"}
                      </p>
                    </div>

                    <AdminStatusBadge status={log.type} />
                  </div>

                  <p className="mt-3 text-xs font-bold text-blue-700">
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard></div>
    </div>
  );
}
"use client";

import type { ReactNode } from "react";

import AdminIcon from "./AdminIcon";
export default function AdminInfoCard({
  icon,
  title,
  value,
  actions,
}: {
  icon: string;
  title: string;
  value: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
        <AdminIcon aria-hidden="true" className={icon} />

        {title}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 break-all font-bold leading-7 text-slate-700">
          {value}
        </div>

        {actions}
      </div>
    </div>
  );
}
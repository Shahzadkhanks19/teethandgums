"use client";

import toast from "react-hot-toast";

import AdminIcon from "./AdminIcon";
export default function AdminCopyButton({ value }: { value: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch {
      toast.error("Unable to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy value"
      title="Copy"
      className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-600 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      <AdminIcon aria-hidden="true" className="fa-regular fa-copy" />
    </button>
  );
}
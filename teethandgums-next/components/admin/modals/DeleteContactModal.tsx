"use client";

import AdminModal from "@/components/admin/AdminModal";

import AdminIcon from "@/components/admin/AdminIcon";
type Contact = {
  _id: string;
  name: string;
};

export default function DeleteContactModal({
  contact,
  loading,
  onClose,
  onDelete,
}: {
  contact: Contact;
  loading: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <AdminModal
      title="Delete Contact Message"
      description="This will permanently delete this contact message."
      icon="fa-solid fa-trash"
      tone="red"
      maxWidth="md"
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            aria-busy={loading}
            onClick={onDelete}
            className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-trash mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-bold text-slate-600">
            Message will be deleted from
          </p>

          <p className="mt-1 text-xl font-black text-red-700">
            {contact.name}
          </p>
        </div>

        <div role="alert" className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700">
          <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation mr-2" />
          This action cannot be undone.
        </div>
      </div>
    </AdminModal>
  );
}
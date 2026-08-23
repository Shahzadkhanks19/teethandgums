"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";
import useRealtimeRefresh from "@/hooks/useRealtimeRefresh";

import AdminActionMenu from "@/components/admin/AdminActionMenu";
import AdminModal from "@/components/admin/AdminModal";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

import ViewContactModal from "@/components/admin/modals/ViewContactModal";
import DeleteContactModal from "@/components/admin/modals/DeleteContactModal";
import ReplyContactModal from "@/components/admin/modals/ReplyContactModal";

import AdminIcon from "@/components/admin/AdminIcon";
type ContactReply = {
  _id?: string;
  subject: string;
  message: string;
  sentTo: string;
  sentBy?: string;
  status: "sent" | "failed";
  sentAt: string;
};

type Contact = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
  replies?: ContactReply[];
  repliedAt?: string;
};



type ContactApiResponse = {
  success?: boolean;
  message?: string;
  contacts?: Contact[];
  contact?: Contact;
  deletedCount?: number;
};

const filters = ["all", "new", "read", "replied"];

export default function ContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const [messageFilter, setMessageFilter] = useState("all");
  const [messageSearchTerm, setMessageSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [replyContact, setReplyContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch("/api/admin/contacts");
      const data = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch contact messages");
      }

      setContacts(data?.contacts || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch contact messages";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => {
            void fetchContacts();
          }, { timeout: 900 })
        : globalThis.setTimeout(() => {
            void fetchContacts();
          }, 120);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, [fetchContacts]);

  useRealtimeRefresh(fetchContacts);

  const filteredContacts = useMemo(() => {
    return contacts
      .filter((item) =>
        messageFilter === "all" ? true : item.status === messageFilter,
      )
      .filter((item) => {
        const search = messageSearchTerm.trim().toLowerCase();

        return (
          item.name?.toLowerCase().includes(search) ||
          item.phone?.toLowerCase().includes(search) ||
          item.email?.toLowerCase().includes(search) ||
          item.message?.toLowerCase().includes(search) ||
          item.status?.toLowerCase().includes(search)
        );
      });
  }, [contacts, messageFilter, messageSearchTerm]);

  const selectedAll =
    filteredContacts.length > 0 &&
    selectedMessages.length === filteredContacts.length;

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      new: contacts.filter((item) => item.status === "new").length,
      read: contacts.filter((item) => item.status === "read").length,
      replied: contacts.filter((item) => item.status === "replied").length,
    };
  }, [contacts]);

  const getMessagePreview = (message: string) => {
    if (!message) return "No message";
    return message.length > 85 ? `${message.slice(0, 85)}...` : message;
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const toggleSelectAllMessages = () => {
    setSelectedMessages(
      selectedAll ? [] : filteredContacts.map((item) => item._id),
    );
  };

  const updateMessageStatus = async (
    id: string,
    status: "new" | "read" | "replied",
    silent = false,
  ) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(`/api/admin/contacts/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (!response.ok) {
        if (!silent) toast.error(data?.message || "Failed to update message");
        return null;
      }

      const updatedContact = data?.contact;

      setContacts((prev) =>
        prev.map((item) =>
          item._id === id ? updatedContact || { ...item, status } : item,
        ),
      );

      setViewContact((prev) =>
        prev?._id === id ? updatedContact || { ...prev, status } : prev,
      );

      if (!silent) {
        toast.success(`Message marked as ${status}`);
      }

      return updatedContact;
    } catch {
      if (!silent) toast.error("Server error");
      return null;
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setViewContact(contact);

    if (contact.status === "new") {
      const updatedContact = await updateMessageStatus(contact._id, "read", true);

      if (updatedContact) {
        setViewContact(updatedContact);
      }
    }
  };

  const sendReply = async (contact: Contact, data: { subject: string; message: string }) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(`/api/admin/contacts/${contact._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (!response.ok) {
        toast.error(result?.message || "Failed to send reply");
        return;
      }

      const updatedContact = result?.contact;

      if (!updatedContact) {
        toast.error("Updated contact data was not returned");
        return;
      }

      setContacts((prev) =>
        prev.map((item) => (item._id === contact._id ? updatedContact : item)),
      );

      setViewContact((prev) =>
        prev?._id === contact._id ? updatedContact : prev,
      );

      setReplyContact(null);
      toast.success("Reply sent successfully");
    } catch {
      toast.error("Server error while sending reply");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete message");
        return;
      }

      setContacts((prev) => prev.filter((item) => item._id !== id));
      setSelectedMessages((prev) => prev.filter((itemId) => itemId !== id));
      setViewContact((prev) => (prev?._id === id ? null : prev));
      setDeleteContact(null);

      toast.success("Contact message deleted successfully");
    } catch {
      toast.error("Server error");
    } finally {
      setActionLoading(false);
    }
  };

  const bulkDeleteSelectedMessages = async (confirmed = false) => {
    if (selectedMessages.length === 0) {
      toast.error("Please select messages first");
      return;
    }

    if (!confirmed) {
      setBulkDeleteModal(true);
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/contacts/bulk/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedMessages }),
      });

      const data = (await response.json().catch(() => null)) as
        | ContactApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete selected messages");
        return;
      }

      setContacts((prev) =>
        prev.filter((item) => !selectedMessages.includes(item._id)),
      );

      setSelectedMessages([]);
      setBulkDeleteModal(false);

      toast.success(data?.message || "Selected messages deleted");
    } catch {
      toast.error("Server error");
    } finally {
      setActionLoading(false);
    }
  };

  const exportContactsCSV = () => {
    if (filteredContacts.length === 0) {
      toast.error("No contact messages to export");
      return;
    }

    const rows = filteredContacts.map((item) => ({
      Name: item.name,
      Phone: item.phone,
      Email: item.email,
      Message: item.message,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleString("en-IN"),
      Replies: item.replies?.length || 0,
    }));

    const csvContent = [
      Object.keys(rows[0]).join(","),
      ...rows.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value || "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = "contact-messages.csv";
    link.click();
    URL.revokeObjectURL(objectUrl);

    toast.success("Contact messages CSV exported");
  };

  const exportContactsExcel = async () => {
    if (filteredContacts.length === 0) {
      toast.error("No contact messages to export");
      return;
    }

    const rows = filteredContacts.map((item) => ({
      Name: item.name,
      Phone: item.phone,
      Email: item.email,
      Message: item.message,
      Status: item.status,
      Date: new Date(item.createdAt).toLocaleString("en-IN"),
      Replies: item.replies?.length || 0,
    }));

    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Messages");
    XLSX.writeFile(workbook, "contact-messages.xlsx");

    toast.success("Contact messages Excel exported");
  };

  const exportContactsPDF = async () => {
    if (filteredContacts.length === 0) {
      toast.error("No contact messages to export");
      return;
    }

    const [{ default: jsPDF }, { default: autoTable }] =
      await Promise.all([import("jspdf"), import("jspdf-autotable")]);

    const doc = new jsPDF();

    doc.text("Contact Messages Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["Name", "Phone", "Email", "Message", "Status"]],
      body: filteredContacts.map((item) => [
        item.name,
        item.phone,
        item.email,
        item.message,
        item.status,
      ]),
    });

    doc.save("contact-messages.pdf");

    toast.success("Contact messages PDF exported");
  };

  if (loading) {
    return <AdminLoadingState text="Loading contact messages..." />;
  }

  if (error) {
    return <AdminErrorState text={error} onRetry={fetchContacts} />;
  }

  return (
    <>
      <section aria-labelledby="contact-messages-title" className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              Message Inbox
            </span>

            <h1 id="contact-messages-title" className="mt-4 text-3xl font-black text-slate-900">
              Contact Messages
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              View patient enquiries, reply from the dashboard, track status and
              manage message history.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
            {[
              ["Total", stats.total],
              ["New", stats.new],
              ["Read", stats.read],
              ["Replied", stats.replied],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-center"
              >
                <strong className="block text-2xl font-black text-blue-700">
                  {value}
                </strong>
                <span className="mt-1 block text-xs font-black text-slate-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative flex-1">
            <AdminIcon aria-hidden="true" className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />

            <input
              type="text"
              placeholder="Search by name, phone, email, message or status..."
              value={messageSearchTerm}
              onChange={(e) => setMessageSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-4 pl-12 pr-4 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportContactsCSV}
              className="rounded-2xl bg-blue-50 px-5 py-3 font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              CSV
            </button>

            <button
              type="button"
              onClick={exportContactsExcel}
              className="rounded-2xl bg-green-50 px-5 py-3 font-black text-green-700 transition hover:bg-green-600 hover:text-white"
            >
              Excel
            </button>

            <button
              type="button"
              onClick={exportContactsPDF}
              className="rounded-2xl bg-red-50 px-5 py-3 font-black text-red-700 transition hover:bg-red-600 hover:text-white"
            >
              PDF
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {filters.map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setMessageFilter(status)}
              className={`rounded-full px-5 py-2.5 text-sm font-black capitalize transition ${
                messageFilter === status
                  ? "bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-200"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 font-black text-slate-700">
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={toggleSelectAllMessages}
              className="h-5 w-5 accent-blue-600"
            />
            Select All ({filteredContacts.length})
          </label>

          <button
            type="button"
            disabled={selectedMessages.length === 0 || actionLoading}
            onClick={() => bulkDeleteSelectedMessages(false)}
            className="rounded-2xl bg-slate-900 px-5 py-3 font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete Selected ({selectedMessages.length})
          </button>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="mt-7">
            <AdminEmptyState text="No contact messages matching your filters." />
          </div>
        ) : (
          <>
            <div className="mt-7 hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    {[
                      "Select",
                      "Name",
                      "Phone",
                      "Email",
                      "Message",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="bg-blue-50 px-4 py-4 text-left text-sm font-black text-blue-800 first:rounded-l-2xl last:rounded-r-2xl"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredContacts.map((item) => (
                    <tr key={item._id}>
                      <td className="rounded-l-2xl border-y border-l border-blue-100 bg-white px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(item._id)}
                          onChange={() => toggleMessageSelection(item._id)}
                          className="h-5 w-5 accent-blue-600"
                        />
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-black text-slate-900">
                        {item.name}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.phone}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {item.email}
                      </td>

                      <td className="max-w-[260px] border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {getMessagePreview(item.message)}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4">
                        <AdminStatusBadge status={item.status} />
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-semibold text-slate-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="rounded-r-2xl border-y border-r border-blue-100 bg-white px-4 py-4">
                        <AdminActionMenu
                          items={[
                            {
                              label: "View Message",
                              icon: "fa-solid fa-eye",
                              onClick: () => handleViewContact(item),
                            },
                           {
  label: item.status === "replied" ? "Reply Again" : "Reply",
  icon: "fa-solid fa-reply",
  onClick: () => setReplyContact(item),
},
                            {
                              label: "Mark Unread",
                              icon: "fa-solid fa-envelope",
                              hidden: item.status === "new",
                              disabled: actionLoading,
                              onClick: () =>
                                updateMessageStatus(item._id, "new"),
                            },
                            {
                              label: "Delete",
                              icon: "fa-solid fa-trash",
                              danger: true,
                              disabled: actionLoading,
                              onClick: () => setDeleteContact(item),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7 grid gap-4 lg:hidden">
              {filteredContacts.map((item) => (
                <article
                  key={item._id}
                  className="rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(item._id)}
                        onChange={() => toggleMessageSelection(item._id)}
                        className="mt-1 h-5 w-5 accent-blue-600"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 break-all text-sm font-semibold text-slate-500">
                          {item.email}
                        </p>
                      </div>
                    </div>

                    <AdminActionMenu
                      items={[
                        {
                          label: "View Message",
                          icon: "fa-solid fa-eye",
                          onClick: () => handleViewContact(item),
                        },
                        {
  label: item.status === "replied" ? "Reply Again" : "Reply",
  icon: "fa-solid fa-reply",
  onClick: () => setReplyContact(item),
},
                        {
                          label: "Mark Unread",
                          icon: "fa-solid fa-envelope",
                          hidden: item.status === "new",
                          disabled: actionLoading,
                          onClick: () => updateMessageStatus(item._id, "new"),
                        },
                        {
                          label: "Delete",
                          icon: "fa-solid fa-trash",
                          danger: true,
                          disabled: actionLoading,
                          onClick: () => setDeleteContact(item),
                        },
                      ]}
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
                    {getMessagePreview(item.message)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <AdminStatusBadge status={item.status} />

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {viewContact && (
        <ViewContactModal
          contact={viewContact}
          onClose={() => setViewContact(null)}
        />
      )}

      {replyContact && (
        <ReplyContactModal
          contact={replyContact}
          loading={actionLoading}
          onClose={() => setReplyContact(null)}
          onSend={(data) => sendReply(replyContact, data)}
        />
      )}

      {deleteContact && (
        <DeleteContactModal
          contact={deleteContact}
          loading={actionLoading}
          onClose={() => setDeleteContact(null)}
          onDelete={() => deleteContactMessage(deleteContact._id)}
        />
      )}

      {bulkDeleteModal && (
        <AdminModal
          title="Delete Selected Messages"
          description="This action cannot be undone."
          icon="fa-solid fa-trash"
          tone="red"
          maxWidth="md"
          onClose={() => setBulkDeleteModal(false)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBulkDeleteModal(false)}
                disabled={actionLoading}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => bulkDeleteSelectedMessages(true)}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Delete Selected"}
              </button>
            </div>
          }
        >
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-bold leading-7 text-slate-700">
              Are you sure you want to delete{" "}
              <strong>{selectedMessages.length}</strong> selected message(s)?
            </p>
          </div>
        </AdminModal>
      )}
    </>
  );
}
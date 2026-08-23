"use client";

import { useState } from "react";

import AdminModal from "@/components/admin/AdminModal";

import AdminIcon from "@/components/admin/AdminIcon";
type Contact = {
  _id: string;
  name: string;
  email: string;
  message: string;
};

export default function ReplyContactModal({
  contact,
  loading,
  onClose,
  onSend,
}: {
  contact: Contact;
  loading: boolean;
  onClose: () => void;
  onSend: (data: { subject: string; message: string }) => void;
}) {
  const [subject, setSubject] = useState(
    "Reply from Teeth and Gums Care",
  );
  const [message, setMessage] = useState("");

  return (
    <AdminModal
      title="Reply to Patient"
      description={`Send a clinic reply directly to ${contact.email}.`}
      icon="fa-solid fa-reply"
      tone="blue"
      maxWidth="lg"
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
          >
            Close
          </button>

          <button
            type="button"
            disabled={loading || !subject.trim() || !message.trim()}
            aria-busy={loading}
            onClick={() =>
              onSend({
                subject: subject.trim(),
                message: message.trim(),
              })
            }
            className="rounded-2xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <AdminIcon aria-hidden="true" className="fa-solid fa-paper-plane mr-2" />
                Send Reply
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-bold text-slate-600">Patient</p>
          <p className="mt-1 text-xl font-black text-blue-700">
            {contact.name}
          </p>
          <p className="mt-1 break-all text-sm font-bold text-slate-600">
            {contact.email}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="font-black text-slate-900">Original Message</h4>
          <p className="mt-3 whitespace-pre-wrap break-words leading-7 text-slate-600">
            {contact.message}
          </p>
        </div>

        <div>
          <label
            htmlFor="reply-contact-subject"
            className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700"
          >
            Email Subject
          </label>

          <input
            id="reply-contact-subject"
            name="subject"
            type="text"
            required
            autoComplete="off"
            autoFocus
            value={subject}
            maxLength={150}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-2xl border border-blue-100 bg-blue-50/40 p-4 font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="reply-contact-message"
            className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-700"
          >
            Reply Message
          </label>

          <textarea
            id="reply-contact-message"
            name="message"
            rows={6}
            required
            autoComplete="off"
            value={message}
            maxLength={5000}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your reply to the patient..."
            aria-describedby="reply-contact-message-count"
            className="w-full resize-none rounded-2xl border border-blue-100 bg-blue-50/40 p-4 leading-7 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <p
            id="reply-contact-message-count"
            className="mt-2 text-right text-xs font-bold text-slate-500"
          >
            {message.length}/5000
          </p>
        </div>

        <div role="note" className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-700">
          <AdminIcon aria-hidden="true" className="fa-solid fa-triangle-exclamation mr-2" />
          This email will be sent to the patient and saved in reply history.
        </div>
      </div>
    </AdminModal>
  );
}
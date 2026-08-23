"use client";

import { FormEvent, useState } from "react";

import { trackEvent } from "@/lib/analytics";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-home" }),
      });
      const data = (await response.json()) as { success?: boolean; message?: string };
      setSuccess(Boolean(data.success));
      setMessage(data.message || "Unable to subscribe.");
      if (data.success) {
        trackEvent("newsletter_signup", { source: "blog" });
        setEmail("");
      }
    } catch {
      setSuccess(false);
      setMessage("Unable to subscribe right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 to-blue-950 p-6 text-white shadow-[0_25px_70px_rgba(30,64,175,.25)] md:p-10">
      <div className="grid gap-7 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Dental Updates</p>
          <h2 className="mt-3 text-3xl font-black">Get practical oral-health guidance in your inbox.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-blue-100">Occasional patient-friendly articles, prevention tips and clinic updates. No spam.</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[24px] bg-white/10 p-3 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
                className="min-h-12 w-full rounded-2xl border border-white/30 bg-white px-4 py-3 font-semibold text-slate-900 outline-none focus:ring-4 focus:ring-blue-300/40"
              />
            </label>
            <button disabled={loading} className="min-h-12 rounded-2xl bg-white px-5 py-3 font-black text-blue-950 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          {message && <p role="status" className={`mt-3 px-1 text-sm font-bold ${success ? "text-emerald-200" : "text-amber-200"}`}>{message}</p>}
        </form>
      </div>
    </section>
  );
}

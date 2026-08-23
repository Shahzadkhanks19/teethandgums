"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  HoverButton,
  HoverCard,
} from "@/components/animations";
import AuthIcon from "./AuthIcon";

type ForgotPasswordErrors = {
  email?: string;
  general?: string;
};

export default function ForgotPasswordClient() {
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    const nextErrors: ForgotPasswordErrors = {};
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail) {
      nextErrors.email = "Please enter your admin email address.";
    } else if (!emailRegex.test(normalizedEmail)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      normalizedEmail,
      nextErrors,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setErrors({});
    setMessage("");

    const { isValid, normalizedEmail, nextErrors } = validateEmail();

    if (!isValid) {
      emailInputRef.current?.focus();
      toast.error(
        nextErrors.email || "Please enter a valid admin email address.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !data?.success) {
        const errorMessage =
          data?.message || "Unable to send the password reset email.";

        setErrors({
          general: errorMessage,
        });

        toast.error(errorMessage);
        return;
      }

      const successMessage =
        data?.message ||
        "If an admin account exists for this email, a reset link has been sent.";

      setMessage(successMessage);
      setEmail("");
      toast.success(successMessage);
    } catch {
      const errorMessage =
        "Unable to connect to the server. Please try again.";

      setErrors({
        general: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="relative grid min-h-[100dvh] place-items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-slate-400/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/30 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-[480px]">
        <HoverCard>
            <section
              aria-labelledby="forgot-password-title"
              className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-white/95 px-6 py-10 shadow-[0_32px_90px_rgba(37,99,235,.16)] backdrop-blur-xl sm:px-9 sm:py-12"
            >
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-950"
              />

              <div className="text-center">
                  <div
                    aria-hidden="true"
                    className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-gradient-to-br from-blue-600 to-blue-950 text-3xl text-white shadow-[0_18px_45px_rgba(37,99,235,.28)]"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-key" />
                  </div>

                  <span className="mt-6 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
                    Secure Password Recovery
                  </span>

                  <h1
                    id="forgot-password-title"
                    className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-4xl"
                  >
                    Forgot Password?
                  </h1>

                  <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-500">
                    Enter the admin email address associated with the dashboard.
                    We will send password reset instructions if the account
                    exists.
                  </p>
              </div>

              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {loading ? "Sending password reset instructions." : ""}
              </div>

              {errors.general && (
                <div
                  id="forgot-password-general-error"
                  role="alert"
                  aria-live="assertive"
                  className="mt-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-sm font-bold leading-6 text-red-700"
                >
                  <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-7 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-left text-sm font-bold leading-6 text-green-700"
                >
                  <AuthIcon aria-hidden="true" className="fa-solid fa-circle-check mt-1 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                aria-busy={loading}
                aria-describedby={errors.general ? "forgot-password-general-error" : undefined}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="forgot-password-email"
                    className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-envelope text-blue-600" />
                    Admin Email
                  </label>

                  <div className="relative">
                    <input
                      ref={emailInputRef}
                      id="forgot-password-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setErrors({});
                        setMessage("");
                      }}
                      disabled={loading}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email
                          ? "forgot-password-email-error"
                          : "forgot-password-email-help"
                      }
                      className={`min-h-[58px] w-full rounded-2xl border bg-white px-5 py-4 pl-12 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-blue-100 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                    />

                    <AuthIcon
                      aria-hidden="true"
                      className="fa-solid fa-envelope pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    ></AuthIcon>
                  </div>

                  {errors.email ? (
                    <p
                      id="forgot-password-email-error"
                      role="alert"
                      className="mt-2 flex items-start gap-2 text-sm font-bold text-red-600"
                    >
                      <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1" />
                      <span>{errors.email}</span>
                    </p>
                  ) : (
                    <p
                      id="forgot-password-email-help"
                      className="mt-2 text-xs font-semibold leading-6 text-slate-500"
                    >
                      Use the email address linked to the admin account.
                    </p>
                  )}
                </div>

                <HoverButton>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(37,99,235,.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-3" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-paper-plane mr-3" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </HoverButton>
              </form>

              <div className="mt-7 text-center">
                <Link prefetch={false}
                  href="/admin/login"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-black text-blue-600 transition hover:bg-blue-50 hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  <AuthIcon aria-hidden="true" className="fa-solid fa-arrow-left mr-2" />
                  Back To Login
                </Link>
              </div>

              <div className="mt-6 rounded-[24px] border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-start gap-3 text-left">
                  <div
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-shield-halved" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Secure Recovery
                    </h2>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      For security, the response may remain the same whether or
                      not an admin account exists for the entered email.
                    </p>
                  </div>
                </div>
              </div>
            </section>
        </HoverCard>
      </div>
    </main>
  );
}
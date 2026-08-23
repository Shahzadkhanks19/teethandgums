"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  HoverButton,
  HoverCard,
} from "@/components/animations";
import AuthIcon from "./AuthIcon";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] =
    useState<LoginFormData>(initialFormData);

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof LoginFormData;

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: undefined,
      general: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: LoginErrors = {};
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      nextErrors.email = "Please enter your admin email address.";
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Please enter your admin password.";
    }

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      nextErrors,
    };
  };

  const focusFirstInvalidField = (nextErrors: LoginErrors) => {
    window.requestAnimationFrame(() => {
      if (nextErrors.email) {
        emailInputRef.current?.focus();
        return;
      }

      if (nextErrors.password) {
        passwordInputRef.current?.focus();
      }
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) return;

    setErrors({});

    const { isValid, nextErrors } = validateForm();

    if (!isValid) {
      focusFirstInvalidField(nextErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            admin?: { email?: string };
          }
        | null;

      if (!response.ok || !data?.success) {
        const errorMessage =
          data?.message || "Invalid email or password.";

        setErrors({
          general: errorMessage,
        });

        toast.error(errorMessage);
        return;
      }
 
      if (data?.admin?.email) {
        localStorage.setItem("adminEmail", data.admin.email);
      }

      toast.success("Login successful.");

      const requestedPath = searchParams.get("next");
      const destination =
        requestedPath?.startsWith("/admin/dashboard") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/admin/dashboard";

      router.replace(destination);
      router.refresh();
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
              aria-labelledby="admin-login-title"
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
                    <AuthIcon aria-hidden="true" className="fa-solid fa-user-shield" />
                  </div>

                  <span className="mt-6 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
                    Secure Admin Access
                  </span>

                  <h1
                    id="admin-login-title"
                    className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-4xl"
                  >
                    Admin Login
                  </h1>

                  <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-500">
                    Sign in securely to manage appointments, messages,
                    availability, and clinic settings.
                  </p>
              </div>

              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {loading ? "Signing you in." : ""}
              </div>

              {errors.general && (
                <div
                  id="admin-login-general-error"
                  role="alert"
                  aria-live="assertive"
                  className="mt-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-sm font-bold leading-6 text-red-700"
                >
                  <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                aria-busy={loading}
                aria-describedby={errors.general ? "admin-login-general-error" : undefined}
                className="mt-8 space-y-5"
              >
                <div>
                  <label
                    htmlFor="admin-login-email"
                    className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-envelope text-blue-600" />
                    Admin Email
                  </label>

                  <div className="relative">
                    <input
                      ref={emailInputRef}
                      id="admin-login-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="admin@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email
                          ? "admin-login-email-error"
                          : undefined
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

                  {errors.email && (
                    <p
                      id="admin-login-email-error"
                      role="alert"
                      className="mt-2 flex items-start gap-2 text-sm font-bold text-red-600"
                    >
                      <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="admin-login-password"
                    className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-lock text-blue-600" />
                    Admin Password
                  </label>

                  <div className="relative">
                    <input
                      ref={passwordInputRef}
                      id="admin-login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password
                          ? "admin-login-password-error"
                          : undefined
                      }
                      className={`min-h-[58px] w-full rounded-2xl border bg-white px-5 py-4 pl-12 pr-16 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-blue-100 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                    />

                    <AuthIcon
                      aria-hidden="true"
                      className="fa-solid fa-lock pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    ></AuthIcon>

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((currentValue) => !currentValue)
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide admin password"
                          : "Show admin password"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <AuthIcon
                        aria-hidden="true"
                        className={
                          showPassword
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye"
                        }
                      ></AuthIcon>
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="admin-login-password-error"
                      role="alert"
                      className="mt-2 flex items-start gap-2 text-sm font-bold text-red-600"
                    >
                      <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link prefetch={false}
                    href="/admin/forgot-password"
                    className="rounded-lg text-sm font-black text-blue-600 transition hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <HoverButton>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition motion-safe:hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(37,99,235,.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-3" />
                        Signing You In...
                      </>
                    ) : (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-right-to-bracket mr-3" />
                        Login To Dashboard
                      </>
                    )}
                  </button>
                </HoverButton>
              </form>


              <div className="mt-6">
                <Link
                  prefetch={false}
                  href="/"
                  aria-label="Return to the Teeth and Gums Care website"
                  className="group inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-4 font-black text-blue-700 transition duration-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  <AuthIcon
                    aria-hidden="true"
                    className="fa-solid fa-arrow-left mr-3 transition-transform duration-300 motion-safe:group-hover:-translate-x-1"
                  />
                  Return To Main Website
                </Link>
              </div>

              <div className="mt-8 rounded-[24px] border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-start gap-3 text-left">
                  <div
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-shield-halved" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Protected Admin Area
                    </h2>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      Access is restricted to authorized clinic
                      administrators only.
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
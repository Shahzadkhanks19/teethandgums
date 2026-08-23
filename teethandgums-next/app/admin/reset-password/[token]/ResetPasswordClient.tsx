"use client";

import { useParams, useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  HoverButton,
  HoverCard,
} from "@/components/animations";
import AuthIcon from "./AuthIcon";

type ResetErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function ResetPasswordClient() {
  const router = useRouter();
  const params = useParams();

  const tokenParam = params.token;
  const token = Array.isArray(tokenParam)
    ? tokenParam[0]
    : tokenParam;

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef =
    useRef<HTMLInputElement | null>(null);

  const redirectTimerRef = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ResetErrors>({});

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const passwordChecks = useMemo(() => {
    const password = formData.password;

    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special:
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
          password,
        ),
    };
  }, [formData.password]);

  const strength = useMemo(() => {
    const score = Object.values(passwordChecks).filter(
      Boolean,
    ).length;

    if (score <= 2) {
      return {
        label: "Weak",
        color: "bg-red-500",
        width: "33%",
        text: "text-red-600",
      };
    }

    if (score <= 4) {
      return {
        label: "Medium",
        color: "bg-yellow-500",
        width: "66%",
        text: "text-yellow-600",
      };
    }

    return {
      label: "Strong",
      color: "bg-green-500",
      width: "100%",
      text: "text-green-600",
    };
  }, [passwordChecks]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors({});
    setSuccess("");
  };

  const validate = () => {
    const nextErrors: ResetErrors = {};

    if (!token) {
      nextErrors.general = "Invalid reset link.";
    }

    if (!formData.password) {
      nextErrors.password = "Please enter your new password.";
    } else if (!Object.values(passwordChecks).every(Boolean)) {
      nextErrors.password =
        "Use at least 8 characters with uppercase, lowercase, a number, and a special character.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(nextErrors);

    return {
      valid:
        Object.keys(nextErrors).length === 0,
      nextErrors,
    };
  };

  const focusFirstError = (
    nextErrors: ResetErrors,
  ) => {
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    if (nextErrors.confirmPassword) {
      confirmPasswordRef.current?.focus();
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) return;

    setErrors({});
    setSuccess("");

    const { valid, nextErrors } = validate();

    if (!valid) {
      focusFirstError(nextErrors);

      toast.error(
        nextErrors.general ||
          nextErrors.password ||
          nextErrors.confirmPassword ||
          "Please correct the highlighted fields.",
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/reset-password/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
            confirmPassword:
              formData.confirmPassword,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !data?.success) {
        const message =
          data?.message ||
          "Unable to reset your password.";

        setErrors({
          general: message,
        });

        toast.error(message);

        return;
      }

      const successMessage =
        data?.message || "Your password has been reset successfully.";

      setSuccess(successMessage);

      toast.success(successMessage);

      redirectTimerRef.current = window.setTimeout(() => {
        router.replace("/admin/login");
      }, 2500);
    } catch {
      const message =
        "Unable to connect to the server.";

      setErrors({
        general: message,
      });

      toast.error(message);
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

      <div className="relative z-10 w-full max-w-[520px]">
        <HoverCard>
            <section
              aria-labelledby="reset-password-title"
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
                    <AuthIcon aria-hidden="true" className="fa-solid fa-lock" />
                  </div>

                  <span className="mt-6 inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
                    Secure Password Reset
                  </span>

                  <h1
                    id="reset-password-title"
                    className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-4xl"
                  >
                    Create New Password
                  </h1>

                  <p className="mx-auto mt-3 max-w-sm leading-7 text-slate-500">
                    Choose a strong new password for your admin account. You
                    will be redirected to login after a successful reset.
                  </p>
              </div>

              <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {loading
                  ? "Resetting your password."
                  : success
                    ? "Password reset successful. Redirecting to login."
                    : ""}
              </div>

              {errors.general && (
                <div
                  id="reset-password-general-error"
                  role="alert"
                  aria-live="assertive"
                  className="mt-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-sm font-bold leading-6 text-red-700"
                >
                  <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-7 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-left text-sm font-bold leading-6 text-green-700"
                >
                  <AuthIcon aria-hidden="true" className="fa-solid fa-circle-check mt-1 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                aria-busy={loading}
                aria-describedby={errors.general ? "reset-password-general-error" : undefined}
                className="mt-8 space-y-6"
              >
                <div>
                  <label
                    htmlFor="reset-password"
                    className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-lock text-blue-600" />
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      ref={passwordRef}
                      id="reset-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter a new password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading || Boolean(success) || !token}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password
                          ? "reset-password-error"
                          : "reset-password-help"
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
                      disabled={loading || Boolean(success)}
                      aria-label={
                        showPassword
                          ? "Hide new password"
                          : "Show new password"
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

                  {errors.password ? (
                    <p
                      id="reset-password-error"
                      role="alert"
                      className="mt-2 flex items-start gap-2 text-sm font-bold text-red-600"
                    >
                      <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1" />
                      <span>{errors.password}</span>
                    </p>
                  ) : (
                    <p
                      id="reset-password-help"
                      className="mt-2 text-xs font-semibold leading-6 text-slate-500"
                    >
                      Use at least 8 characters with uppercase, lowercase,
                      number, and special character.
                    </p>
                  )}
                </div>

                {formData.password && (
                  <div className="rounded-[24px] border border-blue-100 bg-blue-50/60 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-sm font-black text-slate-900">
                        Password Strength
                      </h2>

                      <span className={`text-sm font-black ${strength.text}`}>
                        {strength.label}
                      </span>
                    </div>

                    <div
                      className="mt-3 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-blue-100"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={
                        strength.width === "100%"
                          ? 100
                          : strength.width === "66%"
                            ? 66
                            : 33
                      }
                      aria-label={`Password strength is ${strength.label}`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{
                          width: strength.width,
                        }}
                      />
                    </div>

                    <ul aria-label="Password requirements" className="mt-5 grid gap-3 sm:grid-cols-2">
                      <RequirementItem
                        met={passwordChecks.length}
                        text="At least 8 characters"
                      />

                      <RequirementItem
                        met={passwordChecks.uppercase}
                        text="One uppercase letter"
                      />

                      <RequirementItem
                        met={passwordChecks.lowercase}
                        text="One lowercase letter"
                      />

                      <RequirementItem
                        met={passwordChecks.number}
                        text="One number"
                      />

                      <RequirementItem
                        met={passwordChecks.special}
                        text="One special character"
                      />
                    </ul>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-shield-halved text-blue-600" />
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      ref={confirmPasswordRef}
                      id="reset-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading || Boolean(success)}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword
                          ? "reset-confirm-password-error"
                          : "reset-confirm-password-help"
                      }
                      className={`min-h-[58px] w-full rounded-2xl border bg-white px-5 py-4 pl-12 pr-16 text-slate-800 outline-none transition duration-300 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 ${
                        errors.confirmPassword
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-blue-100 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                    />

                    <AuthIcon
                      aria-hidden="true"
                      className="fa-solid fa-shield-halved pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                    ></AuthIcon>

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (currentValue) => !currentValue,
                        )
                      }
                      disabled={loading || Boolean(success)}
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmed password"
                          : "Show confirmed password"
                      }
                      aria-pressed={showConfirmPassword}
                      className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <AuthIcon
                        aria-hidden="true"
                        className={
                          showConfirmPassword
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye"
                        }
                      ></AuthIcon>
                    </button>
                  </div>

                  {errors.confirmPassword ? (
                    <p
                      id="reset-confirm-password-error"
                      role="alert"
                      className="mt-2 flex items-start gap-2 text-sm font-bold text-red-600"
                    >
                      <AuthIcon aria-hidden="true" className="fa-solid fa-circle-exclamation mt-1" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  ) : (
                    <p
                      id="reset-confirm-password-help"
                      className={`mt-2 text-xs font-semibold leading-6 ${
                        formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                          ? "text-green-600"
                          : "text-slate-500"
                      }`}
                    >
                      {formData.confirmPassword &&
                      formData.password === formData.confirmPassword
                        ? "The passwords match."
                        : "Enter the same password again for confirmation."}
                    </p>
                  )}
                </div>
                                <HoverButton>
                  <button
                    type="submit"
                    disabled={loading || Boolean(success) || !token}
                    className="inline-flex min-h-[58px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-4 font-black text-white shadow-[0_16px_35px_rgba(37,99,235,.24)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(37,99,235,.32)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-spinner fa-spin mr-3" />
                        Resetting Password...
                      </>
                    ) : success ? (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-circle-check mr-3" />
                        Password Updated
                      </>
                    ) : (
                      <>
                        <AuthIcon aria-hidden="true" className="fa-solid fa-key mr-3" />
                        Reset Password
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

              <div className="mt-7 rounded-[24px] border border-blue-100 bg-blue-50/70 p-5">
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                  >
                    <AuthIcon aria-hidden="true" className="fa-solid fa-shield-halved" />
                  </div>

                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      Security Tips
                    </h2>

                    <ul className="mt-2 space-y-2 text-xs leading-6 text-slate-500">
                      <li>
                        • Do not reuse passwords from other accounts.
                      </li>

                      <li>
                        • Store your password securely.
                      </li>

                      <li>
                        • Never share your admin credentials with anyone.
                      </li>

                      <li>
                        • Sign out after using the dashboard on shared devices.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
        </HoverCard>
      </div>
    </main>
  );
}

type RequirementItemProps = {
  met: boolean;
  text: string;
};

function RequirementItem({
  met,
  text,
}: RequirementItemProps) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${
        met
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      <div
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${
          met
            ? "bg-green-600 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        <AuthIcon
          aria-hidden="true"
          className={
            met
              ? "fa-solid fa-check"
              : "fa-solid fa-minus"
          }
        />
      </div>

      <span className="text-xs font-bold">
        {text}
      </span>
    </li>
  );
}
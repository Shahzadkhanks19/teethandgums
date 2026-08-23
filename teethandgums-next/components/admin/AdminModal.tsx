"use client";

import { useEffect, useId, useRef } from "react";

import AdminIcon from "./AdminIcon";
type AdminModalProps = {
  title: string;
  description?: string;
  icon?: string;
  tone?: "blue" | "red" | "amber" | "green";
  maxWidth?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
};

const toneClasses = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  red: "bg-red-50 text-red-700 border-red-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  green: "bg-green-50 text-green-700 border-green-100",
};

const widthClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AdminModal({
  title,
  description,
  icon = "fa-solid fa-circle-info",
  tone = "blue",
  maxWidth = "lg",
  children,
  footer,
  onClose,
}: AdminModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ||
          [],
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`flex max-h-[92dvh] w-full ${widthClasses[maxWidth]} flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl outline-none sm:rounded-[30px]`}
      >
        <div className="flex items-start gap-4 border-b border-slate-100 p-5 sm:p-6">
          <div
            aria-hidden="true"
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border text-xl ${toneClasses[tone]}`}
          >
            <AdminIcon className={icon} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="mt-2 text-sm font-semibold leading-6 text-slate-500 sm:text-base"
              >
                {description}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
            aria-label="Close modal"
          >
            <AdminIcon aria-hidden="true" className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
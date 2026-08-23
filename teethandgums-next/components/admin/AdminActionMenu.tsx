"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import AdminIcon from "./AdminIcon";
export type AdminActionItem = {
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  hidden?: boolean;
};

type AdminActionMenuProps = {
  items: AdminActionItem[];
};

type MenuPosition = {
  top: number;
  left: number;
};

const MENU_WIDTH = 224;
const VIEWPORT_GAP = 12;

export default function AdminActionMenu({ items }: AdminActionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });

  const visibleItems = useMemo(
    () => items.filter((item) => !item.hidden),
    [items],
  );

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const menuHeight = Math.min(visibleItems.length * 48 + 16, 360);
    const rect = button.getBoundingClientRect();

    let top = rect.bottom + 8;
    let left = rect.right - MENU_WIDTH;

    left = Math.max(
      VIEWPORT_GAP,
      Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_GAP),
    );

    if (top + menuHeight > window.innerHeight - VIEWPORT_GAP) {
      top = rect.top - menuHeight - 8;
    }

    setPosition({ top: Math.max(VIEWPORT_GAP, top), left });
  }, [visibleItems.length]);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => buttonRef.current?.focus());
    }
  }, []);

  const toggleMenu = () => {
    if (open) {
      closeMenu();
      return;
    }

    updatePosition();
    setOpen(true);
    window.requestAnimationFrame(() => firstItemRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      closeMenu();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition, { passive: true });
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [closeMenu, open, updatePosition]);

  if (visibleItems.length === 0) {
    return <span className="text-sm font-bold text-slate-400">No actions</span>;
  }

  const menu = (
    <div
      ref={menuRef}
      id="admin-action-menu"
      role="menu"
      aria-label="Available actions"
      style={{ top: position.top, left: position.left }}
      className="fixed z-[999999] max-h-[360px] w-56 overflow-y-auto rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,.20)]"
    >
      {visibleItems.map((item, index) => (
        <button
          ref={index === 0 ? firstItemRef : undefined}
          key={item.label}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={() => {
            if (item.disabled) return;
            item.onClick();
            closeMenu();
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
            item.danger
              ? "text-red-600 hover:bg-red-50"
              : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          }`}
        >
          <AdminIcon aria-hidden="true" className={`${item.icon} w-5 text-center`} />
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        aria-label="Open actions menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="admin-action-menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
      >
        <AdminIcon aria-hidden="true" className="fa-solid fa-ellipsis-vertical" />
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </>
  );
}
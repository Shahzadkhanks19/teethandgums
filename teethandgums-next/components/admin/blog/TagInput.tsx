"use client";

import {
  useState,
  type KeyboardEvent,
} from "react";

import AdminIcon from "@/components/admin/AdminIcon";

type TagInputProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxItems?: number;
};

export default function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  maxItems = 20,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const normalized = input
      .trim()
      .toLowerCase()
      .slice(0, 60);

    if (
      !normalized ||
      value.includes(normalized) ||
      value.length >= maxItems
    ) {
      setInput("");
      return;
    }

    onChange([...value, normalized]);
    setInput("");
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
      return;
    }

    if (
      event.key === "Backspace" &&
      !input &&
      value.length > 0
    ) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      <label
        htmlFor={`tag-input-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="mb-2 block text-sm font-black text-slate-700"
      >
        {label}
      </label>

      <div className="rounded-2xl border border-blue-100 bg-white p-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        {value.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {value.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() =>
                    onChange(
                      value.filter((item) => item !== tag),
                    )
                  }
                  className="grid h-5 w-5 place-items-center rounded-full bg-white text-blue-700"
                >
                  <AdminIcon
                    aria-hidden="true"
                    className="fa-solid fa-xmark"
                  />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          id={`tag-input-${label.replace(/\s+/g, "-").toLowerCase()}`}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          disabled={value.length >= maxItems}
          className="w-full border-0 bg-transparent px-1 py-1 font-semibold text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
      </div>

      <p className="mt-2 text-xs font-semibold text-slate-400">
        {value.length}/{maxItems} · Press Enter or comma to add
      </p>
    </div>
  );
}

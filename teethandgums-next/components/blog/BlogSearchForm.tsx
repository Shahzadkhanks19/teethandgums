"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Suggestion = { title: string; slug: string; excerpt: string };

export default function BlogSearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) return;

    const currentRequest = ++requestId.current;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/blog/search/suggestions?q=${encodeURIComponent(value)}`);
        const data = (await response.json()) as { suggestions?: Suggestion[] };
        if (currentRequest === requestId.current) {
          setSuggestions(data.suggestions || []);
          setOpen(true);
        }
      } catch {
        if (currentRequest === requestId.current) setSuggestions([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <form action="/blog/search" className="relative flex flex-col gap-3 rounded-[26px] border border-blue-100 bg-white p-4 shadow-[0_15px_45px_rgba(37,99,235,.09)] sm:flex-row">
      <label className="min-w-0 flex-1">
        <span className="sr-only">Search dental articles</span>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (value.trim().length < 2) {
              setSuggestions([]);
              setOpen(false);
            }
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          minLength={2}
          maxLength={100}
          autoComplete="off"
          placeholder="Search dental care, implants, braces..."
          className="min-h-13 w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </label>
      <button type="submit" className="min-h-13 rounded-2xl bg-blue-700 px-6 py-3 font-black text-white transition hover:bg-blue-900">Search Articles</button>

      {open && suggestions.length > 0 && (
        <div className="absolute left-4 right-4 top-[76px] z-30 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl sm:right-40">
          {suggestions.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`} className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-blue-50">
              <span className="block font-black text-slate-900">{item.title}</span>
              <span className="mt-1 line-clamp-1 block text-sm text-slate-500">{item.excerpt}</span>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}

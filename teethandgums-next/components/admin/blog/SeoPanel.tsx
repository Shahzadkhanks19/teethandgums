"use client";

import TagInput from "./TagInput";
import type { BlogEditorValues } from "./BlogTypes";

type SeoPanelProps = {
  values: BlogEditorValues;
  updateField: <Key extends keyof BlogEditorValues>(
    key: Key,
    value: BlogEditorValues[Key],
  ) => void;
};

export default function SeoPanel({
  values,
  updateField,
}: SeoPanelProps) {
  const previewTitle =
    values.metaTitle.trim() ||
    values.title.trim() ||
    "Dental Blog Article";

  const previewDescription =
    values.metaDescription.trim() ||
    values.excerpt.trim() ||
    "Dental care information from Teeth and Gums Care in Jodhpur.";

  const siteUrl =
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    "https://www.shahzadtestsite.co.in";

  return (
    <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)]">
      <h2 className="text-xl font-black text-slate-900">
        SEO Settings
      </h2>

      <div className="mt-5 grid gap-5">
        <label>
          <span className="mb-2 flex justify-between gap-4 text-sm font-black text-slate-700">
            Meta Title
            <span className="text-xs text-slate-400">
              {values.metaTitle.length}/70
            </span>
          </span>

          <input
            type="text"
            value={values.metaTitle}
            maxLength={70}
            onChange={(event) =>
              updateField("metaTitle", event.target.value)
            }
            placeholder={values.title || "SEO page title"}
            className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label>
          <span className="mb-2 flex justify-between gap-4 text-sm font-black text-slate-700">
            Meta Description
            <span className="text-xs text-slate-400">
              {values.metaDescription.length}/180
            </span>
          </span>

          <textarea
            rows={4}
            value={values.metaDescription}
            maxLength={180}
            onChange={(event) =>
              updateField("metaDescription", event.target.value)
            }
            placeholder={values.excerpt || "Search-result description"}
            className="w-full resize-y rounded-xl border border-blue-100 px-4 py-3 font-semibold leading-7 text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <TagInput
          label="SEO Keywords"
          value={values.keywords}
          onChange={(keywords) =>
            updateField("keywords", keywords)
          }
          maxItems={20}
        />

        <label>
          <span className="mb-2 block text-sm font-black text-slate-700">
            Canonical URL
          </span>

          <input
            type="url"
            value={values.canonicalUrl}
            onChange={(event) =>
              updateField("canonicalUrl", event.target.value)
            }
            placeholder={`${siteUrl}/blog/${values.slug || "article-slug"}`}
            className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-blue-100 p-4 font-black text-slate-700">
            <input
              type="checkbox"
              checked={values.robotsIndex}
              onChange={(event) =>
                updateField("robotsIndex", event.target.checked)
              }
              className="h-5 w-5 accent-blue-600"
            />
            Allow indexing
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-blue-100 p-4 font-black text-slate-700">
            <input
              type="checkbox"
              checked={values.robotsFollow}
              onChange={(event) =>
                updateField("robotsFollow", event.target.checked)
              }
              className="h-5 w-5 accent-blue-600"
            />
            Follow links
          </label>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-green-700">
            Search Preview
          </p>
          <p className="mt-2 text-lg font-bold leading-6 text-blue-800">
            {previewTitle}
          </p>
          <p className="mt-1 break-all text-sm text-green-700">
            {values.canonicalUrl ||
              `${siteUrl}/blog/${values.slug || "article-slug"}`}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {previewDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

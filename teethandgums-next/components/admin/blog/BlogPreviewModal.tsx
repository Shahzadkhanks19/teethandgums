"use client";

import DOMPurify from "isomorphic-dompurify";

import AdminModal from "@/components/admin/AdminModal";
import type { BlogEditorValues } from "./BlogTypes";

type BlogPreviewModalProps = {
  values: BlogEditorValues;
  onClose: () => void;
};

export default function BlogPreviewModal({
  values,
  onClose,
}: BlogPreviewModalProps) {
  const sanitizedContent = DOMPurify.sanitize(values.content);

  return (
    <AdminModal
      title="Article Preview"
      description="Preview the article content before publishing."
      icon="fa-solid fa-eye"
      maxWidth="xl"
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white"
        >
          Close Preview
        </button>
      }
    >
      <article className="mx-auto max-w-3xl">
        {values.featuredImage && (
          <div
            role="img"
            aria-label={values.featuredImageAlt}
            className="aspect-[16/8] w-full rounded-[24px] bg-blue-50 bg-cover bg-center"
            style={{
              backgroundImage: `url("${values.featuredImage.replace(/"/g, "%22")}")`,
            }}
          />
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {values.category && (
            <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-blue-700">
              Category selected
            </span>
          )}

          {values.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
          {values.title || "Untitled Article"}
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-500">
          {values.excerpt}
        </p>

        <div
          className="prose prose-slate mt-8 max-w-none"
          dangerouslySetInnerHTML={{
            __html: sanitizedContent,
          }}
        />
      </article>
    </AdminModal>
  );
}

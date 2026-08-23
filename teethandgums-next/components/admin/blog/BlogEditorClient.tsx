"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";

import AdminIcon from "@/components/admin/AdminIcon";
import {
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

import BlogImageUploader from "./BlogImageUploader";
import BlogPreviewModal from "./BlogPreviewModal";
import FaqBuilder from "./FaqBuilder";
import PublishingPanel from "./PublishingPanel";
import SeoPanel from "./SeoPanel";
import TagInput from "./TagInput";
import TiptapEditor from "./TiptapEditor";
import useBlogLocalAutosave from "./useBlogLocalAutosave";

import type {
  BlogApiRecord,
  BlogCategoryOption,
  BlogEditorErrors,
  BlogEditorValues,
  BlogStatus,
} from "./BlogTypes";

import {
  createEditorSlug,
  getEditorReadingTime,
  getEditorWordCount,
  initialBlogEditorValues,
  stripEditorHtml,
  validateBlogEditor,
} from "./BlogValidation";

type BlogEditorClientProps = {
  blogId?: string;
};

type BlogApiResponse = {
  success?: boolean;
  message?: string;
  blog?: BlogApiRecord;
};

type CategoryApiResponse = {
  success?: boolean;
  message?: string;
  categories?: BlogCategoryOption[];
};

function getCategoryId(
  category: BlogApiRecord["category"],
): string {
  if (!category) return "";

  return typeof category === "string"
    ? category
    : category._id;
}

function toEditorValues(
  blog: BlogApiRecord,
): BlogEditorValues {
  return {
    title: blog.title || "",
    slug: blog.slug || "",
    excerpt: blog.excerpt || "",
    content: blog.content || "<p></p>",
    category: getCategoryId(blog.category),
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    featuredImage:
      blog.featuredImage || "/images/logo/logo.webp",
    featuredImageAlt:
      blog.featuredImageAlt || blog.title || "Dental article",
    ogImage: blog.ogImage || "",
    authorName: blog.authorName || "Teeth and Gums Care",
    authorRole: blog.authorRole || "Dental Care Team",
    status: blog.status || "draft",
    isFeatured: Boolean(blog.isFeatured),
    isPinned: Boolean(blog.isPinned),
    allowComments: Boolean(blog.allowComments),
    metaTitle: blog.metaTitle || "",
    metaDescription: blog.metaDescription || "",
    keywords: Array.isArray(blog.keywords)
      ? blog.keywords
      : [],
    canonicalUrl: blog.canonicalUrl || "",
    robotsIndex: blog.robotsIndex !== false,
    robotsFollow: blog.robotsFollow !== false,
    faqs: Array.isArray(blog.faqs) ? blog.faqs : [],
    scheduledAt: blog.scheduledAt
      ? new Date(blog.scheduledAt).toISOString().slice(0, 16)
      : "",
  };
}

export default function BlogEditorClient({
  blogId,
}: BlogEditorClientProps) {
  const router = useRouter();
  const editing = Boolean(blogId);

  const [values, setValues] =
    useState<BlogEditorValues>(initialBlogEditorValues);
  const [categories, setCategories] = useState<
    BlogCategoryOption[]
  >([]);
  const [errors, setErrors] =
    useState<BlogEditorErrors>({});
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  const localAutosaveKey = `teethandgums-blog-draft-${blogId || "new"}`;
  const {
    storedDraft,
    lastLocalSave,
    clearStoredDraft,
    dismissStoredDraft,
  } = useBlogLocalAutosave(localAutosaveKey, values, dirty);

  const savedSnapshotRef = useRef(
    JSON.stringify(initialBlogEditorValues),
  );

  const wordCount = useMemo(
    () => getEditorWordCount(values.content),
    [values.content],
  );

  const characterCount = useMemo(
    () => stripEditorHtml(values.content).length,
    [values.content],
  );

  const readingTime = useMemo(
    () => getEditorReadingTime(values.content),
    [values.content],
  );

  const fetchCategories = useCallback(async () => {
    const response = await adminFetch(
      "/api/admin/blog-categories",
    );

    const data = (await response.json().catch(() => null)) as
      | CategoryApiResponse
      | null;

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to load blog categories",
      );
    }

    setCategories(
      (data?.categories || []).filter(
        (category) => category.isActive !== false,
      ),
    );
  }, []);

  const fetchBlog = useCallback(async () => {
    if (!blogId) return;

    const response = await adminFetch(
      `/api/admin/blogs/${blogId}`,
    );

    const data = (await response.json().catch(() => null)) as
      | BlogApiResponse
      | null;

    if (!response.ok || !data?.blog) {
      throw new Error(data?.message || "Failed to load blog");
    }

    const nextValues = toEditorValues(data.blog);
    setValues(nextValues);
    savedSnapshotRef.current = JSON.stringify(nextValues);
    setDirty(false);
  }, [blogId]);

  const loadEditor = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      await Promise.all([
        fetchCategories(),
        editing ? fetchBlog() : Promise.resolve(),
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to prepare the blog editor";

      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [editing, fetchBlog, fetchCategories]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void loadEditor();
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [loadEditor]);


  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      );
    };
  }, [dirty]);

  const updateField = <Key extends keyof BlogEditorValues>(
    key: Key,
    value: BlogEditorValues[Key],
  ) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
    setDirty(true);

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
      general: undefined,
    }));
  };

  const handleTitleChange = (title: string) => {
    setDirty(true);
    setValues((previous) => ({
      ...previous,
      title,
      slug: slugTouched
        ? previous.slug
        : createEditorSlug(title),
      featuredImageAlt:
        previous.featuredImageAlt ===
          "Teeth and Gums Care dental article" ||
        !previous.featuredImageAlt.trim()
          ? title
            ? `${title} - Teeth and Gums Care`
            : "Teeth and Gums Care dental article"
          : previous.featuredImageAlt,
      metaTitle:
        !previous.metaTitle.trim() ||
        previous.metaTitle === previous.title
          ? title.slice(0, 70)
          : previous.metaTitle,
    }));

    setErrors((previous) => ({
      ...previous,
      title: undefined,
      slug: undefined,
      general: undefined,
    }));
  };

  const focusFirstError = (
    nextErrors: BlogEditorErrors,
  ) => {
    const fieldOrder: Array<keyof BlogEditorErrors> = [
      "title",
      "slug",
      "excerpt",
      "content",
      "featuredImage",
      "featuredImageAlt",
      "metaTitle",
      "metaDescription",
      "scheduledAt",
    ];

    const first = fieldOrder.find(
      (field) => nextErrors[field],
    );

    if (!first) return;

    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(
          `[data-blog-field="${first}"]`,
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });
  };

  const saveBlog = async (status: BlogStatus) => {
    if (saving) return;

    const nextValues: BlogEditorValues = {
      ...values,
      status,
      slug:
        values.slug.trim() ||
        createEditorSlug(values.title),
      ogImage:
        values.ogImage.trim() || values.featuredImage.trim(),
    };

    const nextErrors = validateBlogEditor(nextValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please correct the highlighted fields.");
      focusFirstError(nextErrors);
      return;
    }

    try {
      setSaving(true);

      const response = await adminFetch(
        editing
          ? `/api/admin/blogs/${blogId}`
          : "/api/admin/blogs",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nextValues),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | BlogApiResponse
        | null;

      if (!response.ok || !data?.blog) {
        const message =
          data?.message || "Failed to save blog";

        setErrors((previous) => ({
          ...previous,
          general: message,
        }));
        toast.error(message);
        return;
      }

      const savedValues = toEditorValues(data.blog);
      setValues(savedValues);
      savedSnapshotRef.current = JSON.stringify(savedValues);
      setDirty(false);
      clearStoredDraft();

      toast.success(
        status === "published"
          ? "Blog published successfully"
          : status === "scheduled"
            ? "Blog scheduled successfully"
            : status === "archived"
              ? "Blog archived successfully"
              : editing
                ? "Blog draft updated successfully"
                : "Blog draft created successfully",
      );

      if (!editing) {
        router.replace(
          `/admin/dashboard/blogs/${data.blog._id}/edit`,
        );
        router.refresh();
      }
    } catch {
      const message =
        "Unable to connect to the server. Please try again.";

      setErrors((previous) => ({
        ...previous,
        general: message,
      }));
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLoadingState
        text={editing ? "Loading blog editor..." : "Preparing editor..."}
        description="Loading categories, article content and publishing information."
      />
    );
  }

  if (loadError) {
    return (
      <AdminErrorState
        text="Unable to open blog editor"
        description={loadError}
        onRetry={loadEditor}
      />
    );
  }

  return (
    <>
      <section
        aria-labelledby="blog-editor-title"
        className="space-y-6"
      >
        {storedDraft && (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-amber-900">
                  A locally autosaved draft is available
                </p>
                <p className="mt-1 text-sm font-semibold text-amber-700">
                  Saved {new Date(storedDraft.savedAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setValues(storedDraft.values);
                    setDirty(true);
                    dismissStoredDraft();
                    toast.success("Local draft restored");
                  }}
                  className="rounded-xl bg-amber-500 px-4 py-2.5 font-black text-white"
                >
                  Restore Draft
                </button>

                <button
                  type="button"
                  onClick={clearStoredDraft}
                  className="rounded-xl border border-amber-300 bg-white px-4 py-2.5 font-black text-amber-800"
                >
                  Discard Local Copy
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                prefetch={false}
                href="/admin/dashboard/blogs"
                onClick={(event) => {
                  if (
                    dirty &&
                    !window.confirm(
                      "You have unsaved changes. Leave this page?",
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl text-sm font-black text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <AdminIcon
                  aria-hidden="true"
                  className="fa-solid fa-arrow-left"
                />
                Back to Blog Manager
              </Link>

              <span className="mt-5 block text-xs font-black uppercase tracking-[0.14em] text-blue-600">
                {editing ? "Edit Article" : "New Article"}
              </span>

              <h1
                id="blog-editor-title"
                className="mt-2 text-3xl font-black text-slate-900"
              >
                {editing
                  ? "Edit Blog Article"
                  : "Create New Blog"}
              </h1>

              <p className="mt-2 max-w-2xl leading-7 text-slate-500">
                Write, optimize, preview and publish a complete dental article.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 font-black text-blue-700"
              >
                <AdminIcon
                  aria-hidden="true"
                  className="fa-solid fa-eye mr-3"
                />
                Preview
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void saveBlog("draft")}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-3 font-black text-white shadow-lg transition motion-safe:hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <AdminIcon
                  aria-hidden="true"
                  className={
                    saving
                      ? "fa-solid fa-spinner fa-spin mr-3"
                      : "fa-solid fa-circle-check mr-3"
                  }
                />
                {saving ? "Saving..." : "Save Draft"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              ["Words", wordCount],
              ["Characters", characterCount],
              ["Reading Time", `${readingTime} min`],
              ["Status", values.status],
              ["Changes", dirty ? "Unsaved" : "Saved"],
              [
                "Autosave",
                lastLocalSave
                  ? new Date(lastLocalSave).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Waiting",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
              >
                <strong className="block text-xl font-black capitalize text-blue-700">
                  {value}
                </strong>
                <span className="mt-1 block text-xs font-black text-slate-500">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {errors.general && (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold leading-7 text-red-700"
            >
              {errors.general}
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)] md:p-7">
              <h2 className="text-xl font-black text-slate-900">
                Article Details
              </h2>

              <div className="mt-6 grid gap-5">
                <div data-blog-field="title">
                  <label
                    htmlFor="blog-title"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    Blog Title *
                  </label>

                  <input
                    id="blog-title"
                    type="text"
                    value={values.title}
                    maxLength={180}
                    aria-invalid={Boolean(errors.title)}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                    className={`min-h-14 w-full rounded-2xl border bg-white px-4 py-3 font-bold text-slate-800 outline-none transition ${
                      errors.title
                        ? "border-red-400 ring-4 ring-red-100"
                        : "border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />

                  <div className="mt-2 flex justify-between gap-4 text-xs font-semibold">
                    <span className="text-red-600">
                      {errors.title || ""}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      {values.title.length}/180
                    </span>
                  </div>
                </div>

                <div data-blog-field="slug">
                  <label
                    htmlFor="blog-slug"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    URL Slug *
                  </label>

                  <div className="flex overflow-hidden rounded-2xl border border-blue-100 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                    <span className="hidden items-center bg-blue-50 px-4 text-sm font-black text-blue-700 sm:flex">
                      /blog/
                    </span>

                    <input
                      id="blog-slug"
                      type="text"
                      value={values.slug}
                      maxLength={180}
                      onChange={(event) => {
                        setSlugTouched(true);
                        updateField(
                          "slug",
                          createEditorSlug(event.target.value),
                        );
                      }}
                      className="min-h-14 min-w-0 flex-1 border-0 bg-white px-4 py-3 font-bold text-slate-800 outline-none"
                    />
                  </div>

                  {errors.slug && (
                    <p className="mt-2 text-xs font-bold text-red-600">
                      {errors.slug}
                    </p>
                  )}
                </div>

                <div data-blog-field="excerpt">
                  <label
                    htmlFor="blog-excerpt"
                    className="mb-2 block text-sm font-black text-slate-700"
                  >
                    Article Excerpt *
                  </label>

                  <textarea
                    id="blog-excerpt"
                    rows={4}
                    value={values.excerpt}
                    maxLength={500}
                    onChange={(event) =>
                      updateField("excerpt", event.target.value)
                    }
                    className={`w-full resize-y rounded-2xl border bg-white px-4 py-3 font-semibold leading-7 text-slate-700 outline-none transition ${
                      errors.excerpt
                        ? "border-red-400 ring-4 ring-red-100"
                        : "border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />

                  <div className="mt-2 flex justify-between gap-4 text-xs font-semibold">
                    <span className="text-red-600">
                      {errors.excerpt || ""}
                    </span>
                    <span className="shrink-0 text-slate-400">
                      {values.excerpt.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section
              data-blog-field="content"
              className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)] md:p-7"
            >
              <h2 className="text-xl font-black text-slate-900">
                Article Content *
              </h2>

              <div className="mt-5">
                <TiptapEditor
                  value={values.content}
                  invalid={Boolean(errors.content)}
                  onChange={(content) =>
                    updateField("content", content)
                  }
                />
              </div>

              {errors.content && (
                <p className="mt-3 text-sm font-bold text-red-600">
                  {errors.content}
                </p>
              )}
            </section>

            <FaqBuilder
              value={values.faqs}
              onChange={(faqs) => updateField("faqs", faqs)}
            />
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)]">
              <h2 className="text-xl font-black text-slate-900">
                Organization
              </h2>

              <div className="mt-5 grid gap-5">
                <label>
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    Category
                  </span>

                  <select
                    value={values.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    className="min-h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <TagInput
                  label="Tags"
                  value={values.tags}
                  onChange={(tags) =>
                    updateField("tags", tags)
                  }
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)]">
              <h2 className="text-xl font-black text-slate-900">
                Article Images
              </h2>

              <div className="mt-5 grid gap-5">
                <div data-blog-field="featuredImage">
                  <BlogImageUploader
                    label="Featured Image"
                    value={values.featuredImage}
                    onChange={(value) =>
                      updateField("featuredImage", value)
                    }
                    required
                    error={errors.featuredImage}
                  />
                </div>

                <div data-blog-field="featuredImageAlt">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Featured Image Alt Text *
                  </label>

                  <input
                    type="text"
                    value={values.featuredImageAlt}
                    maxLength={220}
                    onChange={(event) =>
                      updateField(
                        "featuredImageAlt",
                        event.target.value,
                      )
                    }
                    className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {errors.featuredImageAlt && (
                    <p className="mt-2 text-xs font-bold text-red-600">
                      {errors.featuredImageAlt}
                    </p>
                  )}
                </div>

                <BlogImageUploader
                  label="Open Graph Image"
                  value={values.ogImage}
                  onChange={(value) =>
                    updateField("ogImage", value)
                  }
                  helperText="Optional. Featured image is used when empty."
                />
              </div>
            </section>

            <SeoPanel
              values={values}
              updateField={updateField}
            />

            <PublishingPanel
              values={values}
              saving={saving}
              updateField={updateField}
              onSave={(status) => void saveBlog(status)}
            />
          </aside>
        </div>
      </section>

      {previewOpen && (
        <BlogPreviewModal
          values={values}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

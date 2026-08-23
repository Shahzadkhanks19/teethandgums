"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";

import AdminActionMenu from "@/components/admin/AdminActionMenu";
import AdminIcon from "@/components/admin/AdminIcon";
import AdminModal from "@/components/admin/AdminModal";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type CategoryResponse = {
  success?: boolean;
  message?: string;
  categories?: Category[];
  category?: Category;
};

const initialForm = {
  name: "",
  slug: "",
  description: "",
  color: "#2563eb",
  isActive: true,
  sortOrder: 0,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch(
        "/api/admin/blog-categories",
      );

      const data = (await response.json().catch(() => null)) as
        | CategoryResponse
        | null;

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch categories",
        );
      }

      setCategories(data?.categories || []);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch categories";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void fetchCategories();
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) =>
      [
        category.name,
        category.slug,
        category.description,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [categories, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setFormOpen(true);
  };

  const saveCategory = async () => {
    if (form.name.trim().length < 2) {
      toast.error("Enter a valid category name");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch(
        editing
          ? `/api/admin/blog-categories/${editing._id}`
          : "/api/admin/blog-categories",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            slug: form.slug || makeSlug(form.name),
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | CategoryResponse
        | null;

      if (!response.ok || !data?.category) {
        toast.error(data?.message || "Failed to save category");
        return;
      }

      toast.success(
        editing
          ? "Category updated successfully"
          : "Category created successfully",
      );

      setFormOpen(false);
      setEditing(null);
      setForm(initialForm);
      await fetchCategories();
    } catch {
      toast.error("Server error while saving category");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!deleting) return;

    try {
      setActionLoading(true);

      const response = await adminFetch(
        `/api/admin/blog-categories/${deleting._id}`,
        {
          method: "DELETE",
        },
      );

      const data = (await response.json().catch(() => null)) as
        | CategoryResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete category");
        return;
      }

      toast.success("Category deleted successfully");
      setDeleting(null);
      await fetchCategories();
    } catch {
      toast.error("Server error while deleting category");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLoadingState
        text="Loading blog categories..."
        description="Preparing category organization and visibility settings."
      />
    );
  }

  if (error) {
    return (
      <AdminErrorState
        text="Unable to load categories"
        description={error}
        onRetry={fetchCategories}
      />
    );
  }

  return (
    <>
      <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              Blog Organization
            </span>

            <h1 className="mt-4 text-3xl font-black text-slate-900">
              Blog Categories
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              Create and organize categories used throughout the blog CMS.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-3 font-black text-white"
          >
            <AdminIcon
              aria-hidden="true"
              className="fa-solid fa-layer-group mr-3"
            />
            New Category
          </button>
        </div>

        <label className="relative mt-7 block">
          <span className="sr-only">Search categories</span>
          <AdminIcon
            aria-hidden="true"
            className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="min-h-14 w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-3 pl-12 pr-4 font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        {filteredCategories.length === 0 ? (
          <div className="mt-7">
            <AdminEmptyState
              text="No categories found."
              description="Create a category or adjust your search."
            />
          </div>
        ) : (
          <div className="mt-7 grid gap-4">
            {filteredCategories.map((category) => (
              <article
                key={category._id}
                className="flex flex-col gap-4 rounded-[24px] border border-blue-100 bg-white p-5 sm:flex-row sm:items-center"
              >
                <span
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 rounded-2xl border border-white shadow"
                  style={{ backgroundColor: category.color }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      {category.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-bold text-blue-600">
                    /blog/category/{category.slug}
                  </p>

                  <p className="mt-2 leading-7 text-slate-500">
                    {category.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                    Order {category.sortOrder}
                  </span>

                  <AdminActionMenu
                    items={[
                      {
                        label: "Edit Category",
                        icon: "fa-solid fa-gear",
                        onClick: () => openEdit(category),
                      },
                      {
                        label: "Delete Category",
                        icon: "fa-solid fa-trash-can",
                        danger: true,
                        onClick: () => setDeleting(category),
                      },
                    ]}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {formOpen && (
        <AdminModal
          title={editing ? "Edit Category" : "Create Category"}
          description="Configure the category name, URL, color and visibility."
          icon="fa-solid fa-layer-group"
          maxWidth="lg"
          onClose={() => setFormOpen(false)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-2xl border border-blue-200 bg-white px-5 py-3 font-black text-blue-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void saveCategory()}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading ? "Saving..." : "Save Category"}
              </button>
            </div>
          }
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-black text-slate-700">
                Name
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                    slug:
                      editing || previous.slug
                        ? previous.slug
                        : makeSlug(event.target.value),
                  }))
                }
                className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-black text-slate-700">
                Slug
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    slug: makeSlug(event.target.value),
                  }))
                }
                className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-black text-slate-700">
                Description
              </span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-blue-100 px-4 py-3 font-semibold leading-7 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-black text-slate-700">
                Color
              </span>
              <input
                type="color"
                value={form.color}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    color: event.target.value,
                  }))
                }
                className="h-12 w-full rounded-xl border border-blue-100 bg-white p-2"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-black text-slate-700">
                Sort Order
              </span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    sortOrder: Number(event.target.value) || 0,
                  }))
                }
                className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-blue-100 p-4 font-black text-slate-700 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    isActive: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-blue-600"
              />
              Category is active
            </label>
          </div>
        </AdminModal>
      )}

      {deleting && (
        <AdminModal
          title="Delete Category"
          description="Categories assigned to blogs cannot be deleted."
          icon="fa-solid fa-trash-can"
          tone="red"
          maxWidth="md"
          onClose={() => setDeleting(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void deleteCategory()}
                className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          }
        >
          <p className="rounded-2xl border border-red-100 bg-red-50 p-5 font-black text-red-800">
            {deleting.name}
          </p>
        </AdminModal>
      )}
    </>
  );
}

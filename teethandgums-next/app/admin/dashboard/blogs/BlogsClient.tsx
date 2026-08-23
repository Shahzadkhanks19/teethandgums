"use client";

import { useRouter } from "next/navigation";
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

type BlogStatus = "draft" | "published" | "scheduled" | "archived";

type BlogCategory = {
  _id: string;
  name: string;
  slug: string;
  color?: string;
};

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featuredImage: string;
  featuredImageAlt: string;
  ogImage?: string;
  category?: BlogCategory | null;
  tags: string[];
  authorName: string;
  authorRole?: string;
  status: BlogStatus;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments?: boolean;
  readingTime: number;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type BlogCounts = {
  total: number;
  draft: number;
  published: number;
  scheduled: number;
  archived: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type BlogsApiResponse = {
  success?: boolean;
  message?: string;
  blogs?: Blog[];
  blog?: Blog;
  deletedCount?: number;
  counts?: BlogCounts;
  pagination?: Pagination;
};

type CategoriesApiResponse = {
  success?: boolean;
  message?: string;
  categories?: BlogCategory[];
};

const statusFilters: Array<"all" | BlogStatus> = [
  "all",
  "draft",
  "published",
  "scheduled",
  "archived",
];

const initialCounts: BlogCounts = {
  total: 0,
  draft: 0,
  published: 0,
  scheduled: 0,
  archived: 0,
};

const initialPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 1,
};

const statusStyles: Record<BlogStatus, string> = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  published: "border-green-200 bg-green-100 text-green-700",
  scheduled: "border-amber-200 bg-amber-100 text-amber-700",
  archived: "border-violet-200 bg-violet-100 text-violet-700",
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeCsv(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function getCategoryName(blog: Blog) {
  return blog.category?.name || "Uncategorized";
}

function StatusPill({ status }: { status: BlogStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-black capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function BlogImage({
  blog,
  className = "",
}: {
  blog: Blog;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={blog.featuredImageAlt || blog.title}
      className={`shrink-0 bg-gradient-to-br from-blue-50 to-cyan-50 bg-cover bg-center ${className}`}
      style={{
        backgroundImage: blog.featuredImage
          ? `url("${blog.featuredImage.replace(/"/g, "%22")}")`
          : undefined,
      }}
    >
      {!blog.featuredImage && (
        <span className="grid h-full w-full place-items-center text-2xl text-blue-500">
          <AdminIcon aria-hidden="true" className="fa-solid fa-layer-group" />
        </span>
      )}
    </div>
  );
}

export default function BlogsClient() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [counts, setCounts] = useState<BlogCounts>(initialCounts);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);
    const [minimumScheduleDate] = useState(() =>
  new Date(Date.now() + 60_000).toISOString().slice(0, 16),
);

  const [statusFilter, setStatusFilter] =
    useState<(typeof statusFilters)[number]>("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null);
  const [scheduleBlog, setScheduleBlog] = useState<Blog | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPagination((previous) => ({
        ...previous,
        page: 1,
      }));
    }, 350);

    return () => globalThis.clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await adminFetch("/api/admin/blog-categories");
      const data = (await response.json().catch(() => null)) as
        | CategoriesApiResponse
        | null;

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch blog categories",
        );
      }

      setCategories(data?.categories || []);
    } catch (categoryError) {
      console.error("Blog category fetch failed:", categoryError);
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const searchParams = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });

      if (statusFilter !== "all") {
        searchParams.set("status", statusFilter);
      }

      if (categoryFilter) {
        searchParams.set("category", categoryFilter);
      }

      if (searchTerm) {
        searchParams.set("search", searchTerm);
      }

      const response = await adminFetch(
        `/api/admin/blogs?${searchParams.toString()}`,
      );

      const data = (await response.json().catch(() => null)) as
        | BlogsApiResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch blogs");
      }

      setBlogs(data?.blogs || []);
      setCounts(data?.counts || initialCounts);
      setPagination(
        data?.pagination || {
          ...initialPagination,
          page: pagination.page,
          limit: pagination.limit,
        },
      );

      setSelectedIds((previous) =>
        previous.filter((id) =>
          (data?.blogs || []).some((blog) => blog._id === id),
        ),
      );
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch blogs";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [
    categoryFilter,
    pagination.limit,
    pagination.page,
    searchTerm,
    statusFilter,
  ]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void Promise.all([fetchBlogs(), fetchCategories()]);
    }, 80);

    return () => globalThis.clearTimeout(timeoutId);
  }, [fetchBlogs, fetchCategories]);

  const selectedAll =
    blogs.length > 0 &&
    blogs.every((blog) => selectedIds.includes(blog._id));

  const selectedBlogs = useMemo(
    () => blogs.filter((blog) => selectedIds.includes(blog._id)),
    [blogs, selectedIds],
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedAll ? [] : blogs.map((blog) => blog._id));
  };

  const updateLocalBlog = (updatedBlog: Blog) => {
    setBlogs((previous) =>
      previous.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog,
      ),
    );

    setViewBlog((previous) =>
      previous?._id === updatedBlog._id ? updatedBlog : previous,
    );
  };

  const updateStatus = async (
    blog: Blog,
    status: BlogStatus,
    scheduleValue?: string,
  ) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(
        `/api/admin/blogs/${blog._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            scheduledAt: scheduleValue || undefined,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | BlogsApiResponse
        | null;

      if (!response.ok || !data?.blog) {
        toast.error(data?.message || "Failed to update blog status");
        return;
      }

      updateLocalBlog(data.blog);
      toast.success(data.message || `Blog moved to ${status}`);
      setScheduleBlog(null);
      setScheduledAt("");
      await fetchBlogs();
    } catch {
      toast.error("Server error while updating the blog");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteSingleBlog = async (blog: Blog) => {
    try {
      setActionLoading(true);

      const response = await adminFetch(
        `/api/admin/blogs/${blog._id}`,
        {
          method: "DELETE",
        },
      );

      const data = (await response.json().catch(() => null)) as
        | BlogsApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete blog");
        return;
      }

      setBlogs((previous) =>
        previous.filter((item) => item._id !== blog._id),
      );
      setSelectedIds((previous) =>
        previous.filter((id) => id !== blog._id),
      );
      setDeleteBlog(null);
      setViewBlog((previous) =>
        previous?._id === blog._id ? null : previous,
      );

      toast.success(data?.message || "Blog deleted successfully");
      await fetchBlogs();
    } catch {
      toast.error("Server error while deleting the blog");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteSelectedBlogs = async () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one blog");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch(
        "/api/admin/blogs/bulk/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedIds,
          }),
        },
      );

      const data = (await response.json().catch(() => null)) as
        | BlogsApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to delete selected blogs");
        return;
      }

      setBlogs((previous) =>
        previous.filter((blog) => !selectedIds.includes(blog._id)),
      );
      setSelectedIds([]);
      setBulkDeleteOpen(false);
      toast.success(data?.message || "Selected blogs deleted");
      await fetchBlogs();
    } catch {
      toast.error("Server error while deleting selected blogs");
    } finally {
      setActionLoading(false);
    }
  };

  const duplicateBlog = async (blog: Blog) => {
    try {
      setActionLoading(true);

      const detailResponse = await adminFetch(
        `/api/admin/blogs/${blog._id}`,
      );

      const detailData = (await detailResponse.json().catch(() => null)) as
        | BlogsApiResponse
        | null;

      if (!detailResponse.ok || !detailData?.blog) {
        toast.error(
          detailData?.message || "Failed to load the blog for duplication",
        );
        return;
      }

      const source = detailData.blog;

      const response = await adminFetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...source,
          _id: undefined,
          title: `${source.title} Copy`,
          slug: "",
          status: "draft",
          isPinned: false,
          publishedAt: null,
          scheduledAt: null,
          views: 0,
          category: source.category?._id || null,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | BlogsApiResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to duplicate blog");
        return;
      }

      toast.success("Blog duplicated as a draft");
      await fetchBlogs();
    } catch {
      toast.error("Server error while duplicating the blog");
    } finally {
      setActionLoading(false);
    }
  };

  const openEditor = (blog?: Blog) => {
    const path = blog
      ? `/admin/dashboard/blogs/${blog._id}/edit`
      : "/admin/dashboard/blogs/new";

    router.push(path);
  };

  const exportCSV = () => {
    if (blogs.length === 0) {
      toast.error("No blogs available to export");
      return;
    }

    const headers = [
      "Title",
      "Slug",
      "Category",
      "Author",
      "Status",
      "Reading Time",
      "Views",
      "Featured",
      "Pinned",
      "Published",
      "Updated",
    ];

    const rows = blogs.map((blog) => [
      blog.title,
      blog.slug,
      getCategoryName(blog),
      blog.authorName,
      blog.status,
      `${blog.readingTime} min`,
      blog.views,
      blog.isFeatured ? "Yes" : "No",
      blog.isPinned ? "Yes" : "No",
      formatDate(blog.publishedAt),
      formatDate(blog.updatedAt),
    ]);

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "blogs.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    toast.success("Blog CSV exported");
  };

  const exportExcel = async () => {
    if (blogs.length === 0) {
      toast.error("No blogs available to export");
      return;
    }

    const XLSX = await import("xlsx");

    const rows = blogs.map((blog) => ({
      Title: blog.title,
      Slug: blog.slug,
      Category: getCategoryName(blog),
      Author: blog.authorName,
      Status: blog.status,
      "Reading Time": `${blog.readingTime} min`,
      Views: blog.views,
      Featured: blog.isFeatured ? "Yes" : "No",
      Pinned: blog.isPinned ? "Yes" : "No",
      Published: formatDate(blog.publishedAt),
      Updated: formatDate(blog.updatedAt),
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, sheet, "Blogs");
    XLSX.writeFile(workbook, "blogs.xlsx");

    toast.success("Blog Excel exported");
  };

  const exportPDF = async () => {
    if (blogs.length === 0) {
      toast.error("No blogs available to export");
      return;
    }

    const [{ default: jsPDF }, { default: autoTable }] =
      await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

    const document = new jsPDF({
      orientation: "landscape",
    });

    document.text("Teeth and Gums Care - Blog Report", 14, 15);

    autoTable(document, {
      startY: 22,
      head: [
        [
          "Title",
          "Category",
          "Author",
          "Status",
          "Reading",
          "Views",
          "Updated",
        ],
      ],
      body: blogs.map((blog) => [
        blog.title,
        getCategoryName(blog),
        blog.authorName,
        blog.status,
        `${blog.readingTime} min`,
        String(blog.views),
        formatDate(blog.updatedAt),
      ]),
    });

    document.save("blogs.pdf");
    toast.success("Blog PDF exported");
  };

  const actionItems = (blog: Blog) => [
    {
      label: "View Details",
      icon: "fa-solid fa-eye",
      onClick: () => setViewBlog(blog),
    },
    {
      label: "Edit Blog",
      icon: "fa-solid fa-gear",
      onClick: () => openEditor(blog),
    },
    {
      label: "Publish",
      icon: "fa-solid fa-circle-check",
      onClick: () => void updateStatus(blog, "published"),
      hidden: blog.status === "published",
      disabled: actionLoading,
    },
    {
      label: "Move to Draft",
      icon: "fa-solid fa-layer-group",
      onClick: () => void updateStatus(blog, "draft"),
      hidden: blog.status === "draft",
      disabled: actionLoading,
    },
    {
      label: "Schedule",
      icon: "fa-solid fa-calendar-days",
      onClick: () => {
        setScheduleBlog(blog);
        setScheduledAt(
          blog.scheduledAt
            ? new Date(blog.scheduledAt).toISOString().slice(0, 16)
            : "",
        );
      },
      hidden: blog.status === "scheduled",
      disabled: actionLoading,
    },
    {
      label: "Archive",
      icon: "fa-solid fa-folder-open",
      onClick: () => void updateStatus(blog, "archived"),
      hidden: blog.status === "archived",
      disabled: actionLoading,
    },
    {
      label: "Duplicate",
      icon: "fa-regular fa-copy",
      onClick: () => void duplicateBlog(blog),
      disabled: actionLoading,
    },
    {
      label: "Delete",
      icon: "fa-solid fa-trash-can",
      onClick: () => setDeleteBlog(blog),
      danger: true,
      disabled: actionLoading,
    },
  ];

  if (loading) {
    return (
      <AdminLoadingState
        text="Loading blogs..."
        description="Preparing blog articles, publishing states and categories."
      />
    );
  }

  if (error) {
    return (
      <AdminErrorState
        text="Unable to load blogs"
        description={error}
        onRetry={fetchBlogs}
      />
    );
  }

  return (
    <>
      <section
        aria-labelledby="blog-manager-title"
        className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              Content Management
            </span>

            <h1
              id="blog-manager-title"
              className="mt-4 text-3xl font-black text-slate-900"
            >
              Blog Manager
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-500">
              Review, publish, schedule and organize dental articles from one
              responsive dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openEditor()}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-950 px-6 py-3 font-black text-white shadow-lg transition motion-safe:hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <AdminIcon
              aria-hidden="true"
              className="fa-solid fa-layer-group mr-3"
            />
            Create New Blog
          </button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {[
            ["Total", counts.total, "fa-solid fa-layer-group"],
            ["Published", counts.published, "fa-solid fa-circle-check"],
            ["Drafts", counts.draft, "fa-solid fa-folder-open"],
            ["Scheduled", counts.scheduled, "fa-solid fa-calendar-days"],
            ["Archived", counts.archived, "fa-solid fa-clock-rotate-left"],
          ].map(([label, value, icon]) => (
            <article
              key={String(label)}
              className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <strong className="block text-2xl font-black text-blue-700">
                    {value}
                  </strong>
                  <span className="mt-1 block text-xs font-black text-slate-500">
                    {label}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"
                >
                  <AdminIcon className={String(icon)} />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_auto]">
          <label className="relative block">
            <span className="sr-only">Search blogs</span>
            <AdminIcon
              aria-hidden="true"
              className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title, slug, author, excerpt or tags..."
              className="min-h-12 w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-3 pl-12 pr-4 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setPagination((previous) => ({
                  ...previous,
                  page: 1,
                }));
              }}
              className="min-h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 font-black text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="min-h-12 rounded-2xl bg-blue-50 px-4 py-3 font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => void exportExcel()}
              className="min-h-12 rounded-2xl bg-green-50 px-4 py-3 font-black text-green-700 transition hover:bg-green-600 hover:text-white"
            >
              Excel
            </button>
            <button
              type="button"
              onClick={() => void exportPDF()}
              className="min-h-12 rounded-2xl bg-red-50 px-4 py-3 font-black text-red-700 transition hover:bg-red-600 hover:text-white"
            >
              PDF
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {statusFilters.map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPagination((previous) => ({
                  ...previous,
                  page: 1,
                }));
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-black capitalize transition ${
                statusFilter === status
                  ? "bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-200"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3 font-black text-slate-700">
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={toggleSelectAll}
              className="h-5 w-5 accent-blue-600"
            />
            Select Page ({blogs.length})
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-500">
              {selectedBlogs.length} selected
            </span>

            <button
              type="button"
              disabled={selectedIds.length === 0 || actionLoading}
              onClick={() => setBulkDeleteOpen(true)}
              className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete Selected
            </button>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="mt-7">
            <AdminEmptyState
              text="No blogs match the current filters."
              description="Create a new article or adjust the status, category and search filters."
            />
          </div>
        ) : (
          <>
            <div className="mt-7 hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1180px] border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    {[
                      "Select",
                      "Article",
                      "Category",
                      "Author",
                      "Status",
                      "Reading",
                      "Views",
                      "Published",
                      "Updated",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="bg-blue-50 px-4 py-4 text-left text-sm font-black text-blue-800 first:rounded-l-2xl last:rounded-r-2xl"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="group">
                      <td className="rounded-l-2xl border-y border-l border-blue-100 bg-white px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog._id)}
                          onChange={() => toggleSelected(blog._id)}
                          aria-label={`Select ${blog.title}`}
                          className="h-5 w-5 accent-blue-600"
                        />
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4">
                        <div className="flex min-w-[320px] items-center gap-4">
                          <BlogImage
                            blog={blog}
                            className="h-16 w-24 rounded-xl border border-blue-100"
                          />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {blog.isPinned && (
                                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black uppercase text-amber-700">
                                  Pinned
                                </span>
                              )}
                              {blog.isFeatured && (
                                <span className="rounded-full bg-cyan-100 px-2 py-1 text-[10px] font-black uppercase text-cyan-700">
                                  Featured
                                </span>
                              )}
                            </div>

                            <h2 className="mt-1 line-clamp-2 font-black leading-6 text-slate-900">
                              {blog.title}
                            </h2>

                            <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                              /blog/{blog.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-bold text-slate-600">
                        {getCategoryName(blog)}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-bold text-slate-600">
                        {blog.authorName}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4">
                        <StatusPill status={blog.status} />
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-bold text-slate-600">
                        {blog.readingTime} min
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 font-bold text-slate-600">
                        {blog.views || 0}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 text-sm font-semibold text-slate-600">
                        {formatDate(blog.publishedAt || blog.scheduledAt)}
                      </td>

                      <td className="border-y border-blue-100 bg-white px-4 py-4 text-sm font-semibold text-slate-600">
                        {formatDate(blog.updatedAt)}
                      </td>

                      <td className="rounded-r-2xl border-y border-r border-blue-100 bg-white px-4 py-4">
                        <AdminActionMenu items={actionItems(blog)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7 grid gap-5 lg:hidden">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_16px_45px_rgba(37,99,235,.08)]"
                >
                  <BlogImage
                    blog={blog}
                    className="aspect-[16/8] w-full border-b border-blue-100"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(blog._id)}
                        onChange={() => toggleSelected(blog._id)}
                        aria-label={`Select ${blog.title}`}
                        className="mt-1 h-5 w-5 shrink-0 accent-blue-600"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={blog.status} />

                          {blog.isFeatured && (
                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700">
                              Featured
                            </span>
                          )}

                          {blog.isPinned && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                              Pinned
                            </span>
                          )}
                        </div>

                        <h2 className="mt-3 text-xl font-black leading-tight text-slate-900">
                          {blog.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 leading-7 text-slate-500">
                          {blog.excerpt}
                        </p>
                      </div>

                      <AdminActionMenu items={actionItems(blog)} />
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        ["Category", getCategoryName(blog)],
                        ["Author", blog.authorName],
                        ["Reading", `${blog.readingTime} min`],
                        ["Views", String(blog.views || 0)],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl bg-blue-50/60 p-3"
                        >
                          <dt className="text-xs font-black uppercase tracking-wider text-slate-400">
                            {label}
                          </dt>
                          <dd className="mt-1 break-words text-sm font-black text-slate-800">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-4 text-xs font-semibold leading-6 text-slate-400">
                      Updated {formatDate(blog.updatedAt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <nav
              aria-label="Blog pagination"
              className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-bold text-slate-500">
                Page {pagination.page} of {pagination.pages} ·{" "}
                {pagination.total} articles
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setPagination((previous) => ({
                      ...previous,
                      page: Math.max(1, previous.page - 1),
                    }))
                  }
                  className="min-h-11 rounded-xl border border-blue-200 bg-white px-5 py-2.5 font-black text-blue-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() =>
                    setPagination((previous) => ({
                      ...previous,
                      page: Math.min(
                        previous.pages,
                        previous.page + 1,
                      ),
                    }))
                  }
                  className="min-h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-900 px-5 py-2.5 font-black text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </nav>
          </>
        )}
      </section>

      {viewBlog && (
        <AdminModal
          title="Blog Details"
          description="Review article publishing, SEO and content information."
          icon="fa-solid fa-eye"
          maxWidth="xl"
          onClose={() => setViewBlog(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setViewBlog(null)}
                className="rounded-2xl border border-blue-200 bg-white px-5 py-3 font-black text-blue-700"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => openEditor(viewBlog)}
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-900 px-5 py-3 font-black text-white"
              >
                Edit Blog
              </button>
            </div>
          }
        >
          <div className="grid gap-6">
            <BlogImage
              blog={viewBlog}
              className="aspect-[16/7] w-full rounded-[24px] border border-blue-100"
            />

            <div>
              <div className="flex flex-wrap gap-2">
                <StatusPill status={viewBlog.status} />
                {viewBlog.category && (
                  <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-blue-700">
                    {viewBlog.category.name}
                  </span>
                )}
                {viewBlog.isFeatured && (
                  <span className="rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-black text-cyan-700">
                    Featured
                  </span>
                )}
                {viewBlog.isPinned && (
                  <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-700">
                    Pinned
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight text-slate-900">
                {viewBlog.title}
              </h2>

              <p className="mt-3 leading-8 text-slate-500">
                {viewBlog.excerpt}
              </p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Slug", `/blog/${viewBlog.slug}`],
                ["Author", viewBlog.authorName],
                ["Reading Time", `${viewBlog.readingTime} minutes`],
                ["Views", String(viewBlog.views || 0)],
                ["Published", formatDate(viewBlog.publishedAt)],
                ["Scheduled", formatDate(viewBlog.scheduledAt)],
                ["Created", formatDate(viewBlog.createdAt)],
                ["Updated", formatDate(viewBlog.updatedAt)],
                [
                  "SEO Indexing",
                  viewBlog.robotsIndex === false
                    ? "No index"
                    : "Index allowed",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
                >
                  <dt className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {label}
                  </dt>
                  <dd className="mt-2 break-words font-black leading-6 text-slate-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {viewBlog.tags.length > 0 && (
              <div>
                <h3 className="font-black text-slate-900">Tags</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {viewBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 p-4">
                <h3 className="font-black text-slate-900">
                  Meta Title
                </h3>
                <p className="mt-2 leading-7 text-slate-500">
                  {viewBlog.metaTitle || "Not configured"}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 p-4">
                <h3 className="font-black text-slate-900">
                  Meta Description
                </h3>
                <p className="mt-2 leading-7 text-slate-500">
                  {viewBlog.metaDescription || "Not configured"}
                </p>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {deleteBlog && (
        <AdminModal
          title="Delete Blog"
          description="This permanently removes the article from the dashboard and website."
          icon="fa-solid fa-trash-can"
          tone="red"
          maxWidth="md"
          onClose={() => setDeleteBlog(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setDeleteBlog(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void deleteSingleBlog(deleteBlog)}
                className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Delete Blog"}
              </button>
            </div>
          }
        >
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <p className="font-black text-red-800">
              {deleteBlog.title}
            </p>
            <p className="mt-2 leading-7 text-red-700">
              This action cannot be undone.
            </p>
          </div>
        </AdminModal>
      )}

      {bulkDeleteOpen && (
        <AdminModal
          title="Delete Selected Blogs"
          description={`You are about to permanently delete ${selectedIds.length} article(s).`}
          icon="fa-solid fa-trash-can"
          tone="red"
          maxWidth="md"
          onClose={() => setBulkDeleteOpen(false)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setBulkDeleteOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void deleteSelectedBlogs()}
                className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading
                  ? "Deleting..."
                  : `Delete ${selectedIds.length} Blogs`}
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {selectedBlogs.slice(0, 6).map((blog) => (
              <div
                key={blog._id}
                className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 font-black text-red-800"
              >
                {blog.title}
              </div>
            ))}

            {selectedBlogs.length > 6 && (
              <p className="text-sm font-bold text-slate-500">
                And {selectedBlogs.length - 6} more article(s).
              </p>
            )}
          </div>
        </AdminModal>
      )}

      {scheduleBlog && (
        <AdminModal
          title="Schedule Blog"
          description="Choose when this article should become publicly available."
          icon="fa-solid fa-calendar-days"
          tone="amber"
          maxWidth="md"
          onClose={() => {
            setScheduleBlog(null);
            setScheduledAt("");
          }}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  setScheduleBlog(null);
                  setScheduledAt("");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoading || !scheduledAt}
                onClick={() =>
                  void updateStatus(
                    scheduleBlog,
                    "scheduled",
                    scheduledAt,
                  )
                }
                className="rounded-2xl bg-amber-500 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading ? "Scheduling..." : "Schedule Blog"}
              </button>
            </div>
          }
        >
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">
              Publish Date and Time
            </span>
            <input
  type="datetime-local"
  value={scheduledAt}
  min={minimumScheduleDate}
  onChange={(event) => setScheduledAt(event.target.value)}
  className="min-h-14 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
/>
          </label>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="font-black text-amber-800">
              {scheduleBlog.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-amber-700">
              Until the selected time, this article remains hidden from the
              public blog.
            </p>
          </div>
        </AdminModal>
      )}
    </>
  );
}

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
import AdminModal from "@/components/admin/AdminModal";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
} from "@/components/admin/AdminTableStates";

type Tag = {
  name: string;
  usageCount: number;
};

type TagResponse = {
  success?: boolean;
  message?: string;
  tags?: Tag[];
};

export default function BlogTagsClient() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [sourceTag, setSourceTag] = useState<Tag | null>(null);
  const [targetTag, setTargetTag] = useState("");
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminFetch("/api/admin/blog-tags");
      const data = (await response.json().catch(() => null)) as
        | TagResponse
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch tags");
      }

      setTags(data?.tags || []);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch tags";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void fetchTags();
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [fetchTags]);

  const filteredTags = useMemo(() => {
    const query = search.trim().toLowerCase();

    return query
      ? tags.filter((tag) => tag.name.includes(query))
      : tags;
  }, [search, tags]);

  const mergeTag = async () => {
    if (!sourceTag || !targetTag.trim()) {
      toast.error("Enter the target tag");
      return;
    }

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/blog-tags", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: sourceTag.name,
          target: targetTag,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | TagResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to merge tags");
        return;
      }

      toast.success(data?.message || "Tags merged");
      setSourceTag(null);
      setTargetTag("");
      await fetchTags();
    } catch {
      toast.error("Server error while merging tags");
    } finally {
      setActionLoading(false);
    }
  };

  const removeTag = async () => {
    if (!deleteTag) return;

    try {
      setActionLoading(true);

      const response = await adminFetch("/api/admin/blog-tags", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag: deleteTag.name,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | TagResponse
        | null;

      if (!response.ok) {
        toast.error(data?.message || "Failed to remove tag");
        return;
      }

      toast.success(data?.message || "Tag removed");
      setDeleteTag(null);
      await fetchTags();
    } catch {
      toast.error("Server error while removing tag");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <AdminLoadingState text="Loading blog tags..." />;
  }

  if (error) {
    return (
      <AdminErrorState
        text="Unable to load blog tags"
        description={error}
        onRetry={fetchTags}
      />
    );
  }

  return (
    <>
      <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.10)] md:p-7">
        <h1 className="text-3xl font-black text-slate-900">
          Blog Tags
        </h1>

        <p className="mt-2 leading-7 text-slate-500">
          Review usage, merge duplicate tags and remove unnecessary tags.
        </p>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tags..."
          className="mt-6 min-h-14 w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {filteredTags.length === 0 ? (
          <div className="mt-7">
            <AdminEmptyState text="No blog tags found." />
          </div>
        ) : (
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTags.map((tag) => (
              <article
                key={tag.name}
                className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="break-words font-black text-slate-900">
                    #{tag.name}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Used in {tag.usageCount} blog(s)
                  </p>
                </div>

                <AdminActionMenu
                  items={[
                    {
                      label: "Merge Tag",
                      icon: "fa-solid fa-link",
                      onClick: () => {
                        setSourceTag(tag);
                        setTargetTag("");
                      },
                    },
                    {
                      label: "Remove Tag",
                      icon: "fa-solid fa-trash-can",
                      danger: true,
                      onClick: () => setDeleteTag(tag),
                    },
                  ]}
                />
              </article>
            ))}
          </div>
        )}
      </section>

      {sourceTag && (
        <AdminModal
          title="Merge Blog Tag"
          description={`Replace #${sourceTag.name} across every blog.`}
          icon="fa-solid fa-link"
          maxWidth="md"
          onClose={() => setSourceTag(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSourceTag(null)}
                className="rounded-2xl border border-blue-200 bg-white px-5 py-3 font-black text-blue-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void mergeTag()}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading ? "Merging..." : "Merge Tag"}
              </button>
            </div>
          }
        >
          <label>
            <span className="mb-2 block text-sm font-black text-slate-700">
              Target tag
            </span>
            <input
              type="text"
              value={targetTag}
              onChange={(event) => setTargetTag(event.target.value)}
              placeholder="example: dental-care"
              className="min-h-14 w-full rounded-2xl border border-blue-100 px-4 py-3 font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </AdminModal>
      )}

      {deleteTag && (
        <AdminModal
          title="Remove Blog Tag"
          description="The tag will be removed from every blog using it."
          icon="fa-solid fa-trash-can"
          tone="red"
          maxWidth="md"
          onClose={() => setDeleteTag(null)}
          footer={
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTag(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => void removeTag()}
                className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:opacity-60"
              >
                {actionLoading ? "Removing..." : "Remove Tag"}
              </button>
            </div>
          }
        >
          <p className="rounded-2xl border border-red-100 bg-red-50 p-5 font-black text-red-800">
            #{deleteTag.name} · {deleteTag.usageCount} usage(s)
          </p>
        </AdminModal>
      )}
    </>
  );
}

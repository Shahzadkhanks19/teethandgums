"use client";

import type {
  BlogEditorValues,
  BlogStatus,
} from "./BlogTypes";

type PublishingPanelProps = {
  values: BlogEditorValues;
  saving: boolean;
  onSave: (status: BlogStatus) => void;
  updateField: <Key extends keyof BlogEditorValues>(
    key: Key,
    value: BlogEditorValues[Key],
  ) => void;
};

export default function PublishingPanel({
  values,
  saving,
  onSave,
  updateField,
}: PublishingPanelProps) {
  return (
    <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(37,99,235,.08)]">
      <h2 className="text-xl font-black text-slate-900">
        Publishing
      </h2>

      <div className="mt-5 grid gap-4">
        <label>
          <span className="mb-2 block text-sm font-black text-slate-700">
            Status
          </span>

          <select
            value={values.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as BlogStatus,
              )
            }
            className="min-h-12 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 font-black text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        {values.status === "scheduled" && (
          <label>
            <span className="mb-2 block text-sm font-black text-slate-700">
              Publish Date and Time
            </span>

            <input
              type="datetime-local"
              value={values.scheduledAt}
              onChange={(event) =>
                updateField("scheduledAt", event.target.value)
              }
              className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        )}

        {[
          ["isFeatured", "Feature this article"],
          ["isPinned", "Pin article to top"],
          ["allowComments", "Allow comments"],
        ].map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-3 rounded-xl border border-blue-100 p-4 font-black text-slate-700"
          >
            <input
              type="checkbox"
              checked={Boolean(
                values[key as keyof BlogEditorValues],
              )}
              onChange={(event) =>
                updateField(
                  key as
                    | "isFeatured"
                    | "isPinned"
                    | "allowComments",
                  event.target.checked,
                )
              }
              className="h-5 w-5 accent-blue-600"
            />
            {label}
          </label>
        ))}

        <div className="grid gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave("draft")}
            className="min-h-12 rounded-xl border border-blue-200 bg-white px-4 py-3 font-black text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(values.status)}
            className="min-h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-950 px-4 py-3 font-black text-white transition hover:shadow-lg disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : values.status === "published"
                ? "Publish Article"
                : values.status === "scheduled"
                  ? "Schedule Article"
                  : values.status === "archived"
                    ? "Archive Article"
                    : "Save Draft"}
          </button>
        </div>
      </div>
    </section>
  );
}

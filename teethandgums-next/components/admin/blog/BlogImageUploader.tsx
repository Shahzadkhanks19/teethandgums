"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";
import AdminIcon from "@/components/admin/AdminIcon";

type BlogImageUploaderProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
};

type UploadResponse = {
  success?: boolean;
  message?: string;
  url?: string;
};

export default function BlogImageUploader({
  label,
  value,
  onChange,
  required = false,
  error,
  helperText,
}: BlogImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size cannot exceed 5 MB.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await adminFetch("/api/admin/blogs/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as
        | UploadResponse
        | null;

      if (!response.ok || !data?.url) {
        toast.error(data?.message || "Image upload failed");
        return;
      }

      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Unable to upload image");
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-slate-700">
          {label}
          {required ? " *" : ""}
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-black text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <div
        className={`overflow-hidden rounded-2xl border bg-white ${
          error
            ? "border-red-400 ring-4 ring-red-100"
            : "border-blue-100"
        }`}
      >
        <div
          role="img"
          aria-label={`${label} preview`}
          className="aspect-[16/9] w-full bg-blue-50 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: value
              ? `url("${value.replace(/"/g, "%22")}")`
              : undefined,
          }}
        >
          {!value && (
            <div className="grid h-full place-items-center text-center text-blue-500">
              <div>
                <AdminIcon
                  aria-hidden="true"
                  className="fa-solid fa-layer-group text-3xl"
                />
                <p className="mt-2 text-sm font-black">
                  No image selected
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 border-t border-blue-100 p-4">
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/uploads/blog/example.webp or https://..."
            className="min-h-12 w-full rounded-xl border border-blue-100 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadImage(file);
            }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-50 px-4 py-3 font-black text-blue-700 transition hover:bg-blue-600 hover:text-white disabled:opacity-60"
          >
            <AdminIcon
              aria-hidden="true"
              className={
                uploading
                  ? "fa-solid fa-spinner fa-spin mr-3"
                  : "fa-solid fa-layer-group mr-3"
              }
            />
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {(error || helperText) && (
        <p
          className={`mt-2 text-xs font-semibold ${
            error ? "text-red-600" : "text-slate-400"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

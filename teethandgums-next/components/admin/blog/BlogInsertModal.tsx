"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import AdminIcon from "@/components/admin/AdminIcon";
import AdminModal from "@/components/admin/AdminModal";
import { adminFetch } from "@/lib/adminFetch";

type InsertType = "link" | "image" | "youtube";

type BlogInsertModalProps = {
  type: InsertType;
  initialUrl?: string;
  onClose: () => void;
  onSubmit: (payload: { url: string; alt?: string }) => void;
};

type UploadResponse = {
  message?: string;
  url?: string;
};

const config = {
  link: {
    title: "Insert Link",
    description: "Add a complete and valid destination URL to the selected text.",
    icon: "fa-solid fa-link",
    placeholder: "https://example.com",
  },
  image: {
    title: "Insert Image",
    description: "Upload an image from your device or insert one using a direct URL.",
    icon: "fa-solid fa-image",
    placeholder: "https://example.com/image.webp",
  },
  youtube: {
    title: "Insert YouTube Video",
    description: "Paste a complete YouTube video URL to embed it in the article.",
    icon: "fa-brands fa-youtube",
    placeholder: "https://www.youtube.com/watch?v=...",
  },
} satisfies Record<InsertType, Record<string, string>>;

export default function BlogInsertModal({
  type,
  initialUrl = "",
  onClose,
  onSubmit,
}: BlogInsertModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState("Dental care image");
  const [uploading, setUploading] = useState(false);
  const modal = config[type];

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
      const data = (await response.json().catch(() => null)) as UploadResponse | null;

      if (!response.ok || !data?.url) {
        toast.error(data?.message || "Image upload failed.");
        return;
      }

      setUrl(data.url);
      if (!alt.trim() || alt === "Dental care image") {
        setAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      }
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Unable to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const submit = () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast.error(type === "image" ? "Upload an image or enter an image URL." : "Please enter a URL.");
      return;
    }

    onSubmit({
      url: trimmedUrl,
      alt: type === "image" ? alt.trim() || "Dental care image" : undefined,
    });
    onClose();
  };

  return (
    <AdminModal
      title={modal.title}
      description={modal.description}
      icon={modal.icon}
      maxWidth="md"
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={uploading}
            className="min-h-12 rounded-2xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            Insert {type === "youtube" ? "Video" : type === "image" ? "Image" : "Link"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {type === "image" && (
          <div className="rounded-[22px] border border-dashed border-blue-200 bg-blue-50/70 p-5 text-center">
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
            <AdminIcon aria-hidden="true" className="fa-solid fa-cloud-arrow-up text-3xl text-blue-600" />
            <p className="mt-3 font-black text-slate-900">Upload from your device</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">JPG, PNG, WebP or AVIF up to 5 MB</p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              <AdminIcon
                aria-hidden="true"
                className={uploading ? "fa-solid fa-spinner fa-spin mr-2" : "fa-solid fa-folder-open mr-2"}
              />
              {uploading ? "Uploading..." : "Choose Image"}
            </button>
          </div>
        )}

        <div>
          <label htmlFor={`blog-${type}-url`} className="mb-2 block text-sm font-black text-slate-700">
            {type === "image" ? "Image URL" : type === "youtube" ? "YouTube URL" : "Link URL"}
          </label>
          <input
            id={`blog-${type}-url`}
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder={modal.placeholder}
            autoFocus={type !== "image"}
            className="min-h-12 w-full rounded-2xl border border-blue-100 px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {type === "image" && (
          <div>
            <label htmlFor="blog-image-alt" className="mb-2 block text-sm font-black text-slate-700">
              Alternative text
            </label>
            <input
              id="blog-image-alt"
              type="text"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              placeholder="Describe the image for accessibility"
              className="min-h-12 w-full rounded-2xl border border-blue-100 px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        )}

        {type === "image" && url && (
          <div
            role="img"
            aria-label={alt || "Selected image preview"}
            className="aspect-[16/9] rounded-[20px] border border-blue-100 bg-slate-50 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${url.replace(/"/g, "%22")}")` }}
          />
        )}
      </div>
    </AdminModal>
  );
}

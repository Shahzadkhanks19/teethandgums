"use client";

import { useEffect, useState } from "react";
import {
  EditorContent,
  useEditor,
} from "@tiptap/react";
import toast from "react-hot-toast";

import { adminFetch } from "@/lib/adminFetch";

import BlogToolbar from "./BlogToolbar";
import styles from "./BlogEditor.module.css";
import { blogEditorExtensions } from "./TiptapExtensions";

type TiptapEditorProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
};

type UploadResponse = {
  success?: boolean;
  message?: string;
  url?: string;
};

async function uploadEditorImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be inserted.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Editor images cannot exceed 5 MB.");
  }

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
    throw new Error(data?.message || "Image upload failed.");
  }

  return data.url;
}

export default function TiptapEditor({
  value,
  onChange,
  invalid = false,
}: TiptapEditorProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: blogEditorExtensions,
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-label": "Dental blog article content",
        class: "focus:outline-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;

        const file = event.dataTransfer?.files?.[0];

        if (!file?.type.startsWith("image/")) {
          return false;
        }

        event.preventDefault();
        setUploadingImage(true);

        void uploadEditorImage(file)
          .then((url) => {
            const imageNode = view.state.schema.nodes.image;

            if (!imageNode) {
              throw new Error("Image support is unavailable.");
            }

            const transaction = view.state.tr.replaceSelectionWith(
              imageNode.create({
                src: url,
                alt: file.name || "Dental care image",
              }),
            );

            view.dispatch(transaction);
            view.focus();
            toast.success("Image inserted");
          })
          .catch((error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : "Image upload failed",
            );
          })
          .finally(() => {
            setUploadingImage(false);
          });

        return true;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) =>
          item.type.startsWith("image/"),
        );

        const file = imageItem?.getAsFile();

        if (!file) return false;

        event.preventDefault();
        setUploadingImage(true);

        void uploadEditorImage(file)
          .then((url) => {
            const imageNode = view.state.schema.nodes.image;

            if (!imageNode) {
              throw new Error("Image support is unavailable.");
            }

            const transaction = view.state.tr.replaceSelectionWith(
              imageNode.create({
                src: url,
                alt: file.name || "Pasted dental care image",
              }),
            );

            view.dispatch(transaction);
            view.focus();
            toast.success("Pasted image inserted");
          })
          .catch((error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : "Image upload failed",
            );
          })
          .finally(() => {
            setUploadingImage(false);
          });

        return true;
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "<p></p>", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  useEffect(() => {
    if (!fullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen]);

  return (
    <div
      className={`overflow-hidden rounded-[24px] border bg-white transition ${
        invalid
          ? "border-red-400 ring-4 ring-red-100"
          : "border-blue-100 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
      } ${
        fullscreen
          ? "fixed inset-3 z-[999999] flex flex-col rounded-[28px] shadow-2xl sm:inset-6"
          : ""
      }`}
    >
      <BlogToolbar
        editor={editor}
        fullscreen={fullscreen}
        onToggleFullscreen={() =>
          setFullscreen((previous) => !previous)
        }
      />

      {uploadingImage && (
        <div
          role="status"
          aria-live="polite"
          className="border-b border-blue-100 bg-blue-600 px-4 py-2 text-center text-sm font-black text-white"
        >
          Uploading editor image...
        </div>
      )}

      <div
        className={`${styles.editorShell} ${
          fullscreen ? "min-h-0 flex-1 overflow-y-auto" : ""
        }`}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

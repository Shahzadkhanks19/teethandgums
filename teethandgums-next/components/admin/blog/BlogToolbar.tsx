"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";

import AdminIcon from "@/components/admin/AdminIcon";

import BlogInsertModal from "./BlogInsertModal";

type BlogToolbarProps = {
  editor: Editor | null;
  onToggleFullscreen: () => void;
  fullscreen: boolean;
};

type ToolbarButtonProps = {
  label: string;
  icon?: string;
  text?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({
  label,
  icon,
  text,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-blue-100 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      {icon ? (
        <AdminIcon aria-hidden="true" className={icon} />
      ) : (
        text
      )}
    </button>
  );
}

export default function BlogToolbar({
  editor,
  onToggleFullscreen,
  fullscreen,
}: BlogToolbarProps) {
  const [insertType, setInsertType] = useState<
    "link" | "image" | "youtube" | null
  >(null);

  if (!editor) {
    return (
      <div
        role="status"
        aria-label="Loading editor toolbar"
        className="h-14 animate-pulse rounded-2xl bg-blue-50"
      />
    );
  }

  const handleInsert = (payload: { url: string; alt?: string }) => {
    if (insertType === "link") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: payload.url })
        .run();
      return;
    }

    if (insertType === "image") {
      editor
        .chain()
        .focus()
        .setImage({
          src: payload.url,
          alt: payload.alt || "Dental care image",
        })
        .run();
      return;
    }

    if (insertType === "youtube") {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: payload.url,
          width: 720,
          height: 405,
        })
        .run();
    }
  };

  return (
    <>
    <div
      role="toolbar"
      aria-label="Blog formatting toolbar"
      className="sticky top-0 z-20 flex max-h-[220px] flex-wrap gap-2 overflow-y-auto border-b border-blue-100 bg-blue-50/95 p-3 backdrop-blur"
    >
      <ToolbarButton
        label="Undo"
        icon="fa-solid fa-arrow-left"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      />

      <ToolbarButton
        label="Redo"
        icon="fa-solid fa-arrow-right"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      />

      <span aria-hidden="true" className="mx-1 hidden w-px bg-blue-200 sm:block" />

      <ToolbarButton
        label="Paragraph"
        text="P"
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      />

      {[1, 2, 3, 4].map((level) => (
        <ToolbarButton
          key={level}
          label={`Heading ${level}`}
          text={`H${level}`}
          active={editor.isActive("heading", { level })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: level as 1 | 2 | 3 | 4,
              })
              .run()
          }
        />
      ))}

      <ToolbarButton
        label="Bold"
        text="B"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <ToolbarButton
        label="Italic"
        text="I"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <ToolbarButton
        label="Underline"
        text="U"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

      <ToolbarButton
        label="Strike through"
        text="S"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <ToolbarButton
        label="Inline code"
        icon="fa-solid fa-code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <ToolbarButton
        label="Link"
        icon="fa-solid fa-link"
        active={editor.isActive("link")}
        onClick={() => setInsertType("link")}
      />

      <label
        title="Text color"
        className="relative grid h-10 w-10 cursor-pointer place-items-center overflow-hidden rounded-xl border border-blue-100 bg-white font-black text-slate-700"
      >
        A
        <input
          aria-label="Text color"
          type="color"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
        />
      </label>

      <label
        title="Highlight color"
        className="relative grid h-10 w-10 cursor-pointer place-items-center overflow-hidden rounded-xl border border-blue-100 bg-yellow-100 font-black text-yellow-800"
      >
        H
        <input
          aria-label="Highlight color"
          type="color"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(event) =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: event.target.value })
              .run()
          }
        />
      </label>

      <ToolbarButton
        label="Align left"
        text="L"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />

      <ToolbarButton
        label="Align center"
        text="C"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />

      <ToolbarButton
        label="Align right"
        text="R"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />

      <ToolbarButton
        label="Justify"
        text="J"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      />

      <ToolbarButton
        label="Bullet list"
        icon="fa-solid fa-list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <ToolbarButton
        label="Numbered list"
        text="1."
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      <ToolbarButton
        label="Task list"
        text="☑"
        active={editor.isActive("taskList")}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      />

      <ToolbarButton
        label="Block quote"
        text="“ ”"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      <ToolbarButton
        label="Code block"
        icon="fa-solid fa-code"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <ToolbarButton
        label="Horizontal rule"
        text="—"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <ToolbarButton
        label="Insert image"
        icon="fa-solid fa-layer-group"
        onClick={() => setInsertType("image")}
      />

      <ToolbarButton
        label="Insert YouTube video"
        text="▶"
        onClick={() => setInsertType("youtube")}
      />

      <ToolbarButton
        label="Insert table"
        text="▦"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run()
        }
      />

      {editor.isActive("table") && (
        <>
          <ToolbarButton
            label="Add row"
            text="+R"
            onClick={() => editor.chain().focus().addRowAfter().run()}
          />
          <ToolbarButton
            label="Delete row"
            text="-R"
            onClick={() => editor.chain().focus().deleteRow().run()}
          />
          <ToolbarButton
            label="Add column"
            text="+C"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          />
          <ToolbarButton
            label="Delete column"
            text="-C"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          />
          <ToolbarButton
            label="Delete table"
            icon="fa-solid fa-trash-can"
            onClick={() => editor.chain().focus().deleteTable().run()}
          />
        </>
      )}

      <ToolbarButton
        label="Clear formatting"
        text="Tx"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      />

      <ToolbarButton
        label={fullscreen ? "Exit fullscreen" : "Fullscreen editor"}
        text={fullscreen ? "↙" : "↗"}
        active={fullscreen}
        onClick={onToggleFullscreen}
      />
    </div>

    {insertType && (
      <BlogInsertModal
        type={insertType}
        initialUrl={
          insertType === "link"
            ? ((editor.getAttributes("link").href as string | undefined) || "")
            : ""
        }
        onClose={() => setInsertType(null)}
        onSubmit={handleInsert}
      />
    )}
    </>
  );
}

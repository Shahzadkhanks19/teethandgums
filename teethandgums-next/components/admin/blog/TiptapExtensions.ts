import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

export const blogEditorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
      },
    },
  }),
  Placeholder.configure({
    placeholder:
      "Start writing your dental article. Type / for ideas, or use the toolbar for headings, media, tables and formatting...",
  }),
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Image.configure({
    allowBase64: false,
    inline: false,
    HTMLAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  }),
  Youtube.configure({
    controls: true,
    nocookie: true,
    modestBranding: true,
    HTMLAttributes: {
      loading: "lazy",
      class: "blog-editor-youtube",
    },
  }),
  Table.configure({
    resizable: true,
    allowTableNodeSelection: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  CharacterCount.configure({
    limit: 200_000,
  }),
  Typography,
];

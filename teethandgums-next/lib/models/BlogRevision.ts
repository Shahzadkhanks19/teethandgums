import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export type BlogRevisionRecord = {
  blog: Types.ObjectId;
  revisionNumber: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Types.ObjectId | null;
  tags: string[];
  status: string;
  featuredImage: string;
  featuredImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  changedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogRevisionDocument =
  HydratedDocument<BlogRevisionRecord>;

const blogRevisionSchema = new Schema<BlogRevisionRecord>(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    revisionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    excerpt: {
      type: String,
      default: "",
      maxlength: 500,
    },
    content: {
      type: String,
      default: "",
      maxlength: 200_000,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: "draft",
      maxlength: 30,
    },
    featuredImage: {
      type: String,
      default: "",
      maxlength: 1_000,
    },
    featuredImageAlt: {
      type: String,
      default: "",
      maxlength: 220,
    },
    metaTitle: {
      type: String,
      default: "",
      maxlength: 70,
    },
    metaDescription: {
      type: String,
      default: "",
      maxlength: 180,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

blogRevisionSchema.index(
  { blog: 1, revisionNumber: -1 },
  { unique: true },
);
blogRevisionSchema.index({ blog: 1, createdAt: -1 });

const BlogRevision =
  (models.BlogRevision as
    | Model<BlogRevisionRecord>
    | undefined) ||
  model<BlogRevisionRecord>(
    "BlogRevision",
    blogRevisionSchema,
  );

export default BlogRevision;

import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export type BlogCategoryRecord = {
  name: string;
  slug: string;
  description: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogCategoryDocument =
  HydratedDocument<BlogCategoryRecord>;

const blogCategorySchema = new Schema<BlogCategoryRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 120,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid category slug"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    color: {
      type: String,
      default: "#2563eb",
      trim: true,
      match: [/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex value"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
      max: 10_000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

blogCategorySchema.index({ isActive: 1, sortOrder: 1, name: 1 });

const BlogCategory =
  (models.BlogCategory as Model<BlogCategoryRecord> | undefined) ||
  model<BlogCategoryRecord>("BlogCategory", blogCategorySchema);

export default BlogCategory;

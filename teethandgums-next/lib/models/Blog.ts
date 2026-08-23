import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export type BlogStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "archived";

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogRecord = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  ogImage: string;
  category: Types.ObjectId | null;
  tags: string[];
  authorName: string;
  authorRole: string;
  status: BlogStatus;
  isFeatured: boolean;
  isPinned: boolean;
  allowComments: boolean;
  readingTime: number;
  views: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  faqs: BlogFaqItem[];
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogDocument = HydratedDocument<BlogRecord>;

const blogFaqSchema = new Schema<BlogFaqItem>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2_000,
    },
  },
  {
    _id: false,
  },
);

const blogSchema = new Schema<BlogRecord>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 180,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid blog slug"],
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 200_000,
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1_000,
    },
    featuredImageAlt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
    },
    ogImage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1_000,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    authorName: {
      type: String,
      default: "Teeth and Gums Care",
      trim: true,
      maxlength: 120,
    },
    authorRole: {
      type: String,
      default: "Dental Care Team",
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    allowComments: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
      default: 1,
      min: 1,
      max: 999,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    metaTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 70,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    keywords: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1_000,
    },
    robotsIndex: {
      type: Boolean,
      default: true,
    },
    robotsFollow: {
      type: Boolean,
      default: true,
    },
    faqs: {
      type: [blogFaqSchema],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

blogSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });
blogSchema.index({ isPinned: -1, isFeatured: -1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});

const Blog =
  (models.Blog as Model<BlogRecord> | undefined) ||
  model<BlogRecord>("Blog", blogSchema);

export default Blog;

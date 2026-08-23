import "server-only";

import type { FilterQuery } from "mongoose";

import connectDB from "@/lib/db";
import Blog, { type BlogRecord } from "@/lib/models/Blog";
import BlogCategory from "@/lib/models/BlogCategory";

export const PUBLIC_BLOG_PAGE_SIZE = 9;

export type PublicBlogCategory = {
  _id: string;
  name: string;
  slug: string;
  color: string;
};

export type PublicBlogCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: PublicBlogCategory | null;
  tags: string[];
  authorName: string;
  authorRole: string;
  readingTime: number;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  isFeatured: boolean;
  isPinned: boolean;
};

export type PublicBlogDetail = PublicBlogCard & {
  content: string;
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  updatedAt: string;
};

type LeanBlogCategory = {
  _id: unknown;
  name: string;
  slug: string;
  color: string;
};

type LeanBlogCard = {
  _id: unknown;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  category: LeanBlogCategory | null;
  tags: string[];
  authorName: string;
  authorRole: string;
  readingTime: number;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  isFeatured: boolean;
  isPinned: boolean;
};

type LeanBlogDetail = LeanBlogCard & {
  content: string;
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  updatedAt: Date;
};

function publishedFilter(): FilterQuery<BlogRecord> {
  const now = new Date();

  return {
    robotsIndex: true,
    $or: [
      { status: "published" },
      {
        status: "scheduled",
        scheduledAt: { $lte: now },
      },
    ],
  };
}

function serializeCategory(
  category: LeanBlogCategory | null,
): PublicBlogCategory | null {
  if (!category) return null;

  return {
    _id: String(category._id),
    name: category.name,
    slug: category.slug,
    color: category.color,
  };
}

function serializeCard(blog: LeanBlogCard): PublicBlogCard {
  return {
    _id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    featuredImage: blog.featuredImage,
    featuredImageAlt: blog.featuredImageAlt,
    category: serializeCategory(blog.category),
    tags: blog.tags || [],
    authorName: blog.authorName,
    authorRole: blog.authorRole,
    readingTime: blog.readingTime,
    views: blog.views,
    publishedAt: blog.publishedAt
      ? blog.publishedAt.toISOString()
      : null,
    createdAt: blog.createdAt.toISOString(),
    isFeatured: blog.isFeatured,
    isPinned: blog.isPinned,
  };
}

function serializeDetail(blog: LeanBlogDetail): PublicBlogDetail {
  return {
    ...serializeCard(blog),
    content: blog.content,
    ogImage: blog.ogImage,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    keywords: blog.keywords || [],
    canonicalUrl: blog.canonicalUrl,
    robotsIndex: blog.robotsIndex,
    robotsFollow: blog.robotsFollow,
    faqs: blog.faqs || [],
    updatedAt: blog.updatedAt.toISOString(),
  };
}

export async function getFeaturedBlog(): Promise<PublicBlogCard | null> {
  await connectDB();

  const blog = await Blog.findOne({
    ...publishedFilter(),
    isFeatured: true,
  })
    .select({
      content: 0,
      faqs: 0,
      createdBy: 0,
      updatedBy: 0,
    })
    .populate({
      path: "category",
      match: { isActive: true },
      select: "name slug color",
    })
    .sort({
      isPinned: -1,
      publishedAt: -1,
      createdAt: -1,
    })
    .lean<LeanBlogCard>()
    .exec();

  return blog ? serializeCard(blog) : null;
}

export async function getPublicBlogs({
  page = 1,
  limit = PUBLIC_BLOG_PAGE_SIZE,
  search = "",
  categorySlug = "",
  tag = "",
  excludeSlug = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  tag?: string;
  excludeSlug?: string;
} = {}): Promise<{
  blogs: PublicBlogCard[];
  page: number;
  pages: number;
  total: number;
}> {
  await connectDB();

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(limit, 1), 24);
  const filter: FilterQuery<BlogRecord> = publishedFilter();

  if (excludeSlug) {
    filter.slug = { $ne: excludeSlug };
  }

  if (categorySlug) {
    const category = await BlogCategory.findOne({
      slug: categorySlug,
      isActive: true,
    })
      .select({ _id: 1 })
      .lean()
      .exec();

    if (!category) {
      return {
        blogs: [],
        page: safePage,
        pages: 1,
        total: 0,
      };
    }

    filter.category = category._id;
  }

  if (tag) {
    filter.tags = tag.trim().toLowerCase();
  }

  if (search.trim()) {
    const escaped = search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(escaped, "i");

    filter.$and = [
      {
        $or: [
          { title: pattern },
          { excerpt: pattern },
          { tags: pattern },
        ],
      },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select({
        content: 0,
        faqs: 0,
        createdBy: 0,
        updatedBy: 0,
      })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name slug color",
      })
      .sort({
        isPinned: -1,
        isFeatured: -1,
        publishedAt: -1,
        createdAt: -1,
      })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean<LeanBlogCard[]>()
      .exec(),
    Blog.countDocuments(filter),
  ]);

  return {
    blogs: blogs.map(serializeCard),
    page: safePage,
    pages: Math.max(1, Math.ceil(total / safeLimit)),
    total,
  };
}

export async function getPublicBlogBySlug(
  slug: string,
): Promise<PublicBlogDetail | null> {
  await connectDB();

  const blog = await Blog.findOne({
    ...publishedFilter(),
    slug,
  })
    .populate({
      path: "category",
      match: { isActive: true },
      select: "name slug color",
    })
    .select({
      createdBy: 0,
      updatedBy: 0,
    })
    .lean<LeanBlogDetail>()
    .exec();

  return blog ? serializeDetail(blog) : null;
}

export async function getPublicBlogCategories(): Promise<
  Array<PublicBlogCategory & { blogCount: number }>
> {
  await connectDB();

  const categories = await BlogCategory.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .lean()
    .exec();

  const counts = await Blog.aggregate<{
    _id: unknown;
    count: number;
  }>([
    { $match: publishedFilter() },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = new Map(
    counts.map((item) => [String(item._id), item.count]),
  );

  return categories
    .map((category) => ({
      _id: String(category._id),
      name: category.name,
      slug: category.slug,
      color: category.color,
      blogCount: countMap.get(String(category._id)) || 0,
    }))
    .filter((category) => category.blogCount > 0);
}

export async function getPopularTags(limit = 12): Promise<
  Array<{ name: string; count: number }>
> {
  await connectDB();

  return Blog.aggregate<{ name: string; count: number }>([
    { $match: publishedFilter() },
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $limit: Math.min(Math.max(limit, 1), 30) },
    {
      $project: {
        _id: 0,
        name: "$_id",
        count: 1,
      },
    },
  ]);
}


export async function getAdjacentPublicBlogs(blog: PublicBlogDetail): Promise<{
  previous: PublicBlogCard | null;
  next: PublicBlogCard | null;
}> {
  await connectDB();

  const currentDate = new Date(blog.publishedAt || blog.createdAt);
  const baseFilter = publishedFilter();

  const [previousBlog, nextBlog] = await Promise.all([
    Blog.findOne({
      ...baseFilter,
      slug: { $ne: blog.slug },
      publishedAt: { $lt: currentDate },
    })
      .select({ content: 0, faqs: 0, createdBy: 0, updatedBy: 0 })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name slug color",
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean<LeanBlogCard>()
      .exec(),
    Blog.findOne({
      ...baseFilter,
      slug: { $ne: blog.slug },
      publishedAt: { $gt: currentDate },
    })
      .select({ content: 0, faqs: 0, createdBy: 0, updatedBy: 0 })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name slug color",
      })
      .sort({ publishedAt: 1, createdAt: 1 })
      .lean<LeanBlogCard>()
      .exec(),
  ]);

  return {
    previous: previousBlog ? serializeCard(previousBlog) : null,
    next: nextBlog ? serializeCard(nextBlog) : null,
  };
}

export async function getRelatedPublicBlogs(
  blog: PublicBlogDetail,
  limit = 3,
): Promise<PublicBlogCard[]> {
  await connectDB();

  const filter: FilterQuery<BlogRecord> = {
    ...publishedFilter(),
    slug: { $ne: blog.slug },
  };

  if (blog.category?._id || blog.tags.length > 0) {
    filter.$and = [
      {
        $or: [
          ...(blog.category?._id ? [{ category: blog.category._id }] : []),
          ...(blog.tags.length > 0 ? [{ tags: { $in: blog.tags } }] : []),
        ],
      },
    ];
  }

  const candidates = await Blog.find(filter)
    .select({ content: 0, faqs: 0, createdBy: 0, updatedBy: 0 })
    .populate({
      path: "category",
      match: { isActive: true },
      select: "name slug color",
    })
    .sort({ isPinned: -1, views: -1, publishedAt: -1 })
    .limit(18)
    .lean<LeanBlogCard[]>()
    .exec();

  const currentTags = new Set(blog.tags.map((tag) => tag.toLowerCase()));

  return candidates
    .map((candidate) => {
      const sharedTags = (candidate.tags || []).filter((tag) =>
        currentTags.has(tag.toLowerCase()),
      ).length;
      const sameCategory =
        Boolean(blog.category?._id) &&
        String(candidate.category?._id || "") === blog.category?._id;
      const score =
        sharedTags * 4 +
        (sameCategory ? 6 : 0) +
        (candidate.isFeatured ? 1 : 0) +
        Math.min(candidate.views / 1000, 2);

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(Math.max(limit, 1), 6))
    .map(({ candidate }) => serializeCard(candidate));
}


export async function getPopularBlogs(limit = 5): Promise<PublicBlogCard[]> {
  await connectDB();

  const blogs = await Blog.find(publishedFilter())
    .select({ content: 0, faqs: 0, createdBy: 0, updatedBy: 0 })
    .populate({
      path: "category",
      match: { isActive: true },
      select: "name slug color",
    })
    .sort({ views: -1, isPinned: -1, publishedAt: -1, createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 12))
    .lean<LeanBlogCard[]>()
    .exec();

  return blogs.map(serializeCard);
}

export async function getTrendingBlogs(limit = 5): Promise<PublicBlogCard[]> {
  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let blogs = await Blog.find({
    ...publishedFilter(),
    publishedAt: { $gte: thirtyDaysAgo },
  })
    .select({ content: 0, faqs: 0, createdBy: 0, updatedBy: 0 })
    .populate({
      path: "category",
      match: { isActive: true },
      select: "name slug color",
    })
    .sort({ views: -1, publishedAt: -1, createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 12))
    .lean<LeanBlogCard[]>()
    .exec();

  if (blogs.length === 0) {
    blogs = await Blog.find(publishedFilter())
      .select({ content: 0, faqs: 0, createdBy: 0, updatedBy: 0 })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name slug color",
      })
      .sort({ views: -1, publishedAt: -1, createdAt: -1 })
      .limit(Math.min(Math.max(limit, 1), 12))
      .lean<LeanBlogCard[]>()
      .exec();
  }

  return blogs.map(serializeCard);
}

export async function getAllPublicBlogSitemapEntries(): Promise<{
  blogs: Array<{ slug: string; updatedAt: Date }>;
  categories: Array<{ slug: string; updatedAt: Date }>;
  tags: string[];
}> {
  await connectDB();

  const [blogs, categories, tags] = await Promise.all([
    Blog.find(publishedFilter())
      .select("slug updatedAt")
      .sort({ updatedAt: -1 })
      .lean<Array<{ slug: string; updatedAt: Date }>>()
      .exec(),
    BlogCategory.find({ isActive: true })
      .select("slug updatedAt")
      .lean<Array<{ slug: string; updatedAt: Date }>>()
      .exec(),
    Blog.distinct("tags", publishedFilter()),
  ]);

  return {
    blogs,
    categories,
    tags: tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0),
  };
}

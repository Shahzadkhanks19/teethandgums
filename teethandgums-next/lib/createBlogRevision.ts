import mongoose from "mongoose";

import Blog from "@/lib/models/Blog";
import BlogRevision from "@/lib/models/BlogRevision";

export default async function createBlogRevision(
  blogId: string,
  changedBy?: string,
): Promise<void> {
  if (!mongoose.isValidObjectId(blogId)) return;

  const blog = await Blog.findById(blogId)
    .select({
      title: 1,
      slug: 1,
      excerpt: 1,
      content: 1,
      category: 1,
      tags: 1,
      status: 1,
      featuredImage: 1,
      featuredImageAlt: 1,
      metaTitle: 1,
      metaDescription: 1,
    })
    .lean()
    .exec();

  if (!blog) return;

  const latest = await BlogRevision.findOne({
    blog: blogId,
  })
    .sort({ revisionNumber: -1 })
    .select({ revisionNumber: 1 })
    .lean()
    .exec();

  await BlogRevision.create({
    blog: blogId,
    revisionNumber: (latest?.revisionNumber || 0) + 1,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    category: blog.category,
    tags: blog.tags,
    status: blog.status,
    featuredImage: blog.featuredImage,
    featuredImageAlt: blog.featuredImageAlt,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    changedBy:
      changedBy && mongoose.isValidObjectId(changedBy)
        ? changedBy
        : null,
  });
}

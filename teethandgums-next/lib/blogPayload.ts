import mongoose from "mongoose";

import {
  calculateBlogReadingTime,
  createBlogSlug,
  normalizeBlogTags,
  parseOptionalDate,
} from "@/lib/blog";
import Blog from "@/lib/models/Blog";
import BlogCategory from "@/lib/models/BlogCategory";

type BlogPayloadResult =
  | {
      success: true;
      data: Record<string, unknown>;
      previousSlug?: string;
    }
  | {
      success: false;
      message: string;
    };

function normalizeFaqs(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const faq = item as { question?: unknown; answer?: unknown };

      return {
        question: String(faq.question || "").trim().slice(0, 300),
        answer: String(faq.answer || "").trim().slice(0, 2_000),
      };
    })
    .filter((item) => item.question && item.answer)
    .slice(0, 20);
}

export async function prepareBlogPayload(
  body: Record<string, unknown>,
  options: {
    blogId?: string;
    adminId?: string;
    partial?: boolean;
  } = {},
): Promise<BlogPayloadResult> {
  const { blogId, adminId, partial = false } = options;

  const title =
    body.title === undefined ? undefined : String(body.title).trim();
  const content =
    body.content === undefined ? undefined : String(body.content).trim();
  const excerpt =
    body.excerpt === undefined ? undefined : String(body.excerpt).trim();

  if (!partial || title !== undefined) {
    if (!title || title.length < 5 || title.length > 180) {
      return {
        success: false,
        message: "Blog title must contain between 5 and 180 characters.",
      };
    }
  }

  if (!partial || excerpt !== undefined) {
    if (!excerpt || excerpt.length < 20 || excerpt.length > 500) {
      return {
        success: false,
        message: "Excerpt must contain between 20 and 500 characters.",
      };
    }
  }

  if (!partial || content !== undefined) {
    if (!content || content.length < 50 || content.length > 200_000) {
      return {
        success: false,
        message: "Blog content must contain at least 50 characters.",
      };
    }
  }

  const requestedSlug =
    body.slug === undefined
      ? undefined
      : createBlogSlug(String(body.slug));

  const generatedSlug =
    requestedSlug ||
    (title ? createBlogSlug(title) : undefined);

  if ((!partial || body.slug !== undefined || title !== undefined) && !generatedSlug) {
    return {
      success: false,
      message: "A valid blog slug could not be generated.",
    };
  }

  if (generatedSlug) {
    const existing = await Blog.findOne({
      slug: generatedSlug,
      ...(blogId && mongoose.isValidObjectId(blogId)
        ? { _id: { $ne: blogId } }
        : {}),
    })
      .select({ _id: 1 })
      .lean()
      .exec();

    if (existing) {
      return {
        success: false,
        message: "Another blog already uses this slug.",
      };
    }
  }

  let category: string | null | undefined;

  if (body.category !== undefined) {
    const categoryValue = String(body.category || "").trim();

    if (!categoryValue) {
      category = null;
    } else {
      if (!mongoose.isValidObjectId(categoryValue)) {
        return {
          success: false,
          message: "Invalid blog category.",
        };
      }

      const categoryExists = await BlogCategory.exists({
        _id: categoryValue,
        isActive: true,
      });

      if (!categoryExists) {
        return {
          success: false,
          message: "Selected blog category does not exist or is inactive.",
        };
      }

      category = categoryValue;
    }
  }

  const status =
    body.status === undefined ? undefined : String(body.status);

  if (
    status !== undefined &&
    !["draft", "published", "scheduled", "archived"].includes(status)
  ) {
    return {
      success: false,
      message: "Invalid blog status.",
    };
  }

  const scheduledAt =
    body.scheduledAt === undefined
      ? undefined
      : parseOptionalDate(body.scheduledAt);

  if (status === "scheduled") {
    if (!scheduledAt || scheduledAt.getTime() <= Date.now()) {
      return {
        success: false,
        message: "Scheduled blogs require a future publishing date.",
      };
    }
  }

  const featuredImage =
    body.featuredImage === undefined
      ? undefined
      : String(body.featuredImage).trim();

  const featuredImageAlt =
    body.featuredImageAlt === undefined
      ? undefined
      : String(body.featuredImageAlt).trim();

  if (!partial || featuredImage !== undefined) {
    if (!featuredImage || featuredImage.length > 1_000) {
      return {
        success: false,
        message: "A valid featured image is required.",
      };
    }
  }

  if (!partial || featuredImageAlt !== undefined) {
    if (!featuredImageAlt || featuredImageAlt.length > 220) {
      return {
        success: false,
        message: "Featured image alternative text is required.",
      };
    }
  }

  const data: Record<string, unknown> = {};

  if (title !== undefined) data.title = title;
  if (generatedSlug !== undefined) data.slug = generatedSlug;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (content !== undefined) {
    data.content = content;
    data.readingTime = calculateBlogReadingTime(content);
  }
  if (featuredImage !== undefined) data.featuredImage = featuredImage;
  if (featuredImageAlt !== undefined) {
    data.featuredImageAlt = featuredImageAlt;
  }
  if (category !== undefined) data.category = category;
  if (status !== undefined) data.status = status;
  if (scheduledAt !== undefined) data.scheduledAt = scheduledAt;

  if (body.ogImage !== undefined) {
    data.ogImage = String(body.ogImage || "").trim().slice(0, 1_000);
  }

  if (body.tags !== undefined) {
    data.tags = normalizeBlogTags(body.tags);
  }

  if (body.keywords !== undefined) {
    data.keywords = normalizeBlogTags(body.keywords);
  }

  if (body.authorName !== undefined) {
    data.authorName =
      String(body.authorName || "Teeth and Gums Care")
        .trim()
        .slice(0, 120) || "Teeth and Gums Care";
  }

  if (body.authorRole !== undefined) {
    data.authorRole =
      String(body.authorRole || "Dental Care Team")
        .trim()
        .slice(0, 120) || "Dental Care Team";
  }

  if (body.metaTitle !== undefined) {
    data.metaTitle = String(body.metaTitle || "").trim().slice(0, 70);
  }

  if (body.metaDescription !== undefined) {
    data.metaDescription = String(body.metaDescription || "")
      .trim()
      .slice(0, 180);
  }

  if (body.canonicalUrl !== undefined) {
    data.canonicalUrl = String(body.canonicalUrl || "")
      .trim()
      .slice(0, 1_000);
  }

  if (body.isFeatured !== undefined) {
    data.isFeatured = Boolean(body.isFeatured);
  }

  if (body.isPinned !== undefined) {
    data.isPinned = Boolean(body.isPinned);
  }

  if (body.allowComments !== undefined) {
    data.allowComments = Boolean(body.allowComments);
  }

  if (body.robotsIndex !== undefined) {
    data.robotsIndex = Boolean(body.robotsIndex);
  }

  if (body.robotsFollow !== undefined) {
    data.robotsFollow = Boolean(body.robotsFollow);
  }

  if (body.faqs !== undefined) {
    data.faqs = normalizeFaqs(body.faqs);
  }

  if (status === "published") {
    data.publishedAt = parseOptionalDate(body.publishedAt) || new Date();
    data.scheduledAt = null;
  } else if (status === "scheduled") {
    data.publishedAt = null;
  } else if (status === "draft" || status === "archived") {
    data.scheduledAt = null;
  }

  if (adminId && mongoose.isValidObjectId(adminId)) {
    data.updatedBy = adminId;

    if (!blogId) {
      data.createdBy = adminId;
    }
  }

  return {
    success: true,
    data,
  };
}

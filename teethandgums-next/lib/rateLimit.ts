import { LRUCache } from "lru-cache";
import type { NextRequest } from "next/server";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
  identifier?: string;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  message: string;
};

const tokenCache = new LRUCache<string, number[]>({
  max: 10_000,
  ttlAutopurge: true,
});

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export function rateLimit(
  req: NextRequest,
  options: RateLimitOptions,
): RateLimitResult {
  if (options.windowMs <= 0 || options.maxRequests <= 0) {
    throw new Error(
      "Rate limit windowMs and maxRequests must be greater than zero",
    );
  }

  const now = Date.now();
  const identifier = options.identifier?.trim() || getClientIp(req);
  const key = `${options.keyPrefix}:${identifier}`;

  const validTimestamps = (tokenCache.get(key) || []).filter(
    (timestamp) => now - timestamp < options.windowMs,
  );

  if (validTimestamps.length >= options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetAt: validTimestamps[0] + options.windowMs,
      message: "Too many requests. Please try again later.",
    };
  }

  validTimestamps.push(now);

  tokenCache.set(key, validTimestamps, {
    ttl: options.windowMs,
  });

  return {
    success: true,
    limit: options.maxRequests,
    remaining: Math.max(
      options.maxRequests - validTimestamps.length,
      0,
    ),
    resetAt: validTimestamps[0] + options.windowMs,
    message: "Allowed",
  };
}

export function getRateLimitHeaders(
  limit: Pick<
    RateLimitResult,
    "limit" | "remaining" | "resetAt"
  >,
) {
  return {
    "RateLimit-Limit": String(limit.limit),
    "RateLimit-Remaining": String(limit.remaining),
    "RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
  };
}

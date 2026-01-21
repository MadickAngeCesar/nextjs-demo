import arcjet, { tokenBucket } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter for general API routes
 * 100 requests per minute per IP
 */
export const generalRateLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 100, // 100 tokens per minute
      interval: 60, // per 60 seconds
      capacity: 100, // bucket capacity
    }),
  ],
});

/**
 * Rate limiter for AI endpoints
 * 10 requests per minute per IP
 * AI endpoints are more expensive to process
 */
export const aiRateLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // 10 tokens per minute
      interval: 60, // per 60 seconds
      capacity: 10, // bucket capacity
    }),
  ],
});

/**
 * Rate limiter for authentication endpoints
 * 5 requests per minute per IP
 * Auth endpoints should be more restrictive to prevent brute force
 */
export const authRateLimiter = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // 5 tokens per minute
      interval: 60, // per 60 seconds
      capacity: 5, // bucket capacity
    }),
  ],
});

/**
 * Response for rate limit exceeded
 */
const rateLimitResponse = (reason: string) =>
  NextResponse.json(
    {
      error: "Too Many Requests",
      message: `Rate limit exceeded. ${reason}`,
    },
    { status: 429 }
  );

/**
 * Middleware wrapper for general API rate limiting
 * Use this for most API endpoints
 *
 * @example
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   const response = await withGeneralRateLimit(req);
 *   if (response) return response; // Rate limit exceeded
 *
 *   // Your endpoint logic here
 *   return NextResponse.json({ success: true });
 * }
 * ```
 */
export async function withGeneralRateLimit(req: NextRequest) {
  const decision = await generalRateLimiter.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return rateLimitResponse("Please try again later.");
    }
    return rateLimitResponse("Request denied.");
  }

  return null; // Request is allowed
}

/**
 * Middleware wrapper for AI endpoint rate limiting
 * Use this for expensive AI operations (chat, generation, analysis)
 *
 * @example
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   const response = await withAiRateLimit(req);
 *   if (response) return response; // Rate limit exceeded
 *
 *   // Your AI endpoint logic here
 *   return NextResponse.json({ success: true });
 * }
 * ```
 */
export async function withAiRateLimit(req: NextRequest) {
  const decision = await aiRateLimiter.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return rateLimitResponse(
        "AI endpoints are rate limited. Please try again in a moment."
      );
    }
    return rateLimitResponse("Request denied.");
  }

  return null; // Request is allowed
}

/**
 * Middleware wrapper for authentication rate limiting
 * Use this for login, signup, and password reset endpoints
 * More restrictive to prevent brute force attacks
 *
 * @example
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   const response = await withAuthRateLimit(req);
 *   if (response) return response; // Rate limit exceeded
 *
 *   // Your auth endpoint logic here
 *   return NextResponse.json({ success: true });
 * }
 * ```
 */
export async function withAuthRateLimit(req: NextRequest) {
  const decision = await authRateLimiter.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return rateLimitResponse(
        "Too many authentication attempts. Please try again later."
      );
    }
    return rateLimitResponse("Request denied.");
  }

  return null; // Request is allowed
}

/**
 * Custom rate limiter for specific use cases
 * Allows fine-tuning of rate limit parameters
 *
 * @param refillRate - Number of tokens to refill per interval
 * @param interval - Time in seconds for refill
 * @param capacity - Maximum tokens in bucket
 * @returns Middleware function
 *
 * @example
 * ```typescript
 * const customLimiter = createCustomRateLimiter(50, 60, 50);
 * export async function POST(req: NextRequest) {
 *   const response = await customLimiter(req);
 *   if (response) return response;
 *   // ... endpoint logic
 * }
 * ```
 */
export function createCustomRateLimiter(
  refillRate: number,
  interval: number,
  capacity: number
) {
  const limiter = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
      tokenBucket({
        mode: "LIVE",
        refillRate,
        interval,
        capacity,
      }),
    ],
  });

  return async (req: NextRequest) => {
    const decision = await limiter.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return rateLimitResponse("Rate limit exceeded.");
      }
      return rateLimitResponse("Request denied.");
    }

    return null; // Request is allowed
  };
}

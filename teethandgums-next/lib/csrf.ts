import crypto from "node:crypto";
import type { NextRequest } from "next/server";

const CSRF_TOKEN_BYTES = 32;

export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_BYTES).toString("hex");
}

export function verifyCsrfToken(req: NextRequest): boolean {
  const csrfCookie = req.cookies.get("csrfToken")?.value;
  const csrfHeader = req.headers.get("x-csrf-token");

  if (!csrfCookie || !csrfHeader) {
    return false;
  }

  const cookieBuffer = Buffer.from(csrfCookie);
  const headerBuffer = Buffer.from(csrfHeader);

  if (cookieBuffer.length !== headerBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(cookieBuffer, headerBuffer);
}

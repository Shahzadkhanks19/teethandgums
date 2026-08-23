import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export type AdminTokenPayload = {
  id: string;
  email?: string;
  purpose?: string;
};

function isAdminTokenPayload(
  value: string | JwtPayload,
): value is JwtPayload & AdminTokenPayload {
  return (
    typeof value !== "string" &&
    typeof value.id === "string" &&
    value.id.length > 0
  );
}

function verifyToken(token: string | null): AdminTokenPayload | null {
  if (!token) return null;

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    return isAdminTokenPayload(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export function verifyAdminToken(
  authHeader: string | null,
): AdminTokenPayload | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  return verifyToken(token || null);
}

export async function verifyAdminCookie() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get("adminToken")?.value || null);
}

export function verifyAdminRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return verifyAdminToken(authHeader);
  }

  return verifyToken(
    req.cookies.get("adminToken")?.value || null,
  );
}

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function hasValidAdminToken(token: string | undefined): boolean {
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) return false;

  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminDashboard = pathname.startsWith("/admin/dashboard");
  const isAdminLogin = pathname === "/admin/login";

  const token = request.cookies.get("adminToken")?.value;
  const isAuthenticated = hasValidAdminToken(token);

  if (isAdminDashboard && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/login",
    "/admin/dashboard/:path*",
    "/api/admin/:path*",
  ],
};

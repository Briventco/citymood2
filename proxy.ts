import { NextResponse, type NextRequest } from "next/server";

// Optimistic check for the newsroom (ADMIN_SPEC §3, "Access control"): any
// /admin route except sign-in and password reset needs a session cookie. This
// only checks that the cookie exists. Every page and server action verifies the
// session and the role again (lib/admin/session.ts), because a proxy alone is
// not a security boundary.

const SESSION_COOKIE = "cm_newsroom";
const PUBLIC_ADMIN = ["/admin/sign-in", "/admin/reset-password"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_ADMIN.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/sign-in";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

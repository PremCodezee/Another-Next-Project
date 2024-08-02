import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const isPublic = path === "/login" || path === "/signup" || path === "/verifyemail";

  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (path === "/profile" && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (path.startsWith("/profile/") && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile", "/login", "/signup", "/profile/:path*", "/verifyemail"],
};

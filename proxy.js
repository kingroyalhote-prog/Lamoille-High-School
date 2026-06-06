import { NextResponse } from "next/server"

export function proxy(request) {
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes("favicon")
  ) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/maintenance", request.url))
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

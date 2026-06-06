import { NextResponse } from "next/server"

export async function proxy(request) {
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const response = await fetch(
    `${supabaseUrl}/rest/v1/site_settings?select=maintenance_mode&id=eq.1`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: "no-store",
    }
  )

  const data = await response.json()

  if (data?.[0]?.maintenance_mode === true) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data } = await supabase
    .from("site_settings")
    .select("maintenance_mode")
    .eq("id", 1)
    .single()

  if (data?.maintenance_mode === true) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}

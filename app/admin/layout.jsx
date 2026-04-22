"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState("checking")

  useEffect(() => {
    async function checkAccess() {
      // 🔐 Get current user session
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      // 🔒 Get role from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (!profile) {
        await supabase.auth.signOut()
        router.replace("/login")
        return
      }

      const allowedRoles = ["staff_admin", "master_admin"]

      // 🚫 Block unauthorized users
      if (!allowedRoles.includes(profile.role)) {
        await supabase.auth.signOut()
        router.replace("/login")
        return
      }

      // ✅ Allow access
      setStatus("allowed")
    }

    checkAccess()
  }, [router])

  if (status === "checking") {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Checking access...</p>
          </div>
        </section>
      </main>
    )
  }

  // safety fallback (prevents weird blank states)
  if (status !== "allowed") return null

  return children
}

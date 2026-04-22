"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      // ⚡ FAST: get session immediately
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/login")
        return
      }

      const user = session.user

      // 🔒 check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      const allowedRoles = ["staff_admin", "master_admin"]

      if (!profile || !allowedRoles.includes(profile.role)) {
        await supabase.auth.signOut()
        router.replace("/login")
        return
      }

      setAllowed(true)
      setLoading(false)
    }

    checkAccess()
  }, [router])

  if (loading) {
    return (
      <main className="content">
        <section className="section">
          <div className="container">
            <p>Loading admin...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!allowed) return null

  return children
}

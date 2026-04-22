"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // 🚫 Not logged in
        if (!session) {
          router.replace("/login")
          return
        }

        const user = session.user

        // 🔒 Check role
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

        // ✅ Allow access
        setAllowed(true)
        setLoading(false)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
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

  if (!allowed) return null

  return children
}

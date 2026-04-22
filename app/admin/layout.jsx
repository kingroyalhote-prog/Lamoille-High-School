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
      // 🔥 Wait for session properly
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (!session) {
        router.replace("/login")
        return
      }

      const user = session.user

      // 🔒 Get profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      console.log("USER ID:", user.id)
      console.log("PROFILE:", profile)

      if (error || !profile) {
        await supabase.auth.signOut()
        router.replace("/login")
        return
      }

      const allowedRoles = ["staff_admin", "master_admin"]

      if (!allowedRoles.includes(profile.role)) {
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
            <p>Checking access...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!allowed) return null

  return children
}

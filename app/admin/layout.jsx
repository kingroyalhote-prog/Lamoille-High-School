"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState("checking")

  useEffect(() => {
    async function checkAccess() {
      // 🔥 FIX: use session instead of getUser
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const user = session?.user

      if (!user) {
        router.replace("/login")
        return
      }

      // 🔒 Get role
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

      if (!allowedRoles.includes(profile.role)) {
        await supabase.auth.signOut()
        router.replace("/login")
        return
      }

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

  if (status !== "allowed") return null

  return children
}

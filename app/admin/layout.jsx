"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState("checking")

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      console.log("admin user:", user)
      console.log("admin user error:", userError)

      if (!user) {
        router.replace("/login")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      console.log("admin profile:", profile)
      console.log("admin profile error:", profileError)

      if (profileError || !profile) {
        router.replace("/login")
        return
      }

      if (profile.role !== "admin" && profile.role !== "master_admin") {
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

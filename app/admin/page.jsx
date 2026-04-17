"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  return (
    <main className="page-shell">
      <div className="content-card">
        <h1>Admin Dashboard</h1>
        <p>You are logged in.</p>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({
    announcements: 0,
    staff: 0,
    jobs: 0,
    applications: 0,
  })

  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // get counts
      const [a, s, j, ap] = await Promise.all([
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        supabase.from("staff_members").select("*", { count: "exact", head: true }),
        supabase.from("job_postings").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("*", { count: "exact", head: true }),
      ])

      setCounts({
        announcements: a.count || 0,
        staff: s.count || 0,
        jobs: j.count || 0,
        applications: ap.count || 0,
      })

      setLoading(false)
    }

    init()
  }, [])

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "20px" }}>
        <h1>Admin Dashboard</h1>
        <p>Manage your entire site from here.</p>
      </div>

      <div className="info-grid">
        <div className="content-card">
          <h2>Announcements</h2>
          <p>{counts.announcements} total</p>
          <Link href="/admin/announcements">Manage</Link>
        </div>

        <div className="content-card">
          <h2>Staff Directory</h2>
          <p>{counts.staff} staff</p>
          <Link href="/admin/staff">Manage</Link>
        </div>

        <div className="content-card">
          <h2>Jobs</h2>
          <p>{counts.jobs} postings</p>
          <Link href="/admin/jobs">Manage</Link>
        </div>

        <div className="content-card">
          <h2>Applications</h2>
          <p>{counts.applications} submitted</p>
          <Link href="/admin/applications">Review</Link>
        </div>
      </div>
    </main>
  )
}

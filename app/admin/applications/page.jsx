"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminApplicationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      await loadApplications()
      setLoading(false)
    }

    init()
  }, [router])

  const loadApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*, job_postings(title)")
      .order("submitted_at", { ascending: false })

    if (!error) {
      setApplications(data || [])
    }
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("applications")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (!error) {
      await loadApplications()
    }
  }

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>

  return (
    <main className="page-shell">
      <div className="content-card" style={{ marginBottom: "24px" }}>
        <h1>Review Applications</h1>
        <p>Review incoming applications and update their status.</p>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        {applications.length ? (
          applications.map((app) => (
            <div key={app.id} className="content-card">
              <p className="announcement-date">Status: {app.status}</p>
              <h2 style={{ marginBottom: "8px" }}>{app.applicant_name}</h2>
              <p><strong>Job:</strong> {app.job_postings?.title || "Unknown job"}</p>
              <p><strong>Email:</strong> {app.applicant_email}</p>
              <p><strong>Phone:</strong> {app.applicant_phone || "Not provided"}</p>
              <p><strong>Notes:</strong> {app.review_notes || "No notes submitted"}</p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
                <button className="btn btn-primary" type="button" onClick={() => updateStatus(app.id, "accepted")}>
                  Accept
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => updateStatus(app.id, "denied")}>
                  Deny
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => updateStatus(app.id, "pending")}>
                  Set Pending
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="content-card">
            <h2>No applications yet</h2>
          </div>
        )}
      </div>
    </main>
  )
}
